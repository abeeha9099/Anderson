/**
 * Service areas — the 10 homepage entries, labels and links verbatim (Section 12).
 * Grouped by state for readability (the state is part of each original label).
 * Entries without a page on the live site stay unlinked, as on the original.
 */
import { LIVE } from './site';

export interface Area {
  label: string;
  href: string | null;
}

export const areasIntro = {
  heading: 'Service Areas',
  body: 'I am proud to serve Rock Hill, SC, and the surrounding areas with my quality services.',
  allAreas: { label: 'All Areas We Serve', href: `${LIVE}/areas-we-serve/` },
} as const;

export const areaGroups: { state: string; areas: Area[] }[] = [
  {
    state: 'South Carolina',
    areas: [
      { label: 'Rock Hill, SC', href: `${LIVE}/rock-hill-sc/` },
      { label: 'Gaffney, SC', href: `${LIVE}/gaffney-sc/` },
      { label: 'Fort Mill, SC', href: `${LIVE}/fort-mill-sc/` },
      // Homepage label is "York County, SC"; the menu calls the same page "York, SC" (notes A6).
      { label: 'York County, SC', href: `${LIVE}/york-sc/` },
      { label: 'Cherokee County, SC', href: `${LIVE}/cherokee-county-sc/` },
      { label: 'Lancaster County, SC', href: `${LIVE}/lancaster-county-sc/` },
      { label: 'Lake Wylie, SC', href: `${LIVE}/lake-wylie-sc/` },
    ],
  },
  {
    state: 'North Carolina',
    areas: [
      { label: 'Charlotte, NC', href: `${LIVE}/charlotte-nc/` },
      { label: 'Mecklenburg County, NC', href: null },
      { label: 'Gaston County, NC', href: null },
    ],
  },
];
