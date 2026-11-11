/**
 * Client reviews — the 12 Google reviews shown on the live homepage, verbatim (client-authored text is
 * never edited, including spelling). Source: audit/content-inventory.md Section 8.
 * No dates, review counts or aggregate ratings exist in the source, so none are shown.
 */

export interface Review {
  name: string;
  text: string;
  source: 'Google';
  rating: 5;
}

export const reviewsIntro = {
  eyebrow: 'You Can Count on Me',
  heading: 'See What My Clients Have to Say!',
} as const;

export const reviews: Review[] = [
  {
    name: 'Jennifer Ervin',
    text: 'My experience with Anderson Law Firm was amazing. Syretta was very efficient throughout my divorce process. Two years later and I’m still benefiting from the guidance that was provided to me.',
    source: 'Google', rating: 5,
  },
  {
    name: 'JT Blank',
    text: 'I am very pleased with the Anderson Law Firm team. They represented me well during the entire process, court hearings and case management. Atty Syretta Anderson is very knowledgeable, thorough and calm, but straight to the point in her questioning and cross examinations. She’s definitely the one you want representing you. I highly recommend Atty Syretta Anderson and her team to everyone in the NC or SC areas.',
    source: 'Google', rating: 5,
  },
  {
    name: 'Darrell Canty',
    text: 'Very professional and got everything done in a timely manner. My best experience with any attorney.',
    source: 'Google', rating: 5,
  },
  {
    name: 'Dameka Jackson',
    text: 'Syretta was amazing. She went about and beyond to help me. I would recommend her to anyone. Thank you so much',
    source: 'Google', rating: 5,
  },
  {
    name: 'Sharee Allen',
    text: 'My experience with working with Ms. Anderson has been phenomenal. She is the BEST divorce attorney. She is consistent, communicates well, and truly cares about her clients. I could not gotten through this process without her and her amazing team. I highly recommend Ms. Anderson to any of my family and friends.',
    source: 'Google', rating: 5,
  },
  {
    name: 'Jeffrey Williams',
    text: 'Syretta is an amazing lawyer who actually listens and takes her cases personally!',
    source: 'Google', rating: 5,
  },
  {
    name: 'Neffiteria Chambers',
    text: 'Syretta is always professional & helpful. She finds solutions to any problems before you even knew it was an issue. When I go see her I know she will give me the reassurance I need. Everyone there was nice to my small kids giving them snacks and juice so that they could be content while we handled business. No matter what fee, I know what I’m getting when I contact her. I am sure I will consult with her again in the future.',
    source: 'Google', rating: 5,
  },
  {
    name: 'Shannon Childers',
    text: 'Ms. Anderson is the absolute best. She went above and beyond for me in my case I highly recommend her. I will definitely continue to use her services in the future. Again I highly recommend her.',
    source: 'Google', rating: 5,
  },
  {
    name: 'Gina Bina',
    text: 'Syretta was incredibly knowledgeable, honest, and friendly. She knows what she is doing and will tell it to you straight. She was always there to help and guide me. She kept me up to date and I will utilize her services every time I need an attorney.',
    source: 'Google', rating: 5,
  },
  {
    name: 'Jessyca S',
    text: 'I needed major help with my child custody case. I had previously done a consultation with another attorney who I had a bad experience with. Attempting to navigate my case alone was stressful and took a toll on my mental health. I decided to try again with attorney Anderson. From the moment that she walked into the room for our consultation, I immediately liked her. She was straight forward and to the point. Immediately, it was obvious that she had plenty of experience, knew the law, knew her value as an attorney, and actually CARED. I knew that I had to retain her. During the year that the case was ongoing, Syretta and her paralegal team were amazing. They were timely, personable, and consistently humbled the other party’s attorney. I was able to relax knowing that they were taking care of everything in a way that was going to benefit both myself and my child. I could go on and on about how wonderful my experience was but words cannot fully express my gratitude. If you’re looking for legal counsel, this is the firm for you. I promise, you won’t be disappointed. Thank you so much Syretta & team!',
    source: 'Google', rating: 5,
  },
  {
    name: 'Lisa Allen',
    text: 'Syretta and staff made my situation less stressful. She is a knowledgeable, sweet, caring person . If you need a lawyer for anything she is the one… When your lawyer cares .. you know!!!',
    source: 'Google', rating: 5,
  },
  {
    name: 'Amanda González-Ortiz',
    text: 'If you are seeking an attorney, I HIGHLY recommend Attorney Anderson. My time with her over the last 3 year has been phenomenal. Attorney Anderson is extremely nice, thorough, honest, and a straightforward person. She takes pride in the work she does and you can see it through the way she works with her clients. She will honestly and straightforward tell you if something is possible/not possible with detail explanation and will not sugarcoat it, which I absolutely loved about her. She is a well known and respected by the courts and law enforcement.',
    source: 'Google', rating: 5,
  },
];

/** Featured review (blueprint proposal; client may choose another — notes G5). */
export const featuredReviewName = 'Jeffrey Williams';
