# Features

## What's Different from Medusa Starter?

This project is based on [medusajs/nextjs-starter-medusa](https://github.com/medusajs/nextjs-starter-medusa) and adds:

1. **POS (Point of Sale) System** - full vending machine integration
   - Vending machine location management
   - Session handling at machine (device_id, hub_id, locker_id)
   - Dedicated API for POS devices
   - Product return handling

2. **Firebase Integration**
   - Firebase Cloud Messaging (FCM) - push notifications
   - Firestore - real-time database
   - Service Worker for background notifications
   - Token management

3. **New Modules**
   - Contact (form + API)
   - FAQ (accordion UI)
   - Vending machine locations (list + details)
   - Returns and claims (MDX content)
   - Password reset

### Improved Features

1. **Multilingual Support**
   - `next-intl` instead of starter's own locale system
   - Polish (PL) as default language
   - English (EN)
   - Automatic detection and redirect

2. **Coupon System**
   - Enhanced UI with badges
   - Multiple coupons simultaneously
   - Real-time validation
   - Better error handling

3. **MDX Content**
   - Terms of Service
   - Privacy Policy
   - Returns and claims

---

## POS System

### Vending Machine Management
- Location list with carousel (Swiper.js)
- Product offering in machines
- Integration with locker opening system
- User session tracking at machine

### POS Flow
1. User scans QR code at vending machine
2. Session initialization (device_id, hub_id, locker_id)
3. Product browsing and selection
4. Payment processing
5. Locker opening
6. Session cleanup

---

## Multilingual Support (i18n)

- Polish (default) and English
- All URLs with language prefix (`/pl/`, `/en/`)
- Translation files in `messages/`
- Automatic browser language detection
- Language switcher in navigation

---

## Firebase

### Push Notifications (FCM)
- Real-time order status updates
- Promotional notifications
- Service Worker for offline support

### Firestore
- Device registration
- Token management
- Real-time data synchronization

### Configuration
- Automatic configuration at build time
- Environment-based setup
- VAPID key management

---

## Static Content (MDX)

- Terms of Service
- Privacy Policy
- Returns and claims
- Markdown support with GitHub Flavored Markdown syntax
- Automatic table of contents
- Heading anchors
