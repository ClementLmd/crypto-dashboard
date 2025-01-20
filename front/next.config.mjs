/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  transpilePackages: ['crypto-dashboard-shared'],
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.resolve.alias['crypto-dashboard-shared'] = resolve(__dirname, '../shared/src');
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;
