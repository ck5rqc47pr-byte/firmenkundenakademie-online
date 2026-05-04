/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: {
      "*": ["./content/**", "./public/downloads/**"],
    },
  },
};

export default nextConfig;
