export interface DomainTranslation {
  description: string
  families?: Record<string, string>
}

export const domainsEs: Record<string, DomainTranslation> = {
  payments: {
    description:
      'Mensajes que respaldan la iniciación, clearing, settlement, reporte de estado, devoluciones y aspectos de gestión de efectivo al mover dinero entre partes. Este es el dominio cubierto en profundidad por la Ruta de Pagos Instantáneos y el Laboratorio.',
    families: {
      pain: 'Cliente a institución financiera. Mensajes relacionados con la iniciación de pagos.',
      pacs: 'Institución financiera a institución financiera. Mensajes relacionados con clearing y settlement de pagos.',
      camt: 'Mensajes relacionados con gestión de efectivo: reportes, estados de cuenta, notificaciones, investigaciones.',
      admi: 'Mensajes administrativos intercambiados entre sistemas y participantes.',
      head: 'Información de encabezado que acompaña a un mensaje de negocio.',
      remt: 'Información detallada de remesa relacionada con un pago.',
    },
  },
  securities: {
    description:
      'Mensajes que respaldan la negociación, liquidación, custodia, eventos corporativos y datos de referencia de valores — una parte de ISO 20022 históricamente mucho más grande y madura que la de pagos.',
    families: {
      setr: 'Mensajes relacionados con el lado de negociación/orden de las transacciones de valores.',
      sese: 'Mensajes relacionados con la liquidación de transacciones de valores.',
      semt: 'Mensajes relacionados con tenencias, estados de cuenta y datos de referencia de valores.',
      seev: 'Mensajes relacionados con eventos corporativos y otros eventos de valores.',
    },
  },
  'trade-finance': {
    description:
      'Mensajes que respaldan servicios de comercio como cartas de crédito documentarias, garantías y financiamiento de comercio de cuenta abierta entre bancos y corporativos.',
    families: {
      tsmt: 'Mensajes relacionados con la gestión de transacciones de servicios de comercio (por ejemplo, comercio documentario, cuenta abierta).',
    },
  },
  cards: {
    description:
      'Mensajes que respaldan transacciones de pago con tarjeta, aceptación y procesamiento relacionado entre las partes de un esquema de tarjetas.',
    families: {
      caaa: 'Área de negocio que cubre mensajes relacionados con transacciones y aceptación de tarjetas.',
    },
  },
  fx: {
    description: 'Mensajes que respaldan la confirmación de operaciones de cambio de divisas y el procesamiento relacionado entre contrapartes.',
    families: {
      fxtr: 'Mensajes relacionados con la confirmación y procesamiento de operaciones de cambio de divisas.',
    },
  },
  authorities: {
    description:
      'Mensajes que respaldan el reporte regulatorio y a autoridades, y datos de referencia distribuidos por o hacia autoridades regulatorias/de mercado.',
    families: {
      auth: 'Mensajes relacionados con reportar a, o recibir información de, autoridades regulatorias/de mercado.',
      reda: 'Mensajes relacionados con la distribución y mantenimiento de datos de referencia.',
    },
  },
}
