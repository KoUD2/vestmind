'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import usePrefersReducedMotion from '@/shared/lib/usePrefersReducedMotion';
import { useBookAudit } from '../model/BookAuditContext';
import styles from './BookAuditModal.module.css';

type Panel = 'step1' | 'step2' | 'success' | 'error';

interface LeadData {
  process?: string;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  otherProcess?: string;
  notes?: string;
}

const STORE = 'vm-audit-lead';
const PROCESSES = ['Sales', 'Support', 'Docs / ops', 'Procurement / RFP', 'HR / onboarding', 'Other'];
const ROLES = ['Founder / CEO', 'Ops / COO', 'Dept lead', 'Other'];
const REQUIRED: Array<keyof LeadData> = ['name', 'email', 'company', 'role'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TITLE_ID: Record<Panel, string> = { step1: 'vm-t-step1', step2: 'vm-t-step2', success: 'vm-t-success', error: 'vm-t-error' };

function loadStored(): LeadData {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || '{}') as LeadData;
  } catch {
    return {};
  }
}

function validateField(k: keyof LeadData, data: LeadData): boolean {
  const v = (data[k] || '').trim();
  if (k === 'name' || k === 'company' || k === 'role') return v.length > 0;
  if (k === 'email') return EMAIL_RE.test(v);
  if (k === 'otherProcess') return data.process !== 'Other' || v.length > 0;
  return true;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export default function BookAuditModal() {
  const { isOpen, close, openerRef } = useBookAudit();
  const reduce = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [data, setData] = useState<LeadData>({});
  const [panel, setPanel] = useState<Panel>('step1');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, boolean>>>({});

  const dialogRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // hydrate + choose entry panel each time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    const stored = loadStored();
    setData(stored);
    setSubmitted(false);
    setSending(false);
    setErrors({});
    setPanel(stored.process ? 'step2' : 'step1');
  }, [isOpen]);

  const persist = useCallback((next: LeadData) => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, []);

  const update = useCallback(
    (k: keyof LeadData, v: string) => {
      setData((prev) => {
        const next = { ...prev, [k]: v };
        persist(next);
        return next;
      });
      if (submitted) setErrors((e) => ({ ...e, [k]: !validateField(k, { ...data, [k]: v }) }));
    },
    [submitted, data, persist]
  );

  const requestClose = useCallback(() => {
    close();
    const opener = openerRef.current;
    if (opener) requestAnimationFrame(() => opener.focus());
  }, [close, openerRef]);

  const pickProcess = useCallback(
    (process: string) => {
      setData((prev) => {
        const next: LeadData = { ...prev, process };
        if (process !== 'Other') delete next.otherProcess;
        persist(next);
        return next;
      });
      setPanel('step2');
    },
    [persist]
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      // honeypot: silently drop bots
      if (honeypotRef.current?.value) {
        requestClose();
        return;
      }
      const keys: Array<keyof LeadData> = [...REQUIRED];
      if (data.process === 'Other') keys.push('otherProcess');
      const nextErrors: Partial<Record<keyof LeadData, boolean>> = {};
      let firstBad: keyof LeadData | null = null;
      keys.forEach((k) => {
        const ok = validateField(k, data);
        nextErrors[k] = !ok;
        if (!ok && !firstBad) firstBad = k;
      });
      setErrors(nextErrors);
      if (firstBad) {
        dialogRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
        return;
      }

      setSending(true);
      try {
        const res = await fetch('/api/book-audit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...data, company_website: honeypotRef.current?.value || '' }),
        });
        if (!res.ok) throw new Error('bad status');
        try {
          sessionStorage.removeItem(STORE);
        } catch {
          /* ignore */
        }
        setData({});
        setPanel('success');
      } catch {
        setPanel('error');
      } finally {
        setSending(false);
      }
    },
    [data, requestClose]
  );

  // body scroll lock while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // move focus to a sensible target when the panel changes
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const target =
      panel === 'step1'
        ? dialog.querySelector<HTMLElement>('[data-process]')
        : panel === 'step2'
          ? dialog.querySelector<HTMLElement>('[name="name"]')
          : dialog.querySelector<HTMLElement>('button');
    const t = setTimeout(() => target?.focus(), reduce ? 0 : 60);
    return () => clearTimeout(t);
  }, [panel, isOpen, reduce]);

  // Esc closes, Tab is trapped
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const f = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute('disabled')
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [requestClose]
  );

  const isStep = panel === 'step1' || panel === 'step2';
  const rootClass = useMemo(() => (reduce ? styles.root : `${styles.root} ${styles.anim}`), [reduce]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={rootClass} onKeyDown={onKeyDown}>
      <div className={styles.backdrop} onClick={requestClose} />
      <div className={styles.scroll} onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}>
        <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={TITLE_ID[panel]}>
          <button type="button" aria-label="Close" className={styles.close} onClick={requestClose}>
            &times;
          </button>

          {isStep && (
            <p className={styles.progress}>{panel === 'step1' ? 'Step 1 of 2' : 'Step 2 of 2'}</p>
          )}

          {/* ---------- STEP 1: qualifier ---------- */}
          {panel === 'step1' && (
            <div>
              <h2 id="vm-t-step1" className={styles.title}>Which process quietly loses you the most time?</h2>
              <p className={styles.lead}>We map one process, put a dollar figure on it, and tell you honestly if AI is even worth it.</p>
              <div role="group" aria-label="Choose a process" className={styles.chipGrid}>
                {PROCESSES.map((p) => (
                  <button key={p} type="button" data-process={p} className={styles.chip} onClick={() => pickProcess(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------- STEP 2: contact ---------- */}
          {panel === 'step2' && (
            <form noValidate onSubmit={submit}>
              <div className={styles.procBar}>
                <span className={styles.procLabel}>
                  Process: <strong className={styles.procName}>{data.process}</strong>
                </span>
                <button type="button" className={styles.changeBtn} onClick={() => setPanel('step1')}>
                  &larr; Change process
                </button>
              </div>
              <h2 id="vm-t-step2" className={styles.titleSm}>Where do we send the audit?</h2>

              <div className={styles.fields}>
                <div className={styles.grid2}>
                  <Field id="vm-name" name="name" label="Name" autoComplete="name" value={data.name || ''} onChange={update} error={errors.name} errorMsg="Please tell us your name." />
                  <Field id="vm-email" name="email" label="Work email" type="email" autoComplete="email" value={data.email || ''} onChange={update} error={errors.email} errorMsg="Enter a valid email so we can reply." />
                  <Field id="vm-company" name="company" label="Company" autoComplete="organization" value={data.company || ''} onChange={update} error={errors.company} errorMsg="Please add your company." />

                  <div>
                    <label htmlFor="vm-role" className={styles.label}>Role</label>
                    <select
                      id="vm-role"
                      name="role"
                      className={styles.select}
                      value={data.role || ''}
                      aria-invalid={errors.role ? 'true' : 'false'}
                      aria-describedby={errors.role ? 'vm-err-role' : undefined}
                      onChange={(e) => update('role', e.target.value)}
                    >
                      <option value="" disabled>Select your role</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {errors.role && <p id="vm-err-role" className={styles.errorMsg}>Pick the closest role.</p>}
                  </div>
                </div>

                {data.process === 'Other' && (
                  <Field id="vm-otherproc" name="otherProcess" label="Which process?" value={data.otherProcess || ''} onChange={update} error={errors.otherProcess} errorMsg="Tell us which process." />
                )}

                <div>
                  <label htmlFor="vm-notes" className={styles.label}>
                    Anything we should know? <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="vm-notes"
                    name="notes"
                    rows={2}
                    className={styles.textarea}
                    placeholder="e.g. a pilot that stalled, a deadline you keep missing"
                    value={data.notes || ''}
                    onChange={(e) => update('notes', e.target.value)}
                  />
                </div>

                {/* anti-spam honeypot */}
                <div aria-hidden="true" className={styles.honeypot}>
                  <label htmlFor="vm-website">Company website</label>
                  <input ref={honeypotRef} id="vm-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
              </div>

              <button type="submit" className={styles.submit} disabled={sending}>
                {sending && <span aria-hidden="true" className={styles.spinner} />}
                <span>{sending ? 'Sending…' : 'Book a paid audit'}</span>
              </button>
              <p className={styles.submitNote}>No sales call scheduled automatically. We reply by email first.</p>
            </form>
          )}

          {/* ---------- SUCCESS ---------- */}
          {panel === 'success' && (
            <div>
              <div aria-hidden="true" className={styles.iconOk}>
                <span className={styles.check} />
              </div>
              <h2 id="vm-t-success" className={styles.titleLg}>Got it.</h2>
              <p className={styles.resultText}>
                We&apos;ll reply within one business day. If we think AI isn&apos;t worth it for your case, we&apos;ll tell you — that&apos;s the whole point.
              </p>
              <button type="button" className={styles.resultBtn} onClick={requestClose}>Close</button>
            </div>
          )}

          {/* ---------- ERROR ---------- */}
          {panel === 'error' && (
            <div>
              <div aria-hidden="true" className={styles.iconErr}>!</div>
              <h2 id="vm-t-error" className={styles.titleLg}>Something broke on our side.</h2>
              <p className={styles.resultText}>
                Email us directly at <a href="mailto:hello@vestmind.studio" className={styles.mailLink}>hello@vestmind.studio</a> and we&apos;ll pick it up.
              </p>
              <button type="button" className={styles.resultBtn} onClick={() => setPanel('step2')}>Try again</button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

interface FieldProps {
  id: string;
  name: keyof LeadData;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  error?: boolean;
  errorMsg: string;
  onChange: (k: keyof LeadData, v: string) => void;
}

function Field({ id, name, label, type = 'text', autoComplete, value, error, errorMsg, onChange }: FieldProps) {
  const errId = `vm-err-${name}`;
  return (
    <div>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className={styles.input}
        value={value}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(name, e.target.value)}
      />
      {error && <p id={errId} className={styles.errorMsg}>{errorMsg}</p>}
    </div>
  );
}
