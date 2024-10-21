const path = require('path');
// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@mhra/mhra-design-components',
      '@azure/identity',
      '@azure/keyvault-secrets',
      '@azure/msal-browser',
      '@azure/msal-react',
      '@azure/storage-blob',
    ],
  },
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
  },
};
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUILD_ANALYZE === 'true'
})
module.exports = withBundleAnalyzer(nextConfig);