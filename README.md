# Cheezious Official Clone & Live Dynamic Admin Portal

A responsive, high-performance **Next.js 14/15** ordering web application replicating the official **Cheezious** website UI/UX. Designed as an interactive agency showcase for **Helpex Solutions** (`sample.helpexai.com`).

Built with **Next.js (App Router)**, **Tailwind CSS**, and **Lucide Icons**, configured with full static export (`output: 'export'`) for zero-cost, lightning-fast edge deployment on Cloudflare Pages or Vercel.

---

## 🍕 Key Features

### 1. Authentic Cheezious Storefront (`/`)
- **Official Brand Tokens:** Cheezious Golden Yellow (`#FFB800`), Charcoal Dark Mode (`#111317`, `#1A1D24`), Crimson Accents (`#E11D48`).
- **Official Menu Catalog:** All 13 authentic Cheezious menu items (Crown Crust Pizza, Stuff Crust, Bazinga Burger, Bazinga Supreme, Reggy Burger, Tikka, Fajita, Extreme Pizzas, Calzone Chunks, Flaming Wings, Crunchy Chicken Pasta, Cheezy Loaded Fries).
- **Agency Showcase Ribbon:** Top & bottom Helpex Solutions showcase banner with WhatsApp direct lead generation.
- **Sticky Category Pill Bar:** Smooth filtering across Cheezious categories with live dish counters.
- **Slide-Out Cheezy Cart Drawer:**
  - Real-time quantity adjustments.
  - Delivery vs. Dine-In / Takeaway toggle.
  - Automated WhatsApp Checkout: Generates formatted receipt markdown and launches WhatsApp to send the order to `whatsappNumber`.

### 2. Live Dynamic Admin Portal (`/admin`)
- **Password Authentication Gate:** Protected by an Admin Secret key (default: `admin123` or your Cloudflare Bearer token).
- **Store & Operational Settings:** Edit brand name, slogan, hotline (`051-111-446-699`), WhatsApp receiving number, delivery charges, announcement banner, and active branch indicator.
- **Category Manager:** Add new categories, rename, delete, and reorder tab hierarchy.
- **Menu Item Manager:**
  - Fast search & category filtering.
  - **Inline Price Editing:** Adjust prices directly in the table with immediate updates.
  - **Instant Stock Switch:** One-click toggle between `In Stock` and `Sold Out` (automatically marks dishes sold out on the storefront).
  - Add & Edit Dish Modal with photo preview and badges (Signature, Bestseller, Spicy, etc.).
- **Global Cloudflare KV Sync:**
  - Floating action bar to publish live changes globally.
  - Seamless offline fallback to browser `localStorage` when testing without an active Cloudflare Worker.
  - Reset to Cheezious Defaults button for demo resets.

---

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start local Next.js dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

### Static Export Build
```bash
npm run build
```
This builds static HTML/CSS/JS files into the `out/` directory ready for deployment on **Cloudflare Pages**, **Vercel**, or **GitHub Pages**.

---

## ☁️ Cloudflare Worker + KV Setup

The project includes a ready-to-deploy Cloudflare Worker script in `cloudflare/worker.js`.

1. Install Wrangler and log in:
   ```bash
   npx wrangler login
   ```
2. Create a KV namespace:
   ```bash
   npx wrangler kv:namespace create CHEEZIOUS_KV
   ```
3. Update `cloudflare/wrangler.toml` with the generated `id`.
4. Deploy the worker:
   ```bash
   cd cloudflare
   npx wrangler deploy
   ```
5. In your Next.js environment or directly in the `/admin` portal settings modal, set your Worker endpoint URL:
   ```env
   NEXT_PUBLIC_API_URL=https://restaurant-api.<your-subdomain>.workers.dev/api/shop/cheezious
   ```

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS (Cheezious Custom Palette)
- **Icons:** Lucide React
- **Sync:** Cloudflare Workers + Cloudflare KV with LocalStorage Cache
- **Checkout:** WhatsApp Deep Link API with Formatted Order Receipt
