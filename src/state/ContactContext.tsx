import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { serviceOptions } from '../content/contact';

interface ContactState {
  service: string;
  setService: (value: string) => void;
  /** Preselect a service in the form, then move to the contact section. */
  requestService: (value: string) => void;
}

const ContactContext = createContext<ContactState | null>(null);

const isKnownService = (value: string) => (serviceOptions as readonly string[]).includes(value);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [service, setServiceState] = useState('');

  const setService = useCallback((value: string) => {
    setServiceState(value === '' || isKnownService(value) ? value : '');
  }, []);

  const requestService = useCallback(
    (value: string) => {
      setService(value);
      const params = new URLSearchParams(window.location.search);
      params.set('service', value);
      window.history.replaceState(null, '', `?${params.toString()}#contact`);
    },
    [setService],
  );

  // Support deep links such as ?service=Dog%20Bites#contact
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('service');
    if (fromUrl && isKnownService(fromUrl)) setServiceState(fromUrl);
  }, []);

  const value = useMemo(() => ({ service, setService, requestService }), [service, setService, requestService]);
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContact must be used inside <ContactProvider>');
  return ctx;
}
