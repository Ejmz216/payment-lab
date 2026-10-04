import { Link } from 'react-router-dom'
import { Icon3D } from './ReferenceIdentity'

/** Explains the synthetic "XXX" currency wherever example amounts use it. */
export function XxxNote() {
  return <p className="xxx-note">
    <Icon3D name="coin" size={16} />
    <span><strong>¿XXX?</strong> Es el código ISO 4217 para "sin moneda". Lo usamos a propósito: los importes de los ejemplos no representan dinero real. <Link to="/reference/currency-code" className="text-primary">Más sobre códigos de moneda</Link></span>
  </p>
}
