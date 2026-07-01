import { NextResponse } from 'next/server';

interface Lead {
  process?: string;
  otherProcess?: string;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  notes?: string;
  company_website?: string; // honeypot
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatLead(lead: Lead): string {
  const process = lead.process === 'Other' && lead.otherProcess ? `Other — ${lead.otherProcess}` : lead.process || '—';
  return [
    '🟤 New Vestmind audit lead',
    `Process: ${process}`,
    `Name: ${lead.name || '—'}`,
    `Email: ${lead.email || '—'}`,
    `Company: ${lead.company || '—'}`,
    `Role: ${lead.role || '—'}`,
    `Notes: ${lead.notes || '—'}`,
  ].join('\n');
}

export async function POST(request: Request) {
  let lead: Lead;
  try {
    lead = (await request.json()) as Lead;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // honeypot filled → pretend success, drop silently
  if (lead.company_website) return NextResponse.json({ ok: true });

  // server-side validation mirror
  if (!lead.name?.trim() || !EMAIL_RE.test(lead.email?.trim() || '') || !lead.company?.trim() || !lead.role?.trim()) {
    return NextResponse.json({ ok: false, error: 'invalid_fields' }, { status: 422 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: formatLead(lead), disable_web_page_preview: true }),
      });
      if (!res.ok) return NextResponse.json({ ok: false, error: 'telegram_failed' }, { status: 502 });
    } catch {
      return NextResponse.json({ ok: false, error: 'telegram_unreachable' }, { status: 502 });
    }
  } else {
    // Telegram not configured (e.g. local dev) — log so the flow still works end-to-end.
    console.log('[book-audit lead]\n' + formatLead(lead));
  }

  return NextResponse.json({ ok: true });
}
