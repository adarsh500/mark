/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.gravatar.com', 'lh3.googleusercontent.com', 'localhost'],
  },
};

module.exports = nextConfig;
