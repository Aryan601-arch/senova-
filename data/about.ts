export const aboutContent = {
  eyebrow: "About us",
  statement: "Creating easy life — one genuine Webor appliance at a time.",
  intro: [
    "Webor Appliances brings the Webor line of home electronics to Nepal — televisions, refrigerators, washing machines, air conditioners, and the everyday appliances that keep a household running.",
    "We started as a page under Facebook's Electronics category and grew into a store people actually call back — one number for sales, one inbox for support, and stock that's genuinely from the Webor line, not a grey-market guess.",
  ],
  principles: ["Televisions", "Refrigerators", "Washing machines", "Air conditioners", "Everyday appliances"],
};

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  detail: string;
};

/** Trust points shown on the home page and product pages. */
export const trustPoints = [
  { title: "Genuine Webor stock", text: "Every unit we sell comes from the official Webor line — no grey-market guesswork." },
  { title: "Manufacturer warranty", text: "Appliances are backed by Webor's standard warranty terms, not a shop promise." },
  { title: "Real after-sales support", text: "Something needs a look after purchase? Call or message — no call-centre maze." },
  { title: "One number, one team", text: "980-1111669 reaches the same people whether you're buying or following up." },
];
