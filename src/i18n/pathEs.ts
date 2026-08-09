import type { LearningPhase } from '@/types/content'

type PhaseTranslation = Pick<LearningPhase, 'title' | 'shortTitle' | 'description'> & {
  modules?: Record<string, { title: string; description: string }>
}

export const fastPaymentsPathEs = {
  title: 'Ruta de Pagos Instantáneos',
  description: 'La ruta recomendada para entender primero el pago y luego los mensajes, estados y excepciones.',
  phases: {
    foundations: {
      title: 'Fundamentos',
      shortTitle: 'Fundamentos',
      description: 'Entiende actores, ciclo de vida y movimiento de valor antes de abrir un mensaje.',
    },
    'iso-20022': {
      title: 'ISO 20022',
      shortTitle: 'ISO 20022',
      description: 'Conecta familias de mensajes, pacs.008 e identificadores con el proceso de pago.',
    },
    exceptions: {
      title: 'Excepciones',
      shortTitle: 'Excepciones',
      description: 'Razona sobre rechazo, devolución, cancelación, recall y reversal.',
    },
    'sgpi-public-case': {
      title: 'Caso Publico SGPI',
      shortTitle: 'SGPI',
      description: 'Aplica conceptos de pagos al esquema público dominicano y mantiene explícitas las preguntas de implementación.',
      modules: {
        'spi-dominicana-overview': {
          title: 'Actores y rol del SGPI',
          description: 'Conoce al cliente, los participantes y la infraestructura administrada por el BCRD antes de rastrear un pago.',
        },
      },
    },
    operations: {
      title: 'Operaciones',
      shortTitle: 'Operaciones',
      description: 'Investiga, reconcilia y razona sobre los sistemas alrededor de un pago.',
    },
    capstone: {
      title: 'Caso Final',
      shortTitle: 'Caso Final',
      description: 'Integra mensajes, estados e investigación en casos completos.',
    },
  } satisfies Record<string, PhaseTranslation>,
}
