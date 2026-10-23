import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_CHARS = 32_000;
const SHEETS_TIMEOUT_MS = 20_000;

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  service: 80,
  message: 4000,
  company: 120,
  business_type: 80,
  website: 200,
};

const ALLOWED_SERVICES = [
  "AI Automation",
  "AI Agent",
  "AI Voice Agent",
  "WhatsApp Automation",
  "Website",
  "Web Application",
  "Mobile App",
  "CRM",
  "ERP",
  "Other",
];

const GENERIC_ERROR = "Unable to save your inquiry. Please try again.";
const UNCONFIRMED_ERROR =
  "We could not confirm that your inquiry was saved. Please wait a moment before trying again.";

export async function POST(request) {
  const requestId = crypto.randomUUID();
  try {
    const raw = await request.text();
    if (!raw || raw.length > MAX_BODY_CHARS) {
      logDiag(requestId, "body_too_large", { length: raw ? raw.length : 0 });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      logDiag(requestId, "invalid_json");
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      logDiag(requestId, "invalid_body");
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const website = clip(cleanText(body.website), LIMITS.website);
    if (website) {
      logDiag(requestId, "honeypot");
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    const name = clip(cleanText(body.name), LIMITS.name);
    const email = clip(cleanText(body.email).toLowerCase(), LIMITS.email);
    const phone = clip(cleanText(body.phone), LIMITS.phone);
    const service = clip(cleanText(body.service), LIMITS.service);
    const message = clip(cleanText(body.message), LIMITS.message);
    const company = clip(cleanText(body.company), LIMITS.company);
    const business_type = clip(cleanText(body.business_type), LIMITS.business_type);

    if (!name || !email || !service || !message) {
      logDiag(requestId, "missing_fields");
      return NextResponse.json(
        { error: "Name, email, required service, and message are mandatory." },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      logDiag(requestId, "invalid_email");
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!ALLOWED_SERVICES.includes(service)) {
      logDiag(requestId, "invalid_service");
      return NextResponse.json({ error: "Please choose a valid service." }, { status: 400 });
    }

    const webAppUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;
    const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
    if (!isAllowedWebAppUrl(webAppUrl) || !secret) {
      logDiag(requestId, "misconfigured");
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 503 });
    }

    const payload = {
      name,
      email,
      phone,
      service,
      message,
      company,
      business_type,
      token: secret,
      request_id: requestId,
    };

    const result = await postToAppsScript(webAppUrl, payload);
    logDiag(requestId, "apps_script_response", {
      httpStatus: result.httpStatus,
      redirected: result.redirected,
      gasError: result.gasError,
      gasBody: result.gasBody,
    });
    if (result.status === "stored") {
      logDiag(requestId, "stored", {
        httpStatus: result.httpStatus,
        redirected: result.redirected,
        gasBody: result.gasBody,
      });
      return NextResponse.json({ success: true });
    }
    if (result.status === "unconfirmed") {
      logDiag(requestId, "unconfirmed", {
        httpStatus: result.httpStatus,
        gasError: result.gasError,
        gasBody: result.gasBody,
      });
      return NextResponse.json({ error: UNCONFIRMED_ERROR }, { status: 503 });
    }

    logDiag(requestId, "store_failed", {
      httpStatus: result.httpStatus,
      redirected: result.redirected,
      gasError: result.gasError,
      gasBody: result.gasBody,
    });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  } catch {
    logDiag(requestId, "invalid_request");
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

function logDiag(requestId, step, extra = {}) {
  console.error("contact_diag", {
    requestId,
    step,
    httpStatus: extra.httpStatus ?? null,
    redirected: extra.redirected ?? null,
    gasError: extra.gasError ?? null,
    gasBody: extra.gasBody ?? null,
    length: extra.length ?? null,
  });
}

function sanitizeGasBody(parsed, rawText) {
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return {
      ok: parsed.ok === true,
      success: parsed.success === true,
      stored: parsed.stored === true,
      stage: typeof parsed.stage === "string" ? parsed.stage : null,
      errorCode:
        typeof parsed.errorCode === "string"
          ? parsed.errorCode
          : typeof parsed.error === "string"
            ? parsed.error
            : null,
      lastRow: typeof parsed.lastRow === "number" ? parsed.lastRow : null,
    };
  }
  const snippet = typeof rawText === "string" ? rawText.trim() : "";
  return {
    parseable: false,
    contentHint: snippet.startsWith("<") ? "html" : snippet ? "non_json" : "empty",
  };
}

function cleanText(value) {
  if (value == null) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function clip(value, max) {
  return value.length <= max ? value : value.slice(0, max);
}

function isStoredConfirmation(parsed) {
  return Boolean(
    parsed &&
      parsed.stored === true &&
      (parsed.ok === true || parsed.success === true)
  );
}

function isAllowedWebAppUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "script.google.com" &&
      parsed.pathname.includes("/macros/s/") &&
      parsed.pathname.endsWith("/exec")
    );
  } catch {
    return false;
  }
}

async function postToAppsScript(url, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHEETS_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });

    const { parsed, rawText } = await readResponseSafe(response);
    const gasBody = sanitizeGasBody(parsed, rawText);
    const gasError =
      parsed &&
      typeof (parsed.errorCode || parsed.error) === "string" &&
      !isStoredConfirmation(parsed)
        ? parsed.errorCode || parsed.error
        : null;

    if (response.ok && isStoredConfirmation(parsed)) {
      return {
        status: "stored",
        httpStatus: response.status,
        redirected: response.redirected,
        gasError: null,
        gasBody,
      };
    }

    return {
      status: "failed",
      httpStatus: response.status,
      redirected: response.redirected,
      gasError,
      gasBody,
    };
  } catch (err) {
    if (err && err.name === "AbortError") {
      return {
        status: "unconfirmed",
        httpStatus: null,
        redirected: null,
        gasError: "timeout",
        gasBody: null,
      };
    }
    return {
      status: "failed",
      httpStatus: null,
      redirected: null,
      gasError: err && err.name ? err.name : "fetch_failed",
      gasBody: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function readResponseSafe(response) {
  let rawText = "";
  try {
    rawText = await response.text();
  } catch {
    return { parsed: null, rawText: "" };
  }
  if (!rawText) return { parsed: null, rawText: "" };
  try {
    return { parsed: JSON.parse(rawText), rawText };
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return { parsed: null, rawText };
    try {
      return { parsed: JSON.parse(match[0]), rawText };
    } catch {
      return { parsed: null, rawText };
    }
  }
}
