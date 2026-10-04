import { Link } from 'react-router-dom'
import { Icon3D } from './ReferenceIdentity'
import { useL } from '@/i18n/reference/useLang'

/** Explains the synthetic "XXX" currency wherever example amounts use it. */
export function XxxNote() {
  const L = useL()
  return <p className="xxx-note">
    <Icon3D name="coin" size={16} />
    <span><strong>{L('¿XXX?', 'XXX?')}</strong> {L('Es el código ISO 4217 para "sin moneda". Lo usamos a propósito: los importes de los ejemplos no representan dinero real.', 'It is the ISO 4217 code for “no currency”. We use it on purpose: example amounts do not represent real money.')} <Link to="/reference/currency-code" className="text-primary">{L('Más sobre códigos de moneda', 'More about currency codes')}</Link></span>
  </p>
}
