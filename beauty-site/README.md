# Senova beauty website

A soft, elegant storefront for Senova skincare: cream and blush colors, serif headings, clean
product cards, a 3D hero with Senova packaging, and a 3D product ring you can spin.

Built with Next.js, React, Tailwind CSS and React Three Fiber. It lives in this folder and is
separate from the Senova agency site at the root of the repository.

## See it on your computer

1. Install Node.js 20 or newer from nodejs.org.
2. Open a terminal in this `beauty-site` folder.
3. Run `npm install` (first time only).
4. Run `npm run dev` and open http://localhost:3000.

For the fast, final version run `npm run build` and then `npm start`.

## Changing things

| What | Where |
| --- | --- |
| Brand name, tagline, contact details, WhatsApp number, menu | `data/site.ts` |
| Products (name, category, photo, description, optional price) | `data/products.ts` |
| "Curated Rituals" sets | `data/collections.ts` |
| "Beauty Tips & Trends" articles | `data/journal.ts` |
| Colors and fonts | `app/globals.css` and `app/layout.tsx` |
| 3D hero scene | `components/three/hero-scene.tsx` |

**Product photos** load from senovainternational.com. To host them yourself, save them in
`public/products/` and change each product's `image` to `/products/<file name>`. If a photo
can't load, the card shows a drawn Senova bottle instead, so the page never looks broken.

**Prices** are not shown yet, because the Senova International catalog has none. Add
`price: 1250` to a product in `data/products.ts` and it appears on the card and product page.

**Orders**: the bag sends the order to Senova by WhatsApp or email, using the details in
`data/site.ts`. There is no online payment.
