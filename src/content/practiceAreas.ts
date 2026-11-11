/**
 * Practice areas — the 17 homepage cards, verbatim (front description + back-of-card list).
 * Source: audit/content-inventory.md Section 3. Grouping follows the live site's menu groups.
 * Typos and legally meaningful wording are intentionally unchanged (implementation notes §B, §C).
 */
import { LIVE } from './site';

export type PracticeIcon =
  | 'custody' | 'support' | 'adoption' | 'visitation'
  | 'divorce' | 'alimony' | 'separation' | 'assets'
  | 'trusts' | 'conservatorship' | 'poa' | 'healthcare' | 'livingWill' | 'will'
  | 'premises' | 'vehicle' | 'dog';

export interface PracticeArea {
  id: string;
  title: string;
  icon: PracticeIcon;
  description: string;
  /** Present only where the original card had it ("Our Services Include:"). */
  listLabel?: string;
  points: string[];
  link:
    | { kind: 'page'; href: string }
    /** Original page returns 404 — temporary demo behavior: go to the contact form with this service preselected. */
    | { kind: 'contact'; service: string; originalHref: string };
}

export interface PracticeGroup {
  id: string;
  /** Tab label (new UI microcopy derived from the menu; notes §11). */
  label: string;
  areas: PracticeArea[];
}

export const practiceIntro = {
  eyebrow: 'Practice Areas',
  heading: 'Reliable Legal Expertise Awaits',
  body: 'When it comes to legal representation, trust is paramount. At Anderson Law Firm in Rock Hill, SC, I pride myself on integrity, expertise, and client satisfaction. Read more to discover how I can be your ally in your legal journey.',
} as const;

export const practiceGroups: PracticeGroup[] = [
  {
    id: 'family',
    label: 'Family Law',
    areas: [
      {
        id: 'child-custody',
        title: 'Child Custody',
        icon: 'custody',
        description:
          'Navigating a child custody dispute? It’s crucial to have an experienced child custody lawyer by your side. Anderson Law Firm is dedicated to protecting your rights and ensuring the well-being of your children.',
        points: ['Experienced child custody lawyer', 'Child-focused legal strategies', 'Rigorous case preparation', 'Supportive client service'],
        link: { kind: 'page', href: `${LIVE}/services/child-custody-lawyer/` },
      },
      {
        id: 'child-support',
        title: 'Child Support',
        icon: 'support',
        description:
          'Anderson Law Firm in Rock Hill, SC, specializes in ensuring fair child support agreements. An experienced child support lawyer, I am committed to protecting your child’s best interests. I work closely with you!',
        points: ['Expert child support lawyer', 'Child-centric approach', 'Fair agreement negotiation', 'Dedicated and caring service'],
        link: { kind: 'page', href: `${LIVE}/services/child-support-lawyer/` },
      },
      {
        id: 'adoption',
        title: 'Adoption',
        icon: 'adoption',
        description:
          'Expanding your family through adoption? Anderson Law Firm can help. As a compassionate adoption attorney, I am dedicated to guiding you through this emotional journey. I provide the legal support needed.',
        points: ['Caring adoption attorney', 'Streamlined legal guidance', 'Personalized support', 'Committed to family-building'],
        link: { kind: 'page', href: `${LIVE}/services/adoption-attorney/` },
      },
      {
        id: 'visitation',
        title: 'Visitation',
        icon: 'visitation',
        description:
          'Struggling with child visitation issues? Anderson Law Firm offers an experienced child visitation attorney to assist you. I am committed to ensuring that your child’s best interests are at the heart of every decision.',
        points: ['Expert child visitation attorney', 'Child-focused legal strategies', 'Fair agreement negotiation', 'Personalized client support'],
        link: { kind: 'page', href: `${LIVE}/services/visitation-attorney/` },
      },
    ],
  },
  {
    id: 'divorce',
    label: 'Divorce',
    areas: [
      {
        id: 'divorce-law',
        title: 'Divorce Law',
        icon: 'divorce',
        description:
          'Facing the end of a marriage? Anderson Law Firm’s divorce lawyer is here to support you. With tailored legal strategies, I’ll navigate the complexities of divorce law, ensuring your interests are protected.',
        points: ['Skilled Divorce Lawyer', 'Customized legal strategies', 'Asset protection', 'Compassionate client care'],
        link: { kind: 'page', href: `${LIVE}/services/divorce-lawyer/` },
      },
      {
        id: 'alimony',
        title: 'Alimony',
        icon: 'alimony',
        description:
          'Seeking fair alimony after a divorce? As an alimony lawyer, I am determined to achieve an equitable outcome. I’ll ensure that you receive or pay a fair amount, reflecting the circumstances of your marriage.',
        points: ['Expert Alimony Lawyer', 'Equitable outcome focus', 'Tailored legal advice', 'Thorough case evaluation'],
        link: { kind: 'page', href: `${LIVE}/services/alimony-lawyer/` },
      },
      {
        id: 'post-separation',
        title: 'Post Separation',
        icon: 'separation',
        description:
          'Going through a separation? Anderson Law Firm specializes in post separation support. I am dedicated to protecting your interests, ensuring a fair and equitable resolution as you transition into the next phase of your life.',
        points: ['Post Separation Support', 'Client-focused approach', 'Equitable resolutions', 'Comprehensive legal assistance'],
        link: { kind: 'page', href: `${LIVE}/services/separation-attorney/` },
      },
      {
        id: 'division-of-assets',
        title: 'Division of Assets',
        icon: 'assets',
        description:
          'Dividing assets after divorce? Anderson Law Firm ensures equitable distribution of marital property. I work closely with you to achieve a fair division, considering all aspects and complexities of your situation.',
        points: ['Equitable Distribution focus', 'Asset evaluation and division', 'Customized legal strategies', 'Client-centric approach'],
        link: { kind: 'page', href: `${LIVE}/services/divorce-mediation-attorney/` },
      },
    ],
  },
  {
    id: 'estate',
    label: 'Estate Planning',
    areas: [
      {
        id: 'trusts',
        title: 'Trusts',
        icon: 'trusts',
        description:
          'Safeguard your assets and secure your legacy with a trusted trust lawyer who designs personalized estate plans to protect your family’s future and simplify wealth distribution.',
        points: ['Revocable Living Trusts', 'Irrevocable Trust Planning', 'Special Needs Trusts', 'Family & Charitable Trusts', 'Trust Litigation Support'],
        link: { kind: 'page', href: `${LIVE}/services/trust-lawyer/` },
      },
      {
        id: 'conservatorship',
        title: 'Conservatorship',
        icon: 'conservatorship',
        description:
          'Protect your loved one’s finances and future with a compassionate conservatorship attorney who provides trusted legal guidance to help you manage assets and fulfill fiduciary duties.',
        // Verbatim from the live site, where this list duplicates the Trusts list.
        // Flagged for client correction (implementation notes A4) — not altered.
        points: ['Revocable Living Trusts', 'Irrevocable Trust Planning', 'Special Needs Trusts', 'Family & Charitable Trusts', 'Trust Litigation Support'],
        link: { kind: 'page', href: `${LIVE}/services/conservatorship/` },
      },
      {
        id: 'power-of-attorney',
        title: 'Power of Attorney',
        icon: 'poa',
        description:
          'Plan ahead with a skilled power of attorney lawyer who prepares customized legal documents that protect your finances, secure your future, and ensure trusted decision-making.',
        points: ['Durable Power of Attorney Drafting', 'Financial & Legal Authority Planning', 'Elderly Parent Representation', 'Coordination With Estate Plans', 'Document Review & Updates'],
        link: { kind: 'page', href: `${LIVE}/services/power-of-attorney-lawyer/` },
      },
      {
        id: 'healthcare-power-of-attorney',
        title: 'Healthcare Power of Attorney',
        icon: 'healthcare',
        description:
          'Protect your medical decisions with a trusted healthcare proxy lawyer who helps you create legally valid documents ensuring your wishes are honored during any medical emergency.',
        points: ['Drafting Healthcare Power of Attorney', 'Medical Proxy & Agent Selection', 'End-of-Life Decision Planning', 'Living Will Coordination', 'Legal Review & Document Updates'],
        link: { kind: 'page', href: `${LIVE}/services/healthcare-proxy-lawyer/` },
      },
      {
        id: 'living-wills',
        title: 'Living Wills',
        icon: 'livingWill',
        description:
          'Take control of your healthcare future with a dedicated living will attorney who ensures your medical wishes are honored, your family is protected, and your decisions are legally secure.',
        listLabel: 'Our Services Include:',
        points: ['Drafting Custom Living Wills', 'Advance Directive Coordination', 'End of Life Planning Guidance', 'Legal Compliance Review', 'Ongoing Document Updates'],
        link: { kind: 'page', href: `${LIVE}/services/living-will-attorney/` },
      },
      {
        id: 'wills',
        title: 'Wills',
        icon: 'will',
        // Verbatim — the original has no closing period (notes C3).
        description:
          'Secure your family’s future with a trusted will lawyer who creates personalized, legally valid wills that protect your assets, honor your wishes, and simplify estate distribution',
        listLabel: 'Our Services Include:',
        points: ['Drafting and Updating Wills', 'Guardianship Designations', 'Executor Appointments', 'Estate Administration Support', 'Will and Trust Coordination'],
        link: { kind: 'page', href: `${LIVE}/services/will-lawyer/` },
      },
    ],
  },
  {
    // Listed last: whether the firm still offers these is unconfirmed (notes A2).
    id: 'injury',
    label: 'Personal Injury',
    areas: [
      {
        id: 'premise-liability',
        title: 'Premise Liability',
        icon: 'premises',
        description:
          'Suffered a slip or fall on someone’s property? Anderson Law Firm offers expert assistance in premise liability cases. As your slip fall lawyer, I work meticulously to ensure you get the compensation you deserve.',
        points: ['Expert slip fall lawyer', 'Meticulous case evaluation', 'Maximum compensation pursuit', 'Dedicated client support'],
        link: { kind: 'contact', service: 'Premise Liability', originalHref: `${LIVE}/services/slip-and-fall-attorney/` },
      },
      {
        id: 'vehicular-accidents',
        title: 'Vehicular Accidents',
        icon: 'vehicle',
        description:
          'Involved in a vehicular accident in Rock Hill, SC? Anderson Law Firm’s vehicle accident lawyers are here to protect your rights. I help secure the best possible outcome, making sure you get the compensation needed.',
        points: ['Skilled vehicle accident lawyers', 'Aggressive representation', 'Compensation recovery assistance', 'Personalized legal strategies'],
        link: { kind: 'contact', service: 'Vehicular Accidents', originalHref: `${LIVE}/services/vehicle-accident-lawyers/` },
      },
      {
        id: 'dog-bites',
        title: 'Dog Bites',
        icon: 'dog',
        description:
          'Been bitten by a dog? Anderson Law Firm is here to help. As an expert dog bite lawyer, I understand the trauma and will guide you through the process to claim compensation. With a compassionate approach and thorough expertise.',
        points: ['Expert dog bite lawyer', 'Compassionate approach', 'Comprehensive case building', 'Focused on fair compensation'],
        link: { kind: 'contact', service: 'Dog Bites', originalHref: `${LIVE}/services/dog-bite-lawyer/` },
      },
    ],
  },
];

/** Label used on the temporary contact links (original hero CTA wording). */
export const contactLinkLabel = 'Send Me a Message';
