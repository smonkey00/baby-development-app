/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能以提升性能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // 启用压缩
  compress: true,
  
  // 优化图片
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  webpack: (config, { dev, isServer }) => {
    // 只在开发环境下禁用缓存，生产环境启用
    if (dev) {
      config.cache = false
    }
    
    // 优化构建性能
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  }
}

module.exports = nextConfig