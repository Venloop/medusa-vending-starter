/* eslint-disable @typescript-eslint/no-var-requires */
const checkEnvVariables = require("./check-env-variables")
checkEnvVariables()

import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import createMDX from "@next/mdx"

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
    ],
  },
}

/**
 * Plugins: next-intl + MDX (official @next/mdx)
 */
const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
})

// Plugin composition + export
export default withNextIntl(withMDX(nextConfig))
