import { Resend } from "resend";

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_INBOX = process.env.CONTACT_INBOX ?? "nithinpoolareddy@gmail.com";
const RESEND_FROM = process.env.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

export async function sendContactEmail(payload: ContactPayload) {
  if (!RESEND_API_KEY) {
    console.info("[contact] RESEND_API_KEY missing. Logging message instead.", payload);
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: [CONTACT_INBOX],
      reply_to: payload.email,
      subject: `Portfolio contact from ${payload.name}`,
      text: buildPlainText(payload),
      html: buildHtml(payload),
    });

    console.log("[contact] Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("[contact] Resend API error:", error);
    throw error;
  }
}

function buildPlainText({ name, email, company, message }: ContactPayload) {
  return `New portfolio contact
---------------------------
Name: ${name}
Email: ${email}
Company: ${company ?? "N/A"}

Message:
${message}`;
}

function buildHtml({ name, email, company, message }: ContactPayload) {
  return `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
      <h2>New portfolio inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      <p><strong>Message</strong></p>
      <pre style="white-space: pre-wrap; background:#f5f5f5; padding:12px; border-radius:12px;">${escapeHtml(message)}</pre>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
