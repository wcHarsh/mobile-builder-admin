/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['static-mobile.onecommerce.io', 'cdn.shopify.com'],
        unoptimized: true,
    },
    reactStrictMode: false,
};

export default nextConfig;
