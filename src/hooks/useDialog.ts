import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for the mobile menu: focus trap, Escape to close, page scroll lock,
 * and focus restored to the trigger on close.
 */
export function useDialog(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  returnFocusRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const returnTo = returnFocusRef.current;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    // Make everything outside the dialog inert (aria-modal alone is not honoured by every screen reader).
    const root = document.getElementById('root');
    const outside = root ? Array.from(root.children).filter((el) => panel && !el.contains(panel)) : [];
    outside.forEach((el) => el.setAttribute('inert', ''));

    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      outside.forEach((el) => el.removeAttribute('inert'));
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      returnTo?.focus();
    };
  }, [open, panelRef, onClose, returnFocusRef]);
}
