/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "grace-gate-node-pictures-hmg.s3.amazonaws.com",
      "grace-gate-node-pictures-prd.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
