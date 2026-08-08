export interface SimEventTranslation {
  label?: string
  decisionQuestion?: string
  decisionOptions?: Record<string, string>
  decisionExplanation?: string
}

export interface SimScenarioTranslation {
  title: string
  description: string
  events: SimEventTranslation[]
}

export const simActorsEs: Record<string, string> = {
  customer: 'Cliente',
  debtoragt: 'BANK_A',
  infra: 'Infraestructura',
  creditoragt: 'BANK_B',
  beneficiary: 'Beneficiario',
}

export const simulatorEs: Record<string, SimScenarioTranslation> = {
  successful: {
    title: 'Transferencia de crédito exitosa',
    description: 'Un pago directo de Alice Example a Bob Example, procesado de extremo a extremo sin problemas.',
    events: [
      { label: 'Pago iniciado por Alice Example' },
      { label: 'pacs.008 enviado a BANK_A' },
      { label: 'pacs.008 reenviado a la infraestructura, validación exitosa' },
      { label: 'Pago aceptado por la infraestructura' },
      { label: 'Liquidado (cleared), estado reenviado a BANK_B' },
      { label: 'Settlement confirmado' },
      { label: 'Bob Example acreditado por BANK_B' },
      { label: 'Pago completado' },
    ],
  },
  rejected: {
    title: 'Rechazado — cuenta inválida',
    description: 'La validación encuentra un número de cuenta inválido antes de que el pago sea aceptado.',
    events: [
      { label: 'Pago iniciado por Alice Example' },
      { label: 'pacs.008 enviado a BANK_A' },
      {
        label: 'Validación fallida: formato de cuenta del acreedor inválido',
        decisionQuestion: '¿QUÉ SIGUE? El pago nunca pasó de la validación en la infraestructura.',
        decisionOptions: { reject: 'Rechazo', return: 'Devolución', cancel: 'Cancelación', retry: 'Reintentar pacs.008', investigate: 'Depende / investigar' },
        decisionExplanation: 'El pago nunca progresó más allá de la validación — nunca fue aceptado. Esta es la forma de un rechazo, no de una devolución.',
      },
      { label: 'Pago rechazado — reporte de estado pacs.002 enviado a BANK_A' },
    ],
  },
  returned: {
    title: 'Devuelto — cuenta del beneficiario cerrada',
    description: 'El pago es aceptado y liquidado, pero luego se descubre que la cuenta del beneficiario está cerrada.',
    events: [
      { label: 'Pago iniciado por Alice Example' },
      { label: 'pacs.008 enviado a BANK_A' },
      { label: 'pacs.008 reenviado a la infraestructura, validación exitosa' },
      { label: 'Pago aceptado por la infraestructura' },
      { label: 'Settlement confirmado, reenviado a BANK_B' },
      {
        label: 'Se descubre que la cuenta del beneficiario está cerrada — falla el crédito a Bob Example',
        decisionQuestion: '¿QUÉ SIGUE? El settlement ya se completó, pero no se pudo acreditar al beneficiario.',
        decisionOptions: { reject: 'Rechazo', return: 'Devolución', cancel: 'Cancelación', retry: 'Reintentar pacs.008', investigate: 'Depende / investigar' },
        decisionExplanation: 'El pago ya progresó a través de la aceptación y el settlement. Un fallo descubierto después se maneja como una devolución, no un rechazo.',
      },
      { label: 'Devolución iniciada de vuelta a BANK_A' },
    ],
  },
  timeout: {
    title: 'Timeout — participante receptor no disponible',
    description: 'La institución receptora no responde a tiempo, y el pago excede el tiempo límite.',
    events: [
      { label: 'Pago iniciado por Alice Example' },
      { label: 'pacs.008 enviado a BANK_A' },
      { label: 'pacs.008 reenviado a la infraestructura, validación exitosa' },
      { label: 'BANK_B no responde' },
      { label: 'El pago excedió el tiempo límite esperando respuesta' },
    ],
  },
  duplicate: {
    title: 'Duplicado detectado',
    description: 'Una instrucción idéntica es detectada como duplicado de una ya procesada.',
    events: [
      { label: 'Pago iniciado por Alice Example' },
      { label: 'pacs.008 enviado a BANK_A' },
      { label: 'Duplicado de EndToEndId detectado — coincide con un pago ya procesado' },
      { label: 'Duplicado rechazado — pacs.002 enviado, el pago original no se ve afectado' },
    ],
  },
}
