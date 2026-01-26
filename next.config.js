/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "bacakomik.my" },
      { protocol: "https", hostname: "imageainewgeneration.lol" },
      { protocol: "https", hostname: "himmga.lat" },
      { protocol: "https", hostname: "gaimgame.pics" },
    ],
  },
};

module.exports = nextConfig;
