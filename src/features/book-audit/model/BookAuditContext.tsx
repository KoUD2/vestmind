'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type MutableRefObject } from 'react';

interface BookAuditContextValue {
  isOpen: boolean;
  open: (opener?: HTMLElement | null) => void;
  close: () => void;
  /** element that triggered the modal, so focus can be restored on close */
  openerRef: MutableRefObject<HTMLElement | null>;
}

const BookAuditContext = createContext<BookAuditContextValue | null>(null);

export function BookAuditProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close, openerRef }), [isOpen, open, close]);

  return <BookAuditContext.Provider value={value}>{children}</BookAuditContext.Provider>;
}

export function useBookAudit() {
  const ctx = useContext(BookAuditContext);
  if (!ctx) throw new Error('useBookAudit must be used within a BookAuditProvider');
  return ctx;
}
