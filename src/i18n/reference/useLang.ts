import { useUIStore } from '@/store/uiStore'

export type RefLang = 'es' | 'en'

export function useRefLang(): RefLang {
  return useUIStore((state) => state.lang) === 'en' ? 'en' : 'es'
}

/** Returns a picker for inline bilingual UI text: L('Hola', 'Hello'). */
export function useL() {
  const lang = useRefLang()
  return (es: string, en: string) => (lang === 'en' ? en : es)
}
