/**
 * AppLattice contact form receiver.
 *
 * Copy this entire file into Extensions → Apps Script, then deploy a NEW
 * web app version. Do not click Run on doPost — the editor does not pass a
 * POST event, which causes: Cannot read properties of undefined (reading 'postData').
 * Use initializeSheet() to verify spreadsheet access.
 *
 * Script properties (Project Settings → Script properties):
 *   SPREADSHEET_ID   required
 *   WEBHOOK_SECRET   required — same value as GOOGLE_SHEETS_WEBHOOK_SECRET
 *
 * Sheet tab name: Contact Inquiries
 * Headers: Timestamp | Name | Email | Phone | Service | Message | Status | Company | Business Type
 */

var SHEET_NAME = "Contact Inquiries";
var STATUS_NEW = "New";
var MAX_BODY_CHARS = 32000;
var PROP_ATTEMPTS = 3;

var LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  service: 80,
  message: 4000,
  company: 120,
  businessType: 80,
};

var ALLOWED_SERVICES = [
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

var HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Phone",
  "Service",
  "Message",
  "Status",
  "Company",
  "Business Type",
];

function doGet() {
  console.log("stage=request_received method=GET");
  return fail_("request_received", "method_not_allowed");
}

function doPost(e) {
  var started = Date.now();
  try {
    console.log("stage=request_received");
    if (e == null) {
      return fail_("request_received", "missing_event");
    }

    var parsed = parsePayload_(e);
    if (parsed.errorCode) {
      return fail_(parsed.stage, parsed.errorCode);
    }
    console.log("stage=json_parsed");

    var props = readProps_();
    if (!props.ok) {
      return fail_("json_parsed", props.err);
    }

    if (!authorize_(payloadToken_(parsed.payload), props.webhookSecret)) {
      return fail_("json_parsed", "unauthorized");
    }
    console.log("stage=authentication_passed");

    var enquiry = normalizeEnquiry_(parsed.payload);
    if (enquiry.error) {
      return fail_("authentication_passed", enquiry.error);
    }

    var write = appendEnquiry_(enquiry.row, props.spreadsheetId);
    if (!write || !write.ok) {
      var writeErr = write && write.err ? write.err : "append_not_persisted";
      var writeStage = write && write.stage ? write.stage : "append_started";
      return fail_(writeStage, writeErr);
    }

    console.log("stage=append_completed lastRow=" + write.lastRow);
    return json_({
      ok: true,
      success: true,
      stored: true,
      stage: "append_completed",
      lastRow: write.lastRow,
    });
  } catch (err) {
    var code = classifyErr_(err);
    console.log("stage=fail errorCode=" + code + " duration_ms=" + (Date.now() - started));
    return fail_("fail", code);
  }
}

function parsePayload_(e) {
  var postData = e.postData;
  if (!postData || typeof postData.contents !== "string") {
    console.log("stage=request_received errorCode=no_postdata");
    return { stage: "request_received", errorCode: "no_postdata" };
  }
  if (postData.contents.length > MAX_BODY_CHARS) {
    console.log("stage=request_received errorCode=too_large");
    return { stage: "request_received", errorCode: "too_large" };
  }
    try {
      var parsed = JSON.parse(postData.contents);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { stage: "json_parsed", errorCode: "invalid_json" };
      }
      return { payload: parsed };
    } catch (err) {
    console.log("stage=json_parsed errorCode=invalid_json");
    return { stage: "json_parsed", errorCode: "invalid_json" };
  }
}

function payloadToken_(payload) {
  return payload && typeof payload.token === "string" ? payload.token : "";
}

function readProps_() {
  var last = "storage_timeout";
  for (var i = 0; i < PROP_ATTEMPTS; i++) {
    try {
      var all = PropertiesService.getScriptProperties().getProperties();
      var spreadsheetId = all && all.SPREADSHEET_ID ? String(all.SPREADSHEET_ID).trim() : "";
      var webhookSecret = all && all.WEBHOOK_SECRET ? String(all.WEBHOOK_SECRET) : "";
      if (!spreadsheetId) return { ok: false, err: "missing_spreadsheet_id" };
      if (!webhookSecret) return { ok: false, err: "missing_webhook_secret" };
      return { ok: true, spreadsheetId: spreadsheetId, webhookSecret: webhookSecret };
    } catch (err) {
      last = classifyErr_(err);
      console.log("stage=json_parsed errorCode=" + last + " attempt=" + i);
      Utilities.sleep(250 * (i + 1));
    }
  }
  return { ok: false, err: last };
}

function authorize_(provided, expected) {
  return provided === expected;
}

function normalizeEnquiry_(payload) {
  var name = clip_(cleanText_(payload.name), LIMITS.name);
  var email = clip_(cleanText_(payload.email).toLowerCase(), LIMITS.email);
  var phone = clip_(cleanText_(payload.phone), LIMITS.phone);
  var service = clip_(cleanText_(payload.service), LIMITS.service);
  var message = clip_(cleanText_(payload.message), LIMITS.message);
  var company = clip_(cleanText_(payload.company), LIMITS.company);
  var businessType = clip_(cleanText_(payload.business_type), LIMITS.businessType);

  if (!name || !email || !service || !message) {
    return { error: "missing_fields" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "invalid_email" };
  }
  if (ALLOWED_SERVICES.indexOf(service) === -1) {
    return { error: "invalid_service" };
  }

  return {
    row: [
      new Date().toISOString(),
      safeCell_(name),
      safeCell_(email),
      safeCell_(phone),
      safeCell_(service),
      safeCell_(message),
      STATUS_NEW,
      safeCell_(company),
      safeCell_(businessType),
    ],
  };
}

function appendEnquiry_(row, spreadsheetId) {
  console.log("stage=spreadsheet_open_started");
  var ss;
  try {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } catch (err) {
    console.log("stage=spreadsheet_opened errorCode=" + classifyErr_(err));
    return { ok: false, stage: "spreadsheet_opened", err: classifyErr_(err) };
  }
  console.log("stage=spreadsheet_opened sheets=" + ss.getNumSheets());

  console.log("stage=target_sheet_lookup");
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    console.log("stage=target_sheet_found errorCode=missing_tab");
    return { ok: false, stage: "target_sheet_found", err: "missing_tab" };
  }
  var before = sheet.getLastRow();
  console.log("stage=target_sheet_found lastRow=" + before);

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    console.log("stage=append_started errorCode=lock_timeout lastRow=" + before);
    return { ok: false, stage: "append_started", err: "lock_timeout", lastRow: before };
  }
  try {
    console.log("stage=append_started lastRow=" + before);
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    var after = sheet.getLastRow();
    console.log("stage=append_completed lastRow=" + after);
    if (after <= before) {
      return {
        ok: false,
        stage: "append_completed",
        err: "append_not_persisted",
        lastRow: after,
      };
    }
    return { ok: true, lastRow: after };
  } finally {
    lock.releaseLock();
  }
}

function classifyErr_(err) {
  var name = err && err.name ? String(err.name) : "";
  var msg = err && err.message ? String(err.message) : "";
  if (name === "DEADLINE_EXCEEDED" || msg.indexOf("DEADLINE_EXCEEDED") !== -1) {
    return "storage_timeout";
  }
  if (msg.indexOf("postData") !== -1) return "missing_event";
  if (msg.indexOf("missing_tab") !== -1) return "missing_tab";
  if (msg.indexOf("lock_timeout") !== -1) return "lock_timeout";
  if (msg.indexOf("missing_spreadsheet_id") !== -1) return "missing_spreadsheet_id";
  if (msg.indexOf("append_not_persisted") !== -1) return "append_not_persisted";
  return "write_failed";
}

function cleanText_(value) {
  if (value == null) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function clip_(value, max) {
  return value.length <= max ? value : value.slice(0, max);
}

function safeCell_(value) {
  if (!value) return "";
  if (/^[=+\-@\t\r]/.test(value)) {
    return "'" + value;
  }
  return value;
}

function fail_(stage, errorCode) {
  var code = errorCode || "write_failed";
  console.log("stage=" + stage + " errorCode=" + code);
  return json_({
    ok: false,
    success: false,
    stored: false,
    stage: stage,
    errorCode: code,
    error: code,
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Run this from the Apps Script editor to verify SPREADSHEET_ID and the
 * Contact Inquiries tab. Do not run doPost from the editor.
 */
function initializeSheet() {
  var props = readProps_();
  if (!props.ok) {
    throw new Error(props.err);
  }
  var ss = SpreadsheetApp.openById(props.spreadsheetId);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  var existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var missing = existing.every(function (cell) {
    return String(cell).trim() === "";
  });
  if (missing) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}
