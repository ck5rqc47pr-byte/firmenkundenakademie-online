/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Geschützte Downloads liegen außerhalb von public/ und müssen in das
    // Serverless-Bundle der Download-Route aufgenommen werden (Vercel-Tracing).
    outputFileTracingIncludes: {
      "/api/downloads/[type]/[file]": ["./protected-downloads/**"],
    },
  },
};

export default nextConfig;
