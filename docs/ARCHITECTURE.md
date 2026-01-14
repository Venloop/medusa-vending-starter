# Architecture

## Routing

```
src/app/[countryCode]/
├── (main)/                  # Main store pages
│   ├── faq/                # FAQ
│   ├── contact/            # Contact form
│   ├── offer/              # Offer (with locations)
│   ├── privacy-policy/     # Privacy Policy
│   ├── terms/              # Terms of Service
│   ├── reset-password/     # Password reset
│   └── returns-and-claims/ # Returns & Claims
│
├── (pos)/pos/              # POS system
│   ├── locations/          # POS locations
│   └── offer/              # POS offer
│
├── (checkout)/             # Checkout flow
└── layout.tsx              # Root layout with i18n
```

---

## API Endpoints (new)

```
src/lib/data/
├── cart-pos.ts            # Cart for POS
├── contact.ts             # Contact message sending
├── cookies-pos.ts         # Cookies for POS
├── locations.ts           # Machine locations
├── pos.ts                 # POS operations (open/close device)
├── regions-pos.ts         # Regions for POS
└── ...                    # Starter APIs (cart, products, etc.)
```

---

## Firebase

```
src/lib/firebase/
├── client.ts              # Firebase Client (FCM)
├── firebase-wrapper.tsx   # Component wrapper
└── firestore.tsx          # Firestore integration

src/lib/providers/
├── firebase.tsx           # Context Provider
└── firebase-device.tsx    # Device management
```

---

## Multilingual Support

```
messages/
├── en.json                # English translations
└── pl.json                # Polish translations

src/i18n/
├── navigation.ts          # next-intl navigation
├── request.ts             # Server-side i18n
└── routing.ts             # Routing config
```

---

## MDX Content

```
src/content/
├── legal/
│   ├── en.mdx
│   └── pl.mdx
├── privacy-policy/
│   ├── en.mdx
│   └── pl.mdx
└── returns-and-claims/
    ├── en.mdx
    └── pl.mdx
```

---

## Technologies

### Core
- **Next.js**: 15.4.10 (App Router, Server Components)
- **React**: 19
- **TypeScript**: 5+
- **Tailwind CSS**: 3+

### Medusa
- **@medusajs/ui**: UI Components
- **medusa-react**: React client for Medusa

### New Dependencies (vs starter)

#### Firebase
- `firebase`

#### Internationalization
- `next-intl`

#### UI Components
- `@radix-ui/react-accordion`
- `swiper`
- `lucide-react`
- `react-country-flag`

#### MDX
- `@mdx-js/loader`
- `@mdx-js/react`
- `@next/mdx`
- `remark-gfm`
- `rehype-slug`
- `rehype-autolink-headings`

#### Utilities
- `lodash`
- `qs`
- `dotenv`

---

## 🚀 Performance

- Next.js 15 App Router
- Server Components
- Server Actions
- Turbopack (dev mode)
- Static Pre-Rendering
- Image Optimization
- Service Worker (offline support)
- Region cache (1h TTL)
