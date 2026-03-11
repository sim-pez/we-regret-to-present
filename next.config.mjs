/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...(config.externals || []), { pg: 'pg' }];
    }
    return config;
  },
};

export default nextConfig;
