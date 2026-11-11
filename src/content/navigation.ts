/**
 * Primary navigation — labels and order exactly as the live site's menu.
 * Source: audit/content-inventory.md "Main navigation".
 * Inner pages remain on the live site, so links are absolute (all verified 200 on 2026-11-11).
 */
import { LIVE } from './site';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  /** Optional sub-heading groups (used by "More"). */
  sections: { heading?: string; links: NavLink[] }[];
}

export type NavItem = NavLink | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => 'sections' in item;

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: `${LIVE}/about/` },
  {
    label: 'Family Law',
    sections: [
      {
        links: [
          { label: 'Child Custody Lawyer', href: `${LIVE}/services/child-custody-lawyer/` },
          { label: 'Child Support Lawyer', href: `${LIVE}/services/child-support-lawyer/` },
          { label: 'Adoption Attorney', href: `${LIVE}/services/adoption-attorney/` },
          { label: 'Child Visitation Attorney', href: `${LIVE}/services/visitation-attorney/` },
          // Original menu items. Kept in the menu exactly as on the live site; NOT presented as
          // confirmed services elsewhere on the page until verified (implementation notes A10).
          { label: 'Paternity Law', href: `${LIVE}/services/paternity-lawyer/` },
          { label: 'LGBTQ+ Family Law', href: `${LIVE}/services/lgbt-family-attorney/` },
        ],
      },
    ],
  },
  {
    label: 'Divorce Lawyer',
    sections: [
      {
        links: [
          // Existing page that the live menu does not link (its parent item points to "#").
          { label: 'Divorce Lawyer', href: `${LIVE}/services/divorce-lawyer/` },
          { label: 'Alimony Divorce Attorney', href: `${LIVE}/services/alimony-lawyer/` },
          { label: 'Post Separation Support', href: `${LIVE}/services/separation-attorney/` },
          { label: 'Equitable Distribution', href: `${LIVE}/services/divorce-mediation-attorney/` },
        ],
      },
    ],
  },
  {
    label: 'Estate Planning',
    sections: [
      {
        links: [
          { label: 'Trusts', href: `${LIVE}/services/trust-lawyer/` },
          { label: 'Conservatorship', href: `${LIVE}/services/conservatorship/` },
          { label: 'Power of Attorney', href: `${LIVE}/services/power-of-attorney-lawyer/` },
          { label: 'Healthcare Power of Attorney', href: `${LIVE}/services/healthcare-proxy-lawyer/` },
          { label: 'Living Wills', href: `${LIVE}/services/living-will-attorney/` },
          { label: 'Wills', href: `${LIVE}/services/will-lawyer/` },
        ],
      },
    ],
  },
  {
    label: 'More',
    sections: [
      {
        heading: 'Areas We Serve',
        links: [
          { label: 'All Areas We Serve', href: `${LIVE}/areas-we-serve/` },
          { label: 'Gaffney, SC', href: `${LIVE}/gaffney-sc/` },
          { label: 'Fort Mill, SC', href: `${LIVE}/fort-mill-sc/` },
          { label: 'Charlotte, NC', href: `${LIVE}/charlotte-nc/` },
          { label: 'York, SC', href: `${LIVE}/york-sc/` },
          { label: 'Rock Hill, SC', href: `${LIVE}/rock-hill-sc/` },
          { label: 'Cherokee County, SC', href: `${LIVE}/cherokee-county-sc/` },
          { label: 'Lancaster County, SC', href: `${LIVE}/lancaster-county-sc/` },
          { label: 'Lake Wylie, SC', href: `${LIVE}/lake-wylie-sc/` },
          // Label verbatim from the live menu. Gastonia is in North Carolina — flagged (notes A3).
          { label: 'Gastonia, SC', href: `${LIVE}/gastonia-sc/` },
        ],
      },
      {
        links: [
          { label: 'FAQs', href: `${LIVE}/faqs/` },
          { label: 'Contact', href: '#contact' },
        ],
      },
    ],
  },
];

export const callNowLabel = 'Call Now';
