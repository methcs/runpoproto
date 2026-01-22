// Auto-generated shims for third-party modules without type declarations
// Add more specific types later where needed.

declare module 'next-themes' {
  import type React from 'react'
  export type ThemeProviderProps = { children?: React.ReactNode; [key: string]: any }
  export const ThemeProvider: React.ComponentType<ThemeProviderProps>
  export function useTheme(): { theme?: string; setTheme: (t: any) => void }
}

declare module 'sonner'

// Radix UI primitives (shims)
declare module '@radix-ui/react-accordion'
declare module '@radix-ui/react-alert-dialog'
declare module '@radix-ui/react-aspect-ratio'
declare module '@radix-ui/react-avatar'
declare module '@radix-ui/react-checkbox'
declare module '@radix-ui/react-collapsible'
declare module '@radix-ui/react-context-menu'
declare module '@radix-ui/react-hover-card'
declare module '@radix-ui/react-menubar'
declare module '@radix-ui/react-navigation-menu'
declare module '@radix-ui/react-popover'
declare module '@radix-ui/react-progress'
declare module '@radix-ui/react-radio-group'
declare module '@radix-ui/react-scroll-area'
declare module '@radix-ui/react-select'
declare module '@radix-ui/react-slider'
declare module '@radix-ui/react-switch'
declare module '@radix-ui/react-tabs'
declare module '@radix-ui/react-toast'
declare module '@radix-ui/react-toggle-group'
declare module '@radix-ui/react-toggle'
declare module '@radix-ui/react-tooltip'

// Other UI / libs
declare module 'react-day-picker'
declare module 'embla-carousel-react' {
  export type UseEmblaCarouselType = any
  const _default: any
  export default _default
}

declare module 'recharts' {
  export type LegendProps = any
  export const Legend: any
  export const Tooltip: any
  export const ResponsiveContainer: any
  export const LineChart: any
  export const Line: any
  export const XAxis: any
  export const YAxis: any
}

declare module 'cmdk'
declare module 'vaul'
declare module 'react-hook-form' {
  export type FieldValues = Record<string, any>
  export type FieldPath<T> = string
  export type ControllerProps<TFieldValues = any, TName = string> = any
  export type FieldPathValue<TFieldValues, TName> = any
  export const Controller: any
  export const FormProvider: any
  export function useFormContext(): any
}
declare module 'input-otp'
declare module 'react-resizable-panels'

declare module 'jsonwebtoken'
declare module 'nodemailer'

// Generic fallback for any other untyped modules (use cautiously)
declare module '*'
