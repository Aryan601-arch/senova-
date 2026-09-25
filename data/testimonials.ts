/**
 * DEMO CONTENT — these testimonials are placeholders written for this template.
 * The people and companies are fictional and the avatars are abstract artwork.
 * Replace them with real, approved quotes from your clients before launch,
 * then set `testimonialsAreDemo` to false to hide the "Demo content" label.
 */
export const testimonialsAreDemo = true;

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  /** Path under /public. Use a square image (at least 160×160). */
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Maya Lindqvist",
    role: "VP of Product",
    company: "Aurora Energy",
    quote:
      "Senova felt like an extension of our own team. They challenged our assumptions, shipped every week and the platform they built is still the fastest thing in our stack.",
    image: "/images/testimonials/avatar-1.webp",
  },
  {
    name: "Daniel Okafor",
    role: "Founder & CEO",
    company: "Halo Health",
    quote:
      "Most studios give you screens. Senova gave us a product. The motion and onboarding work doubled our activation within a month of launch.",
    image: "/images/testimonials/avatar-2.webp",
  },
  {
    name: "Sofia Marchetti",
    role: "Head of Digital",
    company: "Kinetic Mobility",
    quote:
      "The 3D configurator runs beautifully on phones we assumed could never handle it. It became our best-performing sales channel.",
    image: "/images/testimonials/avatar-3.webp",
  },
  {
    name: "Arjun Mehta",
    role: "CTO",
    company: "Atlas Research",
    quote:
      "Rigorous engineering, clear communication and genuinely good taste. They made AI feel trustworthy to our users, which was the whole brief.",
    image: "/images/testimonials/avatar-4.webp",
  },
];
