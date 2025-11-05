import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: [
    '@thoughtweaver/ui',
    '@thoughtweaver/types',
    '@thoughtweaver/config',
    '@thoughtweaver/utils',
  ],
  // Webpack configuration for monorepo support and asset aliases
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add alias for workspace packages (client-side)
      config.resolve.alias = {
        ...config.resolve.alias,
        '@thoughtweaver/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@thoughtweaver/types': path.resolve(__dirname, '../../packages/types/src'),
        '@thoughtweaver/config': path.resolve(__dirname, '../../packages/config/src'),
        '@thoughtweaver/utils': path.resolve(__dirname, '../../packages/utils/src'),
      };
      
      // Handle figma asset imports
      config.resolve.alias['figma:asset/66df02ed14e51fbca9624ccbf86d6c66471695a9.png'] = 
        path.resolve(__dirname, './assets/66df02ed14e51fbca9624ccbf86d6c66471695a9.png');
      config.resolve.alias['figma:asset/554fa3f225599e9d74085e980bec2674888447d2.png'] = 
        path.resolve(__dirname, './assets/554fa3f225599e9d74085e980bec2674888447d2.png');
      config.resolve.alias['figma:asset/dd66067f40eb374e0f675639f890289fb607d8f0.png'] = 
        path.resolve(__dirname, './assets/dd66067f40eb374e0f675639f890289fb607d8f0.png');
      config.resolve.alias['figma:asset/2e1615857ca91e0983178c6d9454a9bc816ba468.png'] = 
        path.resolve(__dirname, './assets/2e1615857ca91e0983178c6d9454a9bc816ba468.png');
      config.resolve.alias['figma:asset/b20d2ead8618218f3f745bbfe7fbfca414f24e8e.png'] = 
        path.resolve(__dirname, './assets/b20d2ead8618218f3f745bbfe7fbfca414f24e8e.png');
    }
    
    return config;
  },
  // Turbopack configuration (empty for now, uses webpack above)
  turbopack: {},
};

export default nextConfig;
