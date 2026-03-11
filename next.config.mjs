/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...(config.externals || []), { pg: 'pg' }];
    }
    return config;
  },
};

export default nextConfig;
