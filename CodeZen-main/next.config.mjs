/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns:[
      new URL("https://campus.w3schools.com"),
      new URL("https://chatgpt.com"),
    ]
  },
 
}

export default nextConfig
