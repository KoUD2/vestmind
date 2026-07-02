'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type MutableRefObject } from 'react';

interface BookAuditContextValue {
  isOpen: boolean;
  /** open the modal; an optional preselected process jumps straight to step 2 */
  open: (opener?: HTMLElement | null, preselect?: string | null) => void;
  close: () => void;
  /** element that triggered the modal, so focus can be restored on close */
  openerRef: MutableRefObject<HTMLElement | null>;
  /** process pre-selected by the trigger (e.g. "Discuss your case" → Other) */
  preselectRef: MutableRefObject<string | null>;
}

const BookAuditContext = createContext<BookAuditContextValue | null>(null);

export function BookAuditProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const preselectRef = useRef<string | null>(null);

  const open = useCallback((opener?: HTMLElement | null, preselect: string | null = null) => {
    openerRef.current = opener ?? (typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null);
    preselectRef.current = preselect;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close, openerRef, preselectRef }), [isOpen, open, close]);

  return <BookAuditContext.Provider value={value}>{children}</BookAuditContext.Provider>;
}

export function useBookAudit() {
  const ctx = useContext(BookAuditContext);
  if (!ctx) throw new Error('useBookAudit must be used within a BookAuditProvider');
  return ctx;
}
