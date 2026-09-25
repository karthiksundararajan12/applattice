import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const company = String(body.company ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const business_type = String(body.business_type ?? "").trim();
    const service = String(body.service ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !service) {
      return NextResponse.json(
        { error: "Name, email, and required service are mandatory." },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      console.info("Contact submission (Supabase not configured):", { name, email, company, phone, business_type, service, message });
      return NextResponse.json({ success: true, stored: false });
    }

    const { error } = await supabase.from("contact_inquiries").insert({
      name,
      company: company || null,
      phone: phone || null,
      email,
      business_type: business_type || null,
      service,
      message: message || null,
    });

    if (error) {
      console.error("contact_inquiries insert:", error.message);
      return NextResponse.json({ error: "Unable to save your inquiry." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact POST:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
