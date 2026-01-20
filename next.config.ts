/* eslint-disable @typescript-eslint/no-var-requires */
const checkEnvVariables = require("./check-env-variables")
checkEnvVariables()

import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import createMDX from "@next/mdx"

/**
 * Parse additional remote patterns from environment variable
 * Expects comma-separated hostnames, e.g. "cdn.example.com,images.example.com"
 */
const getAdditionalRemotePatterns = () => {
  const envHostnames = process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTNAMES
  if (!envHostnames) return []

  return envHostnames
    .split(",")
    .map((hostname) => hostname.trim())
    .filter((hostname) => hostname.length > 0)
    .map((hostname) => ({
      protocol: (hostname.startsWith("localhost") ? "http" : "https") as "http" | "https",
      hostname,
    }))
}

/**
 * Base Next.js config
 */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  logging: {
    fetches: { fullUrl: true },
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // We add MD/MDX extensions to page/segment routing
  pageExtensions: ["ts", "tsx", "md", "mdx"],
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
      // { protocol: "https", hostname: "your-backend.example.com" },
      // {
      //   protocol: "https",
      //   hostname: "your-bucket.s3.region.amazonaws.com",
      // },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Add patterns from environment variable
      ...getAdditionalRemotePatterns(),
    ],
  },
}

/**
 * Plugins: next-intl + MDX (official @next/mdx)
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
})

// Plugin composition + export
export default withNextIntl(withMDX(nextConfig))
