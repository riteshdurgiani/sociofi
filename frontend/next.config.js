/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    REACT_APP_CLUSTER: process.env.REACT_APP_CLUSTER,
  },
  
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'static.thenounproject.com',
      'encrypted-tbn0.gstatic.com',
      'avatars.dicebear.com',
      'png.pngtree.com',
      'api.dicebear.com/5.x',
      'api.dicebear.com'
    ], 
  },
  
}
module.exports = nextConfig 
