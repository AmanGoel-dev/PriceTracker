/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // thsi lines make the optimisation of the images on the server
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**", // matches all image paths
      },
    ],
  },
};

export default nextConfig;
