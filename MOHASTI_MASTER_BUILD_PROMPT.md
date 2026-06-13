# MOHASTI — Master Build Prompt (End-to-End Website)

> **Purpose:** Use this document as a single, copy-paste-ready master prompt to build the Mohasti brand website from scratch. It mirrors the quality, structure, and commerce patterns of [ishathigale.com](https://www.ishathigale.com/) and [timyangerart.myshopify.com](https://timyangerart.myshopify.com/), while applying Mohasti's unique spiritual-wellness identity and color system.

---

## MASTER PROMPT (Copy from here)

```
You are a senior full-stack developer and brand designer. Build a complete, production-ready e-commerce website for **MOHASTI** — a spiritual-wellness art and stationery brand established in 2025.

The site must feel and function like a premium independent artist Shopify store, matching the UX patterns of:
- https://www.ishathigale.com/ (clean artist story, category-led homepage, product grids, newsletter)
- https://timyangerart.myshopify.com/ (story-driven copy, "New In" collections, featured favourites, pre-order/sold-out states, announcement bar)

Do NOT clone those sites visually — translate their *structure and commerce flow* into Mohasti's own brand world.

---

## 1. BRAND IDENTITY

### Brand Name
**MOHASTI**

### Tagline
**SINCE 2025**

### Brand Essence
Mohasti is a spiritual, wellness-oriented art and lifestyle brand. The aesthetic blends:
- Calm, luminous spirituality (lotus, moon, heart symbolism)
- Modern minimal commerce (clean grids, readable typography, fast checkout)
- Premium handcrafted feel (gold accents, glowing imagery, intentional whitespace)

### Voice & Tone
- Warm, intentional, poetic but not preachy
- Short sentences. Sensory language. Everyday mindfulness.
- Example hero line: *"Art inspired by stillness, crafted for everyday rituals."*
- Example subcopy: *"Mohasti creates original art and functional pieces — postcards, journals, and keepsakes — that bring light, balance, and beauty into daily life."*

### Logo & Symbol System (use provided assets)
Primary logo file: `Mohasti Logo.jpeg`

Logo composition (do not redraw — use supplied asset):
1. **Gold calligraphic heart-line** — thin metallic gold continuous stroke forming a heart + flowing loop
2. **Crescent moon** — small, iridescent (pink → lavender → pale yellow glow) above the heart
3. **Wordmark** — "MOHASTI" in clean all-caps sans-serif, deep teal
4. **Sub-wordmark** — "SINCE 2025" in same typeface, smaller
5. **Lotus flower** — luminous electric-blue lotus at bottom of brand lockup; use as decorative motif sitewide

Create favicon from the gold heart + moon mark. Use full logo in header/footer; lotus as section divider or loading animation.

---

## 2. COLOR SYSTEM (STRICT — DO NOT DEVIATE)

### Primary Brand Colors (from brand guidelines)
| Token | Hex | Usage |
|-------|-----|-------|
| `--mohasti-cyan` | `#0CC0DF` | Primary accent, links, CTAs, gradient start |
| `--mohasti-yellow` | `#FFDE59` | Secondary accent, highlights, gradient end |
| `--mohasti-teal` | `#1A8A8F` | Headings, wordmark color, primary text on light bg |
| `--mohasti-teal-dark` | `#0F5C60` | Body text, nav links, footer text |
| `--mohasti-gold` | `#C9A227` | Icons, borders, decorative line art, premium badges |
| `--mohasti-gold-light` | `#E8D48B` | Hover states on gold elements |
| `--mohasti-lotus-blue` | `#1E6FD9` | Lotus motif, product highlight borders |
| `--mohasti-lotus-glow` | `#7EC8FF` | Glow effects, focus rings |
| `--mohasti-moon-pink` | `#F5C6D8` | Subtle decorative gradients |
| `--mohasti-moon-lavender` | `#D4B8F0` | Subtle decorative gradients |

### Neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| `--white` | `#FFFFFF` | Cards, product backgrounds |
| `--off-white` | `#FAFBFC` | Page background |
| `--gray-100` | `#F3F4F6` | Section alternates |
| `--gray-300` | `#D1D5DB` | Borders, dividers |
| `--gray-600` | `#6B7280` | Muted text |
| `--black` | `#111827` | High-contrast text where needed |

### Signature Gradients (CRITICAL — this IS the brand)

**Primary Hero Gradient** (matches logo background):
```css
background: linear-gradient(135deg, #0CC0DF 0%, #7DD956 35%, #FFDE59 100%);
```
Direction: top-left (cyan) → center (soft lime) → bottom-right (yellow)

**Soft Section Gradient** (for newsletter, CTA bands):
```css
background: linear-gradient(160deg, rgba(12, 192, 223, 0.12) 0%, rgba(255, 222, 89, 0.18) 100%);
```

**Gold Shimmer** (decorative only, buttons/badges):
```css
background: linear-gradient(90deg, #C9A227 0%, #E8D48B 50%, #C9A227 100%);
```

**Lotus Glow Overlay** (hero/product feature sections):
```css
background: radial-gradient(ellipse at center bottom, rgba(30, 111, 217, 0.25) 0%, transparent 70%);
```

### Color Usage Rules
- **Never** use flat cyan or flat yellow as full-page backgrounds except in the hero gradient zone
- Product cards: white background, subtle `--gray-300` border, cyan hover ring
- Primary CTA buttons: `--mohasti-teal` bg → `--mohasti-cyan` on hover (white text)
- Secondary CTAs: outline `--mohasti-gold`, fill on hover
- Sold-out badges: `--gray-600` bg, white text
- "New" badges: `--mohasti-yellow` bg, `--mohasti-teal-dark` text
- Links: `--mohasti-teal` → `--mohasti-cyan` on hover

---

## 3. TYPOGRAPHY

### Font Stack
```css
--font-display: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;  /* poetic headings */
--font-body: 'DM Sans', 'Inter', system-ui, sans-serif;                      /* clean UI/body */
--font-accent: 'Montserrat', sans-serif;                                      /* MOHASTI wordmark style */
```

### Scale
| Element | Font | Weight | Size (desktop) | Color |
|---------|------|--------|----------------|-------|
| H1 Hero | `--font-display` | 500 | 48–56px | `--mohasti-teal-dark` on gradient; white with text-shadow if on busy bg |
| H2 Section | `--font-display` | 500 | 36px | `--mohasti-teal` |
| H3 Product/Card | `--font-body` | 600 | 18px | `--mohasti-teal-dark` |
| Body | `--font-body` | 400 | 16px | `--mohasti-teal-dark` |
| Caption/Price | `--font-body` | 500 | 14px | `--gray-600` |
| Nav | `--font-body` | 500 | 14px, letter-spacing 0.08em | `--mohasti-teal-dark` |
| Wordmark | `--font-accent` | 600 | per context | `--mohasti-teal` |

---

## 4. TECH STACK & ARCHITECTURE

Build as a **Shopify Online Store 2.0** theme OR a **Next.js 15 + headless Shopify Storefront API** app (choose based on deployment preference; default to Shopify theme for fastest launch matching references).

### Required Stack (if custom build)
- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS v4
- **Commerce:** Shopify Storefront API + Admin API (or Shopify theme Liquid)
- **Payments:** Shopify Payments + PayPal (international, like Tim Orangeboy)
- **Email:** Klaviyo or Shopify Email for newsletter
- **CMS:** Shopify metaobjects for story pages / blog
- **Images:** Next/Image or Shopify CDN, WebP, lazy load
- **Analytics:** Google Analytics 4 + Meta Pixel hooks
- **Hosting:** Vercel (Next.js) or Shopify native

### Performance Targets
- Lighthouse Performance ≥ 90
- LCP < 2.5s
- Mobile-first responsive (320px → 1440px+)
- Accessible: WCAG 2.1 AA (focus states, alt text, keyboard nav)

---

## 5. SITE MAP & PAGES

```
/                          → Homepage
/collections/all           → All Products
/collections/[handle]      → Category pages
/products/[handle]         → Product detail
/pages/about               → About / Artist Story
/pages/contact             → Contact form
/blogs/journal             → Journal / Studio notes (optional launch)
/cart                      → Cart
/checkout                  → Shopify checkout
/policies/shipping         → Shipping policy
/policies/refund           → Refund policy
/policies/privacy          → Privacy policy
/search                    → Search results
```

### Navigation (sticky header)
Left: Mohasti logo (links to /)
Center/Right links: **Shop** · **Collections** · **About** · **Journal** · **Contact**
Icons: Search · Account · Cart (with item count badge in `--mohasti-cyan`)

---

## 6. HOMEPAGE SECTIONS (in order — mirror reference sites)

### 6.1 Announcement Bar (Tim Orangeboy pattern)
- Full-width, `--mohasti-teal-dark` background, white text, 13px
- Example: *"Shipping across India · International orders via PayPal · Free mindfulness wallpaper with first order"*
- Dismissible × on mobile

### 6.2 Hero Section (Isha Thigale pattern + Mohasti gradient)
- Full-viewport or 85vh hero with **Primary Hero Gradient** background
- Centered layout:
  - Small gold heart-line icon or crescent moon decorative element
  - H1: *"Art inspired by stillness, crafted for everyday rituals."*
  - 2–3 sentence brand intro (warm, first-person plural or third-person brand voice)
  - Two CTAs: **Shop Collection** (primary) · **Our Story** (secondary outline)
  - Optional: subtle animated lotus glow at bottom (CSS radial gradient pulse, very subtle)
- Right side or background: hero product flat-lay or brand illustration (provided assets)

### 6.3 Brand Story Strip
- White/off-white background
- 2-column: left = studio/brand photo placeholder; right = short story + "Read more →" link to /pages/about
- Include **Follow on Instagram** button with IG icon (outline gold)

### 6.4 New Launches (Isha Thigale "New Launches" grid)
- Section title: **New Launches**
- 3–4 category cards in horizontal scroll (mobile) / grid (desktop):
  - Postcards
  - Journals & Notebooks
  - Greeting Cards
  - Bookmarks & Stickers
- Each card: large product/category image, category name overlay, link to collection

### 6.5 Featured Collection — Postcards
- Section title: **Postcards**
- Product grid: 4 columns desktop, 2 mobile
- Each product card:
  - Square product image (1:1), white bg, subtle shadow on hover (lift 4px)
  - Product name (H3)
  - Price in INR: `Rs. XXX.00`
  - Quick-add button on hover (desktop)
  - "Sold out" overlay badge when applicable

### 6.6 Featured Collection — Greeting Cards
- Same grid pattern
- Section title example: **'Light' Greeting Cards** (brand-themed naming)

### 6.7 Shop by Category (Isha "Stationery" section)
- Section title: **Stationery**
- 4 category tiles: Notebooks · Sticker Sheets · Greeting Cards · Bookmarks
- Image + label, equal height tiles

### 6.8 Featured Favourites (Tim Orangeboy pattern)
- Section title: **Mohasti Favourites**
- 2–3 hero product cards (wider, with short story blurb beneath title)
- Support **pre-order** and **sold out** states with distinct badges
- Example product: *"Monthly Mindfulness Mail Club"* (subscription-style product)

### 6.9 Newsletter (both references)
- Soft Section Gradient background
- Lotus or moon decorative watermark (low opacity)
- Heading: **Join the Mohasti Circle**
- Copy: *"Collection drops, studio notes, monthly phone & laptop wallpapers, and gentle reminders to pause. Receive 10% off your first order."*
- Email input + **Subscribe** button
- Privacy note: *"We respect your inbox. Unsubscribe anytime."*
- Integrate with Klaviyo/Shopify Email; trigger 10% welcome discount code

### 6.10 Footer
- Background: `--mohasti-teal-dark`
- Text: white/off-white
- Columns:
  1. Mohasti logo (white/mono version) + "SINCE 2025" + 1-line tagline
  2. Shop links: All Products · Collections · New Arrivals
  3. Info: About · Contact · Shipping · Refunds
  4. Social: Instagram · Pinterest · Email
- Bottom bar: © 2025 Mohasti · Payment icons (Visa, Mastercard, UPI, PayPal)

---

## 7. PRODUCT & COLLECTION PAGES

### Collection Page
- Collection hero banner (optional gradient overlay + collection title)
- Filter sidebar (desktop) / drawer (mobile): Category · Price · Availability · Sort
- Product grid with pagination or infinite scroll
- Breadcrumbs: Home > Shop > [Collection Name]

### Product Detail Page
- 2-column layout (images left 55%, info right 45%)
- Image gallery: main image + thumbnail strip; zoom on click
- Product title (H1), price, short description
- Variant selectors (size/set/count) as pill buttons
- Quantity stepper
- **Add to Cart** (primary, full width) + **Buy Now**
- Accordion tabs: Description · Details (GSM, dimensions) · Shipping · Care
- "You may also like" carousel (4 products)
- Story block below fold (Tim Orangeboy style): *"The Story Behind This Piece"* — 2 paragraphs
- Social share icons
- Structured data: Product JSON-LD schema

### Sample Products (seed data)
| Product | Collection | Price (INR) | Notes |
|---------|-----------|-------------|-------|
| Lotus Dawn \| Postcard | Postcards | 199 | |
| Moonlit Stillness \| Postcard | Postcards | 199 | |
| Golden Heart \| Postcard | Postcards | 199 | |
| Tea Ritual \| Postcard | Postcards | 199 | |
| I am my own light \| Greeting Card | Greeting Cards | 299 | |
| Gratitude \| Greeting Card | Greeting Cards | 299 | |
| Friendship & Light \| Greeting Card | Greeting Cards | 299 | |
| Greeting Cards \| Set of 10 | Greeting Cards | 2,199 | |
| Mindfulness \| Notebook | Notebooks | 399 | |
| Daily Intentions \| Notebook | Notebooks | 399 | |
| Florals \| Bookmarks (Set of 3) | Bookmarks | 199 | |
| Sacred Symbols \| Sticker Sheet | Stickers | 299 | |
| 2026 Art Calendar \| Postcard Set | New Arrivals | 1,299 | Pre-order |
| Mohasti Mindfulness Mail Club | Favourites | 999/month | Subscription |

---

## 8. ABOUT PAGE

- Full-width hero with brand gradient (shorter, 40vh)
- Founder/brand story: 3–4 paragraphs about Mohasti's origin, spiritual inspiration, mission
- Pull quote in `--font-display`, large, gold left border
- Image gallery: studio shots, process photos (placeholders)
- Values section: 3 icons (Lotus = Growth · Moon = Reflection · Heart = Compassion)
- CTA: **Explore the Collection**

---

## 9. CONTACT PAGE

- Simple form: Name · Email · Subject · Message
- Email: hello@mohasti.com (placeholder)
- Instagram link prominent
- Optional: embedded Google Map if physical studio
- Response time note: *"We reply within 2–3 business days."*

---

## 10. E-COMMERCE FEATURES (must-have)

- [ ] Cart drawer (slide-in from right, not full page reload)
- [ ] Cart item count badge in header
- [ ] Sold out / Pre-order / New badge system
- [ ] INR currency formatting: `Rs. 1,299.00`
- [ ] International shipping notice (PayPal for international)
- [ ] Discount code support (NEWSLETTER10 = 10% off first order)
- [ ] Order confirmation email (branded template with gradient header)
- [ ] SEO: meta titles, descriptions, OG images per page
- [ ] 404 page with brand illustration + "Return to Shop" CTA
- [ ] Cookie consent banner (minimal, GDPR-friendly)

---

## 11. ANIMATION & MICRO-INTERACTIONS

Keep subtle — spiritual calm, not flashy:

| Interaction | Spec |
|-------------|------|
| Page load | Soft fade-in (300ms) |
| Hero gradient | Very slow 15s hue shift (optional, ±5% saturation) |
| Product card hover | translateY(-4px), shadow-lg, 200ms ease |
| Button hover | Background color transition 150ms |
| Cart drawer | Slide 300ms ease-out |
| Lotus glow | Pulse opacity 0.15 → 0.25, 4s infinite (hero only) |
| Scroll reveal | Sections fade-up 20px, stagger 100ms (Intersection Observer) |
| Focus rings | 2px `--mohasti-lotus-glow` outline |

**Avoid:** parallax overload, autoplay video with sound, aggressive pop-ups

---

## 12. RESPONSIVE BREAKPOINTS

```css
--bp-sm: 640px;   /* mobile landscape */
--bp-md: 768px;   /* tablet */
--bp-lg: 1024px;  /* desktop */
--bp-xl: 1280px;  /* wide desktop */
```

- Mobile: hamburger menu, single-column grids, sticky bottom "Shop" bar optional
- Tablet: 2-column product grids
- Desktop: 3–4 column grids, sticky header with shrink on scroll

---

## 13. SEO & METADATA

```html
<title>Mohasti | Spiritual Art & Stationery</title>
<meta name="description" content="Mohasti creates original art, postcards, journals, and mindful stationery inspired by stillness and everyday rituals. Established 2025." />
<meta property="og:image" content="/og-mohasti-gradient.jpg" />
```

- All product images: descriptive alt text
- Canonical URLs
- sitemap.xml + robots.txt
- Blog/journal posts for long-tail SEO (optional phase 2)

---

## 14. LAUNCH CHECKLIST

### Phase 1 — MVP (Week 1–2)
- [ ] Brand theme + homepage all sections
- [ ] 10+ products seeded with placeholder images
- [ ] Cart + checkout via Shopify
- [ ] About + Contact pages
- [ ] Newsletter integration
- [ ] Mobile responsive pass
- [ ] Basic SEO

### Phase 2 — Polish (Week 3)
- [ ] Real product photography
- [ ] Journal/blog
- [ ] Instagram feed embed
- [ ] Analytics + conversion tracking
- [ ] Performance optimization
- [ ] Accessibility audit

### Phase 3 — Growth
- [ ] Mail club subscription product
- [ ] Digital downloads (wallpapers for newsletter subscribers)
- [ ] Gift cards
- [ ] Wholesale inquiry form

---

## 15. FILE & ASSET REQUIREMENTS

Deliver and organize:
```
/public
  /brand
    mohasti-logo.jpg          (provided)
    mohasti-logo-white.png    (derived for footer)
    favicon.ico
    og-image.jpg              (gradient + logo)
  /products
    [product-handle].jpg      (placeholders until photo shoot)
  /decor
    lotus-glow.svg
    gold-heart-line.svg
    crescent-moon.svg
```

---

## 16. DESIGN DON'Ts

- Do NOT use generic purple wellness palette — Mohasti is cyan + yellow + teal + gold
- Do NOT use heavy dark mode as default — light, airy, luminous
- Do NOT overcrowd homepage — generous whitespace like Isha Thigale
- Do NOT use stock "yoga" photography — use brand illustrations and product flat-lays
- Do NOT skip sold-out/pre-order UI states
- Do NOT use Comic Sans, Papyrus, or overly decorative script fonts for body text

---

## 17. ACCEPTANCE CRITERIA

The build is complete when:
1. Homepage matches section order and commerce flow of reference sites
2. Color system uses exact hex values `#0CC0DF` and `#FFDE59` in hero gradient
3. All Mohasti logo elements appear correctly in header/footer
4. Product grid, cart, and checkout work end-to-end
5. Newsletter signup captures email and applies welcome discount
6. Site is fully responsive and scores ≥90 Lighthouse Performance
7. Brand feels spiritual, premium, and distinct from references — not a copy

Build the entire site now. Start with design tokens + component library, then pages, then Shopify/commerce integration, then seed products and test checkout.
```

---

## QUICK REFERENCE — COLOR PALETTE SWATCH

```
PRIMARY GRADIENT:  #0CC0DF ──→ #7DD956 ──→ #FFDE59
ACCENT CYAN:       #0CC0DF
ACCENT YELLOW:     #FFDE59
TEAL TEXT:         #1A8A8F / #0F5C60
GOLD DECOR:        #C9A227
LOTUS BLUE:        #1E6FD9
BACKGROUNDS:       #FFFFFF / #FAFBFC
```

## REFERENCE SITE PATTERNS CHEAT SHEET

| Pattern | Isha Thigale | Tim Orangeboy | Mohasti Implementation |
|---------|-------------|---------------|------------------------|
| Hero story | ✓ Artist intro | ✓ Tagline + welcome | Brand intro on gradient hero |
| New launches row | ✓ | ✓ "NEW IN" | "New Launches" category cards |
| Category sections | ✓ Postcards, Cards, Stationery | ✓ Notebooks, Postcards, etc. | Postcards, Cards, Stationery |
| Featured favourites | — | ✓ Mail club, calendar | Mohasti Favourites + Mail Club |
| Announcement bar | — | ✓ Shipping/pre-order | Shipping + international note |
| Newsletter + discount | ✓ 10% off | ✓ Subscribe | 10% off + wallpapers promise |
| Sold out badges | ✓ | ✓ | ✓ |
| INR pricing | ✓ | ✓ | ✓ |
| Instagram CTA | ✓ | ✓ (bio link culture) | ✓ Follow on IG button |

---

*Generated for Mohasti brand build · Reference sites: ishathigale.com · timyangerart.myshopify.com*
