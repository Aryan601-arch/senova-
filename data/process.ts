export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  duration: string;
  outputs: string[];
};

/** How buying from Webor Appliances works, from browsing to after-sales. */
export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Browse",
    description: "Look through the full official price list — every model, every price, live from our database.",
    duration: "Online, any time",
    outputs: ["Every model", "Prices incl. VAT"],
  },
  {
    number: "02",
    title: "Call or message",
    description: "Call 980-1111669 for the fastest answer, or message our Facebook page with the model you're after.",
    duration: "One number",
    outputs: ["980-1111669", "Facebook"],
  },
  {
    number: "03",
    title: "Confirm",
    description: "We confirm the current price and stock for your model before you buy — prices can change by season.",
    duration: "Before you pay",
    outputs: ["Current price", "Stock check"],
  },
  {
    number: "04",
    title: "Delivery & install",
    description: "Delivery and installation support is available on most appliances. Tell us your location and we'll confirm what's included.",
    duration: "Ask when you call",
    outputs: ["Delivery", "Installation"],
  },
  {
    number: "05",
    title: "After-sales",
    description: "Something needs a look after purchase? Call the same number — after-sales is handled directly by us, backed by Webor's warranty.",
    duration: "Ongoing",
    outputs: ["Webor warranty", "Same team"],
  },
];
