# Itatshu

A responsive, showroom-inspired storefront built with **React, Node.js, Express and SQLite**. Features a horizontal illuminated collection, product details, configurable options, image zoom, category filters and a persistent shopping bag. Prices use Indian rupees.

## Run locally

Install **Node.js 22.13 or newer** (Node 24 recommended), then:

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. SQLite is created and seeded automatically in `data/store.sqlite`. No database server, account, API key, `.env` file or Docker is required.

For the production build:

```bash
npm run build
npm start
```

The Express server serves both the React application and API. Direct visits to product URLs work in production. `PORT` optionally changes the server port; `SQLITE_PATH` optionally changes the database file path.

## Change the company or sell a different product

| File | What to change |
| --- | --- |
| `config/store.json` | Company name, wordmark, hero copy, story, currency, locale, categories, accent colour and footer |
| `config/products.json` | Products, rupee prices, descriptions, categories, images, option groups and specifications |
| `client/public/images/` | Local product photographs |
| `client/public/favicon.svg` | Browser icon |
| `client/index.html` | Initial HTML metadata before the application loads |

Product options and specification fields are generic. For clothing, use option groups such as `Size: [S, M, L]` and `Colour: [Black, Cream]`; the details view and bag will render these without changing components. Give categories matching names in both config files. Keep product IDs stable when updating a catalogue so existing bags can still be restored. Existing saved entries for deleted products are automatically discarded.

Restart the server after changing the product catalogue. The JSON catalogue is the demo's source of truth: startup synchronizes it into SQLite in one transaction. This intentionally replaces catalogue rows; it is not a production inventory migration strategy.

### Product images and Cloudinary

The four included photographs were supplied by the project owner. No Unsplash images are included. Their original product markings are preserved. Itatshu is the concept storefront name, not a claim about the manufacturers shown. Names, descriptions, options and prices are illustrative demo catalogue data, not verified commercial listings.

Set each product's `image` field to either:

```json
"image": "/images/noir.jpg"
```

or a public Cloudinary delivery URL:

```json
"image": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/YOUR_ASSET.jpg"
```

No Cloudinary credential is needed to display a public image. Uploading/admin functionality is outside this version's scope. Do not commit Cloudinary API secrets. Optional `imagePosition` values (e.g. `50% 40%`) control image positioning. Missing or failed images fall back to a clearly labelled preview illustration. Replace the watch-specific fallback when adapting this template to a different product category.

## Implemented

- Home collection with responsive horizontal browsing and category filters
- Individual product URLs, details, options, quantity selection and image zoom
- Shopping bag drawer: add, merge identical selections, update quantities, remove and subtotal
- Device-local bag persistence with validation of stored entries
- Keyboard-accessible controls, native dialog focus management, Escape-to-close and reduced-motion support
- Express catalogue API backed by automatically seeded SQLite
- Configurable brand and product data

The bag is saved in the browser, not synchronized between devices or stored in SQLite. SQLite stores the catalogue. There are no accounts, orders, admin panel, checkout, payment collection, stock reservation, shipping promises or 3D models. This is a demo storefront, not a production commerce backend.

## API

| Method | URL | Response |
| --- | --- | --- |
| GET | `/api/health` | Health status |
| GET | `/api/store` | Brand configuration |
| GET | `/api/products` | Ordered catalogue |
| GET | `/api/products/:id` | Product or JSON 404 |

## Validation

```bash
npm test
npm run build
```

Tests exercise SQLite lookup behaviour, API responses and shopping bag persistence/merge rules.

## Repository setup

The project targets the owner-created public repository **Nirbhay71/Itathsu**. To push the prepared local commits with your own GitHub authentication, run:

```bash
git push -u origin main
```

There is intentionally no open-source licence attached: public visibility does not grant an open-source licence. Confirm rights to supplied images before commercial publication.
