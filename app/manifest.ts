import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tejas Savaliya',
    short_name: 'Tejas Savaliya',
    description: 'Tejas Savaliya - Full Stack Developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/me.jpeg',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}