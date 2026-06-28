import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#16a34a' },
          600: { value: '#15803d' },
          700: { value: '#166534' },
          800: { value: '#14532d' },
          900: { value: '#052e16' },
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
          value: { base: 'gray.200', _dark: 'gray.700' },
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
