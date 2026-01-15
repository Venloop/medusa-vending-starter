# Installation & Configuration

## Requirements

- **Node.js**: 18+ or 20+
- **yarn**: recommended package manager
- **Medusa Backend**: v2 (running locally or remotely)
- **Firebase Project**: optional (for FCM)

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd medusa-vending-storefront

# Install dependencies
yarn install
```

---

## Configuration

### 1. Environment Variables

Copy `.env.template` to `.env.local`:

```bash
cp .env.template .env.local
```

Fill in the required variables:

```env
# Medusa Backend
MEDUSA_BACKEND_URL=http://localhost:9000

# Region
NEXT_PUBLIC_DEFAULT_REGION=pl

# Locale
NEXT_PUBLIC_DEFAULT_LOCALE=pl

# Firebase (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Medusa Backend

Make sure the Medusa Backend is running.

The backend should be accessible at the address from `MEDUSA_BACKEND_URL` (default `http://localhost:9000`).

### 3. Image Remote Patterns (Next.js Config)

**Important**: During development and production, you must configure `remotePatterns` in `next.config.ts` to include all servers from which images are loaded. Without this configuration, Next.js will throw errors when trying to optimize external images.

Open `next.config.ts` and add your image sources to the `remotePatterns` array:

```typescript
images: {
  remotePatterns: [
    { protocol: "http", hostname: "localhost" },
    {
      protocol: "https",
      hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
    },
    { protocol: "https", hostname: "medusa-server-testing.s3.amazonaws.com" },
    {
      protocol: "https",
      hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
    },
    // Add your backend domain if serving images
    { protocol: "https", hostname: "your-backend.example.com" },
    // Add your S3 bucket or CDN
    {
      protocol: "https",
      hostname: "your-bucket.s3.region.amazonaws.com",
    },
  ],
}
```

Common sources to add:
- Your Medusa backend domain (if serving images directly)
- S3 buckets (AWS, DigitalOcean Spaces, etc.)
- CDN domains (CloudFront, Cloudflare, etc.)
- Image hosting services

---

## Running

### Development

```bash
# Port: 8000
yarn dev
```

The application will be available at: `http://localhost:8000`

### Production Build

```bash
# Build
yarn build

# Start
yarn start
```

### Other Scripts

```bash
# Check environment variables
node check-env-variables.js

# Generate Firebase configuration
node scripts/generate-firebase-config.js
```
