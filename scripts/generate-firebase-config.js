const fs = require("fs")
const path = require("path")

require("dotenv").config()

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validation
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(
      `Missing environment variable: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`
    )
  }
})

const fileContent = `self.FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};`

fs.writeFileSync(
  path.join(__dirname, "../public/firebase-config.generated.js"),
  fileContent
)

console.log("✅ Generated firebase-config.generated.js")
