// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  env: {
    SIPPP_APP_KEY: process.env.NEXT_PUBLIC_SIPPP_APP_KEY ?? "",
  },
};

module.exports = nextConfig;

// 0x3f15B8c6F9939879Cb030D6dd935348E57109637
// 0x3f15B8c6F9939879Cb030D6dd935348E57109637
