/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingExcludes: {
    "*": [
      "./content/**",
      "./public/downloads/**",
    ],
  },
};

export default nextConfig;
