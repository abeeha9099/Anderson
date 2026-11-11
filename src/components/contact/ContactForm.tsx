import { ChevronDown, CircleAlert, Info, Send } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { formDisclosure, formErrors, formFields, serviceOptions } from '../../content/contact';
import { email as firmEmail } from '../../content/site';
import { useContact } from '../../state/ContactContext';
import { Button } from '../ui/Button';

type Values = { firstName: string; lastName: string; email: string; phone: string; zip: string; message: string };
type FieldName = keyof Values | 'service';
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.email.trim()) errors.email = formErrors.emailMissing;
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = formErrors.email;
  if (v.phone.trim()) {
    const digits = v.phone.replace(/\D/g, '');
    const ok = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
    if (!ok) errors.phone = formErrors.phone;
  }
  return errors;
}

const inputBase =
  'mt-2 block w-full rounded-md border bg-white px-4 font-body text-base text-ink placeholder:text-body/75 transition-[border-color,box-shadow] duration-150 focus:border-primary focus:shadow-[0_0_0_3px_rgb(38_115_164/0.22)] focus-visible:outline-none';

/**
 * Appointment request form — the live site's fields, labels, placeholders and options.
 * DEMO BEHAVIOUR: there is no backend. Submit validates, then opens the visitor's email app
 * (mailto:) with the details filled in. It never claims the message was sent.
 * A real form service is required before launch (docs/implementation-notes.md §4).
 */
export function ContactForm() {
  const { service, setService } = useContact();
  const [values, setValues] = useState<Values>({ firstName: '', lastName: '', email: '', phone: '', zip: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'invalid' | 'opened'>('idle');
  const refs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>>({});

  const update = (name: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
    if (status === 'opened') setStatus('idle');
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as FieldName[])[0];
    if (firstInvalid) {
      setStatus('invalid');
      refs.current[firstInvalid]?.focus();
      return;
    }
    const body = [
      `${formFields.firstName.label}: ${values.firstName}`,
      `${formFields.lastName.label}: ${values.lastName}`,
      `${formFields.email.label}: ${values.email}`,
      `${formFields.phone.label}: ${values.phone}`,
      `${formFields.zip.label}: ${values.zip}`,
      `${formFields.services.label}: ${service}`,
      '',
      `${formFields.message.label}:`,
      values.message,
    ].join('\n');
    setStatus('opened');
    window.location.href = `${firmEmail.href}?subject=${encodeURIComponent(formDisclosure.subject)}&body=${encodeURIComponent(body)}`;
  };

  const errorList = Object.entries(errors) as [FieldName, string][];

  const field = (name: keyof Values, type: string, autoComplete: string, extra: Record<string, string> = {}) => {
    const def = formFields[name];
    const id = `field-${name}`;
    const error = errors[name];
    return (
      <Field id={id} label={def.label} required={name === 'email'} error={error}>
        <input
          ref={(el) => {
            refs.current[name] = el;
          }}
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={def.placeholder}
          value={values[name]}
          onChange={update(name)}
          aria-required={name === 'email' || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} h-[3.25rem] ${error ? 'border-2 border-error focus:border-error focus:shadow-[0_0_0_3px_rgb(220_50_50/0.18)]' : 'border-body'}`}
          {...extra}
        />
      </Field>
    );
  };

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      // No-JS fallback: a plain mailto submission.
      action={firmEmail.href}
      method="post"
      encType="text/plain"
      aria-describedby="form-disclosure"
      className="mt-8"
    >
      {status === 'invalid' && errorList.length > 0 && (
        <div role="alert" className="animate-msg mb-6 flex gap-3 rounded-md border-l-4 border-error bg-mist px-4 py-3 text-[15px] text-ink">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error" />
          <div>
            <p className="font-display font-semibold">
              Please check {errorList.length === 1 ? 'this field' : `these ${errorList.length} fields`}:
            </p>
            <ul className="mt-1">
              {errorList.map(([name]) => (
                <li key={name}>
                  <a href={`#field-${name}`} className="underline underline-offset-2 hover:text-primary">
                    {name === 'service' ? formFields.services.label : formFields[name as keyof Values].label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        {field('firstName', 'text', 'given-name')}
        {field('lastName', 'text', 'family-name')}
        {field('email', 'email', 'email', { inputMode: 'email' })}
        {field('phone', 'tel', 'tel', { inputMode: 'tel' })}
        {field('zip', 'text', 'postal-code', { inputMode: 'numeric' })}

        <Field id="field-service" label={formFields.services.label}>
          <div className="relative">
            <select
              ref={(el) => {
                refs.current.service = el;
              }}
              id="field-service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={`${inputBase} h-[3.25rem] appearance-none border-body pr-11 ${service ? '' : 'text-body'}`}
            >
              <option value="">{formFields.services.placeholder}</option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt} className="text-ink">
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 mt-1 size-5 -translate-y-1/2 text-primary" />
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field id="field-message" label={formFields.message.label}>
            <textarea
              ref={(el) => {
                refs.current.message = el;
              }}
              id="field-message"
              name="message"
              rows={5}
              maxLength={2000}
              placeholder={formFields.message.placeholder}
              value={values.message}
              onChange={update('message')}
              className={`${inputBase} resize-y border-body py-3 leading-relaxed`}
            />
          </Field>
        </div>
      </div>

      <div id="form-disclosure" className="mt-6 flex gap-3 rounded-md bg-mist px-4 py-3.5 text-[14.5px] leading-snug text-ink">
        <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          <strong className="font-display font-semibold">{formDisclosure.title}</strong> {formDisclosure.body}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" icon={<Send className="size-[18px]" />} iconPosition="end" className="sm:min-w-48">
          {formFields.submit}
        </Button>
      </div>

      <p role="status" aria-live="polite" className={status === 'opened' ? 'animate-msg mt-4 text-[15px] leading-snug text-ink' : 'sr-only'}>
        {status === 'opened' ? formDisclosure.opened : ''}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-display text-sm font-semibold text-ink">
        {label}
        {required && (
          <span className="font-display text-xs font-medium tracking-[0.04em] text-body">{formDisclosure.required}</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="animate-msg mt-2 flex gap-1.5 text-sm leading-snug text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
