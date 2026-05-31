import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0f4ff' },
          100: { value: '#dce4ff' },
          200: { value: '#b9c8ff' },
          300: { value: '#8aa3ff' },
          400: { value: '#5a78ff' },
          500: { value: '#3a54f5' },
          600: { value: '#2a3dd4' },
          700: { value: '#1e2da3' },
          800: { value: '#162075' },
          900: { value: '#0d1347' },
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
    },
    semanticTokens: {
      colors: {
        'bg.app': {
          value: { base: '#f8f9ff', _dark: '#0f1117' },
        },
        'bg.card': {
          value: { base: 'white', _dark: '#1a1d2e' },
        },
        'text.primary': {
          value: { base: 'gray.900', _dark: 'gray.50' },
        },
        'text.muted': {
          value: { base: 'gray.500', _dark: 'gray.400' },
        },
        'border.subtle': {
          value: { base: 'gray.100', _dark: 'gray.700' },
        },
        'star.speed': {
          value: { base: '#f59e0b', _dark: '#fbbf24' },
        },
        'star.accuracy': {
          value: { base: '#10b981', _dark: '#34d399' },
        },
        'star.range': {
          value: { base: '#8b5cf6', _dark: '#a78bfa' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
