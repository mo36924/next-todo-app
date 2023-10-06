/** @type {import('next').NextConfig} */
const nextConfig = { transpilePackages: ["@zod-prisma-types", "styled-system"], experimental: { serverActions: true } };

module.exports = nextConfig;
