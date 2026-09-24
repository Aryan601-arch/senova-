import type { ProductGroup } from "./catalog";

export type ServiceVisual = "sphere" | "phone" | "neural" | "knot" | "cloud" | "cube";

/** A product range, shown in the "Shop by range" section with its own 3D visual. */
export type Service = {
  id: ProductGroup;
  number: string;
  title: string;
  description: string;
  /** Categories in this range, shown as tags. */
  deliverables: string[];
  /** Lucide icon name, mapped in components/services/services.tsx */
  icon: "fridge" | "ac" | "washer" | "pot" | "tv" | "fan";
  /** Which 3D form the visual panel morphs into when this range is active. */
  visual: ServiceVisual;
  /** Accent color used by the 3D visual for this range. */
  color: string;
};

export const services: Service[] = [
  {
    id: "refrigeration",
    number: "01",
    title: "Refrigeration",
    description:
      "Single, double and multi-door refrigerators, hard-top and glass-top freezers, and upright visi chillers for shops.",
    deliverables: ["Refrigerators", "Freezers", "Visi chillers"],
    icon: "fridge",
    visual: "cube",
    color: "#58b8ff",
  },
  {
    id: "cooling",
    number: "02",
    title: "Cooling",
    description: "Wall-mount air conditioners — fixed speed or DC Inverter with WiFi — and air coolers for every room size.",
    deliverables: ["Air conditioners", "Air coolers"],
    icon: "ac",
    visual: "cloud",
    color: "#43e5c4",
  },
  {
    id: "laundry",
    number: "03",
    title: "Laundry",
    description: "Front-loading washing machines, including BLDC inverter models, built for everyday family loads.",
    deliverables: ["Front loading", "Inverter"],
    icon: "washer",
    visual: "sphere",
    color: "#7b8cff",
  },
  {
    id: "kitchen",
    number: "04",
    title: "Kitchen",
    description:
      "Rice cookers, microwaves, OTGs, air fryers, cooktops, mixer grinders, kettles and dishwashers — the whole kitchen.",
    deliverables: ["Rice cookers", "Microwaves", "Cooktops", "Air fryers"],
    icon: "pot",
    visual: "knot",
    color: "#ff7a45",
  },
  {
    id: "entertainment",
    number: "05",
    title: "Entertainment",
    description: "Frameless HD, FHD, 4K UHD and QLED televisions on Android and WebOS, from 32\" up.",
    deliverables: ["HD to 4K", "Android & WebOS", "QLED"],
    icon: "tv",
    visual: "phone",
    color: "#d4ff3f",
  },
  {
    id: "home",
    number: "06",
    title: "Home",
    description: "Ceiling and stand fans, water geysers, water dispensers and irons — the everyday appliances that keep a household running.",
    deliverables: ["Fans", "Geysers", "Dispensers", "Irons"],
    icon: "fan",
    visual: "neural",
    color: "#f2c94c",
  },
];
