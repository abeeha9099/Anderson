/**
 * Contact copy and form definition.
 * Source: audit/content-inventory.md sections 7, 9, 10, 11 and the "Form inventory". Verbatim unless
 * marked "UI microcopy". Template leftovers ("Start a project with me!", "Click to Enlarge") are not used.
 */

export const ctaBand = {
  heading: 'Talk to a Family Attorney Today!',
  body: 'Facing a family law matter? Get personalized legal advice and a clear understanding of your next steps. Call now to schedule your consultation.',
  cta: "Let's Talk",
} as const;

export const contactInfo = {
  eyebrow: 'I’m Here to Help',
  heading: 'Contact Me Today!',
  body: [
    'At Anderson Law Firm, trust, integrity, and client satisfaction are the foundation of my practice. I work closely with every client to provide strategic advice, strong representation, and peace of mind during challenging legal situations.',
    'Get in touch today to discuss your legal needs and see how I can be your dedicated attorney in Rock Hill, SC, for family law matters.',
  ],
  phone: { label: 'Phone', note: 'Questions or queries? Get in touch!' },
  email: { label: 'Support', note: 'Need help? Reach out today!' },
  hoursLabel: 'Business Hours',
} as const;

export const formIntro = {
  eyebrow: 'I’d Love to Hear From You',
  heading: 'Request an Appointment',
} as const;

/** Original Contact Form 7 "Services" options, verbatim and in order. */
export const serviceOptions = [
  'Premise Liability',
  'Vehicular Accidents',
  'Dog Bites',
  'Child Custody',
  'Child Support',
  'Adoption',
  'Visitation',
  'Alimony',
  'Post Separation',
  'Division of Assets',
  'Living Will',
  'Wills',
  'Other',
] as const;

export const formFields = {
  firstName: { label: 'First name', placeholder: 'John' },
  lastName: { label: 'Last name', placeholder: 'Smith' },
  email: { label: 'Email', placeholder: 'john@smith.com' },
  phone: { label: 'Phone Number', placeholder: '(123)456-7890' },
  zip: { label: 'Zip code', placeholder: '12345' },
  // Live text is "—Please choose an option—"; dashes removed at the client's request.
  services: { label: 'Services', placeholder: 'Please choose an option' },
  message: { label: 'Message', placeholder: 'Tell us how we can help' },
  submit: 'Submit',
} as const;

/** Original validation messages (from the live site's form CSS), plus one UI-microcopy message for an empty email. */
export const formErrors = {
  email: 'The email address is invalid, please check the formatting (e.g. email@domain.com)',
  /** UI microcopy — the original had no specific message for an empty required email. */
  emailMissing: 'Please enter your email address.',
  phone: 'Please enter a 10-digit phone number',
} as const;

/** UI microcopy — disclosure required because this demo has no form backend (notes §4). */
export const formDisclosure = {
  title: 'Demo form: not connected to a server yet.',
  body: 'Pressing Submit opens your email app with your message filled in, addressed to syretta@srandersonlawfirm.com. Nothing is sent until you send that email yourself.',
  opened:
    'Your email app should now open with your message ready to send. Nothing has been sent yet. If no email app opens, please email syretta@srandersonlawfirm.com or call (803) 980-5252.',
  subject: 'Appointment request from the website',
  required: 'Required',
} as const;
