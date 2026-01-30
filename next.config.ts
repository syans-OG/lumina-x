import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  turbopack: {},

  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              priority: 10,
            },
            gsap: {
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              name: 'gsap',
              priority: 9,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
