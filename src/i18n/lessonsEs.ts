// Spanish translations for Fast Payments Path lessons.
// Keyed by lesson id; only translatable prose fields are provided here.
// keyTerms are intentionally left untranslated (ISO 20022 role/field names
// are used internationally in English in real documentation and conversation).
import type { LessonBlock } from '@/types/blocks'
import { sgpiLessonsEs } from '@/i18n/sgpiLessonsEs'

export interface LessonTranslation {
  title?: string
  subtitle?: string
  whyItMatters?: string
  objectives?: string[]
  mentalModel?: string
  sections?: { heading: string; body: string }[]
  commonConfusion?: { title: string; explanation: string }[]
  blocks?: LessonBlock[]
}

export const lessonsEs: Record<string, LessonTranslation> = {
  ...sgpiLessonsEs,
  'payment-fundamentals': {
    title: 'Fundamentos de Pagos',
    subtitle: 'Qué ocurre realmente cuando se mueve el dinero',
    whyItMatters:
      'Todo mensaje ISO 20022 existe para respaldar un proceso de negocio real: mover dinero (o una instrucción para moverlo) entre partes. Si entiendes primero el proceso, los mensajes dejan de parecer arbitrarios.',
    objectives: [
      'Explicar la diferencia entre una instrucción de pago y un movimiento real de fondos.',
      'Nombrar las instituciones principales involucradas en un pago simple.',
      'Definir con tus propias palabras payment rail, payment scheme y payment network.',
      'Reconocer clearing y settlement como conceptos distintos que estudiarás en profundidad más adelante.',
    ],
    mentalModel: 'Un pago es un proceso de negocio, no un archivo. Un mensaje es solo la forma en que los participantes se comunican durante ese proceso.',
    sections: [
      {
        heading: '¿Qué es un pago?',
        body: 'Un pago es el proceso de mover valor económico de una parte (el pagador) a otra (el beneficiario). Ese proceso generalmente involucra al menos dos instituciones financieras y una o más infraestructuras que las conectan. La instrucción de pagar y el movimiento real de los fondos son dos cosas distintas — la instrucción puede existir antes de que el dinero realmente se mueva.',
      },
      {
        heading: 'Instrucción vs. movimiento',
        body: 'Cuando un cliente autoriza un pago, crea una instrucción de pago. Esa instrucción viaja por bancos e infraestructuras como mensajes. El movimiento real de valor (la liquidación de la obligación financiera) ocurre después, durante el settlement. Confundir "se envió la instrucción" con "el dinero se movió" es uno de los errores más comunes de quienes recién empiezan en pagos.',
      },
      {
        heading: 'Quién participa',
        body: 'Un pago doméstico simple normalmente involucra: el pagador, el banco del pagador, un sistema de pagos (infraestructura de clearing/settlement), el banco del beneficiario y el beneficiario. Los pagos transfronterizos o más complejos pueden agregar intermediarios.',
      },
      {
        heading: 'Payment rail, scheme y network',
        body: 'Un payment rail es la infraestructura subyacente que mueve instrucciones de pago y valor (por ejemplo, un sistema de pagos instantáneos o un sistema RTGS). Un payment scheme es el conjunto de reglas, roles y obligaciones que los participantes aceptan seguir al usar un rail (por ejemplo, reglas de uso de mensajes, reglas de tiempos, reglas de responsabilidad). Un payment network es el conjunto de participantes conectados a través de ese rail y scheme. Estos términos suelen usarse de forma flexible en la industria — trátalos como un modelo de trabajo, no como una taxonomía estricta.',
      },
    ],
    commonConfusion: [
      {
        title: 'Enviar una instrucción de pago no es lo mismo que los fondos lleguen',
        explanation: 'Un pago puede ser aceptado por todos los sistemas involucrados y aún así fallar en acreditar al beneficiario más adelante. La instrucción y el movimiento de valor están relacionados pero son eventos distintos.',
      },
    ],
    blocks: [
      {
        type: 'payment-flow',
        heading: 'Un pago simple',
        actors: [
          { id: 'alice', label: 'Alice' },
          { id: 'banka', label: 'BANK_A' },
          { id: 'net', label: 'RED DE PAGOS' },
          { id: 'bankb', label: 'BANK_B' },
          { id: 'bob', label: 'Bob' },
        ],
        steps: [
          { from: 'alice', to: 'banka' },
          { from: 'banka', to: 'net' },
          { from: 'net', to: 'bankb' },
          { from: 'bankb', to: 'bob' },
        ],
      },
      {
        type: 'prediction',
        context: 'Alice → BANK_A',
        question: '¿Alice transfirió el dinero directamente a Bob en este momento?',
        options: [
          { id: 'a', label: 'Sí, el dinero se movió directamente a Bob', correct: false },
          { id: 'b', label: 'No — este paso solo involucra a Alice y su banco', correct: true },
        ],
        explanation: 'En este punto, solo están involucrados Alice y su banco. El dinero aún no se ha movido hacia Bob — eso requiere más pasos entre instituciones, y finalmente un paso de settlement.',
      },
      {
        type: 'prediction',
        context: 'BANK_A → RED DE PAGOS',
        question: '¿Qué se intercambia principalmente aquí?',
        options: [
          { id: 'a', label: 'Efectivo físico', correct: false },
          { id: 'b', label: 'Una instrucción/mensaje de pago', correct: true },
          { id: 'c', label: 'La cuenta del beneficiario', correct: false },
          { id: 'd', label: 'Un perfil de cliente', correct: false },
        ],
        explanation: 'Entre instituciones e infraestructura, lo que viaja es una instrucción/mensaje de pago (conceptualmente, un mensaje tipo pacs.008) — no efectivo físico ni la cuenta misma.',
      },
      {
        type: 'explanation',
        heading: '¿Qué es un pago?',
        body: 'Un pago es el proceso de mover valor económico de una parte (el pagador) a otra (el beneficiario). Ese proceso generalmente involucra al menos dos instituciones financieras y una o más infraestructuras que las conectan. La instrucción de pagar y el movimiento real de los fondos son dos cosas distintas — la instrucción puede existir antes de que el dinero realmente se mueva.',
      },
      {
        type: 'explanation',
        heading: 'Instrucción vs. movimiento',
        body: 'Cuando un cliente autoriza un pago, crea una instrucción de pago. Esa instrucción viaja por bancos e infraestructuras como mensajes. El movimiento real de valor (la liquidación de la obligación financiera) ocurre después, durante el settlement. Confundir "se envió la instrucción" con "el dinero se movió" es uno de los errores más comunes de quienes recién empiezan en pagos.',
      },
      {
        type: 'explanation',
        heading: 'Quién participa',
        body: 'Un pago doméstico simple normalmente involucra: el pagador, el banco del pagador, un sistema de pagos (infraestructura de clearing/settlement), el banco del beneficiario y el beneficiario. Los pagos transfronterizos o más complejos pueden agregar intermediarios.',
      },
      {
        type: 'explanation',
        heading: 'Payment rail, scheme y network',
        body: 'Un payment rail es la infraestructura subyacente que mueve instrucciones de pago y valor (por ejemplo, un sistema de pagos instantáneos o un sistema RTGS). Un payment scheme es el conjunto de reglas, roles y obligaciones que los participantes aceptan seguir al usar un rail (por ejemplo, reglas de uso de mensajes, reglas de tiempos, reglas de responsabilidad). Un payment network es el conjunto de participantes conectados a través de ese rail y scheme. Estos términos suelen usarse de forma flexible en la industria — trátalos como un modelo de trabajo, no como una taxonomía estricta.',
      },
    ],
  },
  'payment-actors': {
    title: 'Actores del Pago',
    subtitle: 'Quién es quién en un mensaje de pago',
    whyItMatters:
      'Los mensajes ISO 20022 están construidos alrededor de roles: Debtor, Creditor, Debtor Agent, Creditor Agent y más. Saber exactamente qué significa cada rol — y qué no significa — evita la mayoría de las confusiones iniciales al leer un mensaje.',
    objectives: [
      'Distinguir una parte (Debtor/Creditor) de un agente (Debtor Agent/Creditor Agent).',
      'Explicar qué representa un Ultimate Debtor/Creditor.',
      'Explicar la diferencia entre Instructing Agent e Instructed Agent.',
      'Identificar dónde encajan los sistemas de clearing y settlement respecto a los agentes.',
    ],
    mentalModel: 'Las partes son dueñas del dinero. Los agentes dan servicio a las partes. Las infraestructuras conectan a los agentes.',
    sections: [
      {
        heading: 'Partes vs. agentes',
        body: 'El Debtor es la parte que debe o envía los fondos. El Debtor Agent es la institución financiera que da servicio al Debtor (típicamente donde el Debtor tiene su cuenta). El mismo patrón aplica del lado receptor: el Creditor es la parte que recibe los fondos, y el Creditor Agent es la institución que da servicio al Creditor. Un error muy común de principiantes es tratar "Debtor" y "Debtor Agent" como intercambiables — no lo son.',
      },
      {
        heading: 'Ultimate Debtor / Ultimate Creditor',
        body: 'Estos roles representan a la parte que finalmente debe o finalmente se beneficia de un pago cuando difiere del Debtor/Creditor nombrado en la transacción (por ejemplo, un pago hecho en nombre de un tercero). Son opcionales en muchos contextos y dependen del escenario de negocio.',
      },
      {
        heading: 'Instructing Agent / Instructed Agent',
        body: 'En una cadena de instituciones, el Instructing Agent es la institución que envía una instrucción a la siguiente institución en la cadena (el Instructed Agent). Estos roles describen una relación entre dos instituciones adyacentes en una cadena de procesamiento — son relativos, no roles globales fijos.',
      },
      {
        heading: 'Infraestructuras',
        body: 'Los sistemas de clearing y de settlement no son agentes dueños del dinero — son infraestructuras que permiten a los agentes intercambiar instrucciones y liquidar obligaciones. Un banco central puede operar infraestructura de settlement y/o mantener cuentas de settlement para los participantes.',
      },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Lee el rol de negocio antes que el nombre de la institución',
        body: 'ISO 20022 describe lo que un actor hace dentro de un proceso de negocio. Un cliente puede ser Debtor en una transacción y Creditor en otra. Un banco puede ser Debtor Agent del lado cliente e Instructing Agent en un tramo interinstitucional específico. Empieza por el rol y la relación que describe; no deduzcas el rol a partir de una marca o nombre organizacional.',
        badge: 'reference',
      },
      {
        type: 'payment-flow',
        heading: 'Un pago, tres categorías de actores',
        badge: 'simplified-model',
        actors: [
          { id: 'customer-a', label: 'CUSTOMER_A', role: 'Debtor', kind: 'party' },
          { id: 'bank-a', label: 'BANK_A', role: 'Debtor Agent', kind: 'agent' },
          { id: 'payment-system', label: 'PAYMENT_SYSTEM', role: 'Infraestructura de clearing / settlement', kind: 'infrastructure' },
          { id: 'bank-b', label: 'BANK_B', role: 'Creditor Agent', kind: 'agent' },
          { id: 'customer-b', label: 'CUSTOMER_B', role: 'Creditor', kind: 'party' },
        ],
        steps: [
          { from: 'customer-a', to: 'bank-a', label: 'solicitud del cliente', status: 'active' },
          { from: 'bank-a', to: 'payment-system', label: 'instrucción de pago', status: 'active' },
          { from: 'payment-system', to: 'bank-b', label: 'intercambio del esquema', status: 'active' },
          { from: 'bank-b', to: 'customer-b', label: 'crédito en cuenta', status: 'success' },
        ],
      },
      {
        type: 'comparison',
        heading: '¿Parte, agente o infraestructura?',
        intro: 'Usa la pregunta que responde cada categoría. Las etiquetas describen responsabilidad de negocio, no cuál caja aparece primero en una arquitectura técnica.',
        badge: 'reference',
        items: [
          {
            id: 'party',
            label: 'Parte',
            keyQuestion: '¿De quién es la obligación o el beneficio económico representado por el pago?',
            summary: 'Una parte debe, envía, recibe o se beneficia finalmente del valor en la transacción de negocio subyacente.',
            examples: ['Debtor', 'Creditor', 'Ultimate Debtor', 'Ultimate Creditor'],
            notThis: 'La institución financiera que atiende a la parte ni la infraestructura que conecta instituciones.',
            tone: 'party',
          },
          {
            id: 'agent',
            label: 'Agente',
            keyQuestion: '¿Cuál institución financiera actúa para una parte u otra institución?',
            summary: 'Un agente atiende una cuenta, envía o recibe una instrucción y participa en la cadena interinstitucional.',
            examples: ['Debtor Agent', 'Creditor Agent', 'Instructing Agent', 'Instructed Agent'],
            notThis: 'El cliente dueño de la obligación ni el sistema de pagos que conecta a los participantes.',
            tone: 'agent',
          },
          {
            id: 'infrastructure',
            label: 'Infraestructura',
            keyQuestion: '¿Qué conecta a los agentes y soporta clearing o settlement?',
            summary: 'La infraestructura transporta instrucciones, aplica procesos del esquema o soporta la liquidación de obligaciones entre participantes.',
            examples: ['PAYMENT_SYSTEM', 'sistema de clearing', 'sistema de settlement'],
            notThis: 'Un rol de cliente ni un agente que atiende cuentas. Enrutar un pago no convierte a la infraestructura en Debtor o Creditor.',
            tone: 'infrastructure',
          },
        ],
      },
      {
        type: 'prediction',
        context: 'CUSTOMER_A tiene una cuenta en BANK_A y le solicita enviar fondos.',
        question: '¿Cuál rol describe mejor a BANK_A respecto de CUSTOMER_A?',
        options: [
          { id: 'a', label: 'Debtor', correct: false },
          { id: 'b', label: 'Debtor Agent', correct: true },
          { id: 'c', label: 'Creditor', correct: false },
          { id: 'd', label: 'Infraestructura de pagos', correct: false },
        ],
        explanation: 'CUSTOMER_A es el Debtor porque debe o envía los fondos. BANK_A atiende a esa parte y su cuenta, por lo que BANK_A es el Debtor Agent en este pago.',
      },
      {
        type: 'explanation',
        heading: 'Las partes Ultimate agregan una segunda capa de negocio',
        body: 'Ultimate Debtor y Ultimate Creditor identifican quién debe o se beneficia finalmente cuando esa parte difiere del Debtor o Creditor nombrado en la transacción. Por ejemplo, CUSTOMER_A puede presentar un pago en nombre de otra entidad legal. Estos roles son opcionales en muchos contextos y solo deben aparecer cuando el escenario de negocio y las reglas de uso aplicables los requieran.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'Instructing e Instructed Agent cambian por tramo',
        badge: 'simplified-model',
        steps: [
          { id: 'hop-1', from: 'BANK_A', to: 'PAYMENT_SYSTEM', label: 'Tramo de instrucción 1', description: 'BANK_A es Instructing Agent y PAYMENT_SYSTEM es Instructed Agent en esta relación.', tone: 'neutral' },
          { id: 'hop-2', from: 'PAYMENT_SYSTEM', to: 'BANK_B', label: 'Tramo de instrucción 2', description: 'PAYMENT_SYSTEM ahora instruye a BANK_B, por lo que su rol relativo cambia en el siguiente tramo.', tone: 'neutral' },
        ],
      },
      {
        type: 'quick-check',
        question: '¿Puede una institución ser Instructed Agent en un tramo e Instructing Agent en el siguiente?',
        options: [
          { id: 'a', label: 'Sí — estos roles son relativos a cada intercambio entre actores adyacentes', correct: true },
          { id: 'b', label: 'No — una institución tiene un único rol de agente permanente', correct: false },
        ],
        explanation: 'Instructing e Instructed Agent describen la dirección de un intercambio específico entre actores adyacentes. No son identidades globales permanentes.',
      },
      { type: 'scenario', scenarioId: 'actor-role-investigation' },
    ],
    commonConfusion: [
      {
        title: 'Debtor vs. Debtor Agent',
        explanation: 'Debtor = la parte que debe/envía los fondos. Debtor Agent = la institución que da servicio a esa parte. No los trates como el mismo rol.',
      },
    ],
  },
  'payment-lifecycle': {
    title: 'Ciclo de Vida del Pago',
    subtitle: 'Un modelo educativo de las etapas por las que pasa un pago',
    whyItMatters:
      'Cuando algo sale mal con un pago, la primera pregunta siempre es "¿en qué etapa falló?". Tener un modelo mental compartido del ciclo de vida te permite razonar sobre eso rápidamente.',
    objectives: [
      'Enumerar una secuencia plausible de etapas por las que puede pasar un pago.',
      'Explicar que los sistemas reales pueden usar terminología diferente o más/menos estados.',
      'Identificar qué podría fallar plausiblemente en cada etapa.',
    ],
    mentalModel: 'Este es un modelo educativo simplificado, no una máquina de estados universal de ISO 20022.',
    sections: [
      {
        heading: 'Un ciclo de vida simplificado',
        body: 'Initiated → Received → Validated → Accepted → Cleared → Settled → Credited → Completed. Cada etapa representa un punto de control plausible en la vida de un pago. Diferentes esquemas de pago definen sus propios modelos de estado reales — esta secuencia es una herramienta educativa para razonar sobre "antes vs. después", no un estándar.',
      },
      {
        heading: 'Qué puede fallar en cada etapa',
        body: 'Initiated: la solicitud del cliente puede ser inválida. Received: el mensaje puede no llegar al siguiente participante. Validated: puede fallar la sintaxis, el esquema o reglas de negocio. Accepted: después de la aceptación, fallos posteriores usualmente requieren un tipo de mensaje distinto (como una devolución) en vez de un simple rechazo. Cleared/Settled: las obligaciones pueden no liquidarse por liquidez, tiempos o problemas técnicos. Credited: la institución receptora puede no poder acreditar la cuenta del beneficiario (por ejemplo, cuenta cerrada) aunque el settlement haya sido exitoso.',
      },
    ],
    commonConfusion: [
      {
        title: 'Este ciclo de vida es educativo, no un estándar',
        explanation: 'Los esquemas de pago reales definen sus propios modelos de estado específicos. Usa esta secuencia para razonar, no para citarla como un hecho.',
      },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Un ciclo de vida simplificado',
        body: 'Cada etapa a continuación representa un punto de control plausible en la vida de un pago. Diferentes esquemas de pago definen sus propios modelos de estado reales — esta secuencia es una herramienta educativa para razonar sobre "antes vs. después", no un estándar. Haz clic en cada etapa para ver qué significa y qué puede fallar ahí.',
        badge: 'simplified-model',
      },
      {
        type: 'lifecycle',
        stages: [
          { id: 'initiated', label: 'Iniciado', description: 'El cliente o sistema crea la solicitud de pago.', canFail: 'La solicitud del cliente misma puede ser inválida.' },
          { id: 'received', label: 'Recibido', description: 'El siguiente participante en la cadena recibe la instrucción.', canFail: 'El mensaje puede no llegar al siguiente participante.' },
          { id: 'validated', label: 'Validado', description: 'Se verifican la sintaxis, el esquema y las reglas de negocio.', canFail: 'Puede fallar la sintaxis, el esquema o las reglas de negocio.' },
          { id: 'accepted', label: 'Aceptado', description: 'El pago es aceptado para continuar el procesamiento.', canFail: 'Después de la aceptación, los fallos posteriores usualmente requieren un tipo de mensaje distinto (como una devolución) en vez de un simple rechazo.' },
          { id: 'cleared', label: 'Cleared', description: 'Se determina la obligación entre participantes.', canFail: 'Las obligaciones pueden no liquidarse por liquidez, tiempos o problemas técnicos.' },
          { id: 'settled', label: 'Settled', description: 'El valor realmente se mueve entre instituciones.', canFail: 'El settlement mismo puede fallar o retrasarse por liquidez o problemas técnicos.' },
          { id: 'credited', label: 'Acreditado', description: 'La institución receptora acredita la cuenta del beneficiario.', canFail: 'La institución receptora puede no poder acreditar la cuenta del beneficiario (por ejemplo, cuenta cerrada) aunque el settlement haya sido exitoso.' },
          { id: 'completed', label: 'Completado', description: 'El pago alcanzó su estado final en este modelo educativo.' },
        ],
      },
    ],
  },
  'clearing-vs-settlement': {
    title: 'Clearing vs. Settlement',
    subtitle: 'Dos de los términos más confundidos en pagos',
    whyItMatters: 'Casi toda conversación sobre pagos eventualmente depende de esta distinción. Entenderla mal dificulta razonar sobre riesgo, tiempos y finalidad.',
    objectives: [
      'Definir clearing como determinar qué se debe y a quién.',
      'Definir settlement como la liquidación real de esa obligación.',
      'Diferenciar conceptualmente gross, net, deferred y real-time settlement.',
    ],
    mentalModel: 'Clearing responde "¿quién le debe qué a quién?" Settlement es la liquidación real de esa obligación.',
    sections: [
      {
        heading: 'Clearing',
        body: 'Clearing es el proceso de intercambiar y validar instrucciones de pago y determinar las obligaciones resultantes entre participantes — esencialmente calcular quién le debe qué a quién antes de que ocurra cualquier transferencia final de valor.',
      },
      {
        heading: 'Settlement',
        body: 'Settlement es la liquidación real de esas obligaciones — el punto donde el valor realmente se mueve entre instituciones (a menudo a través de cuentas en un banco central o un agente de settlement). El settlement es lo que le da finalidad a un pago.',
      },
      {
        heading: 'Un ejemplo simple de dos vías',
        body: 'Supongamos que BANK_A le debe 100 a BANK_B, y BANK_B le debe 60 a BANK_A (obligaciones brutas). Dependiendo del mecanismo de settlement usado por un sistema dado, estas obligaciones podrían liquidarse individualmente (gross), o compensarse entre sí y liquidarse como un solo monto neto, o liquidarse en intervalos definidos (deferred), o liquidarse de forma continua en tiempo real. Qué mecanismo aplica depende enteramente del sistema en cuestión — no hay un enfoque universal único.',
      },
      {
        heading: 'Modelos de settlement',
        body: 'Gross settlement: cada obligación se liquida individualmente y en su totalidad. Net settlement: las obligaciones entre participantes se compensan y solo se liquida la diferencia neta. Deferred settlement: el settlement ocurre en puntos programados en vez de inmediatamente. Real-time settlement: el settlement ocurre continuamente, cerca del momento de la transacción.',
      },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Clearing determina la obligación',
        body: 'Clearing intercambia y valida instrucciones de pago, y después determina las obligaciones resultantes entre participantes. En el ejemplo siguiente, BANK_A debe 100 XXX a BANK_B mientras BANK_B debe 60 XXX a BANK_A. Esas son dos obligaciones brutas. Calcular su resultado neto nos dice quién debe qué, pero no mueve valor.',
        badge: 'reference',
      },
      {
        type: 'settlement-diagram',
        heading: 'Primero clearing. Después settlement.',
        intro: 'Ejecuta los dos eventos por separado. Después del clearing, detente y decide si el valor realmente se movió antes de activar el settlement.',
        parties: [
          { id: 'bank-a', label: 'BANK_A' },
          { id: 'bank-b', label: 'BANK_B' },
        ],
        obligations: [
          { from: 'bank-a', to: 'bank-b', amount: 100 },
          { from: 'bank-b', to: 'bank-a', amount: 60 },
        ],
        currency: 'XXX',
        clearedExplanation: 'Clearing compensa las dos obligaciones brutas y produce una obligación neta: BANK_A debe 40 XXX a BANK_B. La obligación ya se conoce, pero todavía no ha sido liquidada.',
        settledExplanation: 'Settlement cambia en 40 XXX las posiciones de settlement de los participantes y liquida la obligación neta en este modelo simplificado. Este evento interparticipante todavía no prueba, por sí solo, el crédito a la cuenta del beneficiario.',
        notice: 'Clearing y settlement responden preguntas distintas. Primero determina la obligación; después busca evidencia separada de que el valor se movió y la obligación fue liquidada.',
        schemeDependent: 'El sistema o esquema aplicable define si las obligaciones se liquidan de forma bruta o neta, en tiempo real o en intervalos diferidos, y cuál evento constituye settlement final.',
        badge: 'simplified-model',
      },
      {
        type: 'explanation',
        heading: 'Los modelos de settlement usan dos ejes diferentes',
        body: 'Gross versus net describe cómo se agrupan las obligaciones: individualmente o después de compensarlas. Real-time versus deferred describe cuándo ocurre el settlement: continuamente o en puntos programados. Estas ideas pueden combinarse. RTGS, por ejemplo, significa real-time gross settlement. No trates gross, net, real-time y deferred como cuatro etiquetas mutuamente excluyentes.',
        badge: 'reference',
      },
      { type: 'scenario', scenarioId: 'clearing-not-settlement' },
    ],
    commonConfusion: [
      { title: 'Clearing vs. Settlement', explanation: 'Clearing determina la obligación. Settlement la liquida. Un pago puede estar "cleared" sin haber sido aún liquidado ("settled").' },
    ],
  },
  'fast-payments': {
    title: 'Pagos Instantáneos',
    subtitle: 'Procesamiento casi en tiempo real, de extremo a extremo',
    whyItMatters: 'Los sistemas de pagos instantáneos (fast/instant payments) son uno de los desarrollos más importantes en los pagos modernos, e introducen restricciones — velocidad, disponibilidad, irrevocabilidad — que moldean cómo se usan los mensajes ISO 20022 en ese contexto.',
    objectives: [
      'Explicar qué significa típicamente "pago instantáneo" en términos de tiempo de procesamiento y disponibilidad.',
      'Enumerar las verificaciones por las que típicamente pasa un pago antes del procesamiento en la infraestructura.',
      'Explicar por qué la finalidad/irrevocabilidad, la detección de duplicados y la idempotencia importan para los pagos instantáneos.',
    ],
    mentalModel: 'Los pagos instantáneos comprimen todo el ciclo de vida en segundos — lo que significa que la validación, los controles antifraude y el reporte de estado deben ocurrir casi instantáneamente.',
    sections: [
      {
        heading: 'Qué significa "instantáneo"',
        body: 'Un sistema de pagos instantáneos (fast/instant) típicamente procesa pagos casi en tiempo real — a menudo en segundos — y suele estar disponible las 24 horas, los 7 días de la semana, los 365 días del año. Las garantías exactas dependen del esquema específico.',
      },
      {
        heading: 'El flujo',
        body: 'Cliente → Canal → Institución Originadora → Validación → Controles de Fraude/Cumplimiento → Infraestructura de Pagos Instantáneos → Institución Receptora → Cuenta del Beneficiario. Cada paso debe completarse lo suficientemente rápido para que la experiencia de extremo a extremo se sienta instantánea para el cliente.',
      },
      {
        heading: 'Preocupaciones clave únicas de los pagos instantáneos',
        body: 'Servicios de alias/proxy (resolver un número de teléfono o ID a una cuenta), validación de participantes y cuentas, controles de fraude y sanciones bajo presión de tiempo, límites de transacción, liquidez disponible para liquidar instantáneamente, timeouts cuando un participante receptor no responde a tiempo, detección de duplicados e idempotencia (asegurar que la misma instrucción no se procese dos veces), y manejo de excepciones cuando algo falla después de que ya se le dijo al cliente "enviado".',
      },
      {
        heading: 'Finalidad',
        body: 'Muchos esquemas de pagos instantáneos están diseñados para que, una vez confirmado un pago, se trate como final y generalmente no reversible mediante una simple cancelación — precisamente por eso entender return, recall y reversal como conceptos distintos (cubierto más adelante) importa tanto en este contexto.',
      },
    ],
    commonConfusion: [
      { title: 'Instantáneo no significa simple', explanation: 'Comprimir el ciclo de vida en segundos aumenta la complejidad operativa y técnica detrás de escena, aunque la experiencia del cliente se vea simple.' },
    ],
  },
  'iso20022-fundamentals': {
    title: 'Fundamentos de ISO 20022',
    subtitle: 'ISO 20022 no es XML',
    whyItMatters: 'Tratar a ISO 20022 como "solo un formato XML" es el mayor malentendido que bloquea la comprensión real. ISO 20022 es una metodología de modelado; XML es una sintaxis posible usada para representarlo.',
    objectives: [
      'Explicar las capas desde el proceso de negocio hasta la instancia XML.',
      'Establecer claramente por qué ISO 20022 no es equivalente a XML.',
      'Identificar las partes de un identificador de mensaje (familia, número, variante, versión).',
    ],
    mentalModel: 'Proceso de Negocio → Transacción de Negocio → Flujo de Mensaje → Definición de Mensaje → Componentes → Tipos de Datos → Sintaxis → instancia XML.',
    sections: [
      {
        heading: 'Del proceso de negocio al XML',
        body: 'ISO 20022 comienza modelando procesos y transacciones de negocio reales (por ejemplo, "una transferencia de crédito de cliente"). De ese modelo se derivan definiciones de mensajes, compuestas por componentes y tipos de datos reutilizables. Esas definiciones luego se expresan en una sintaxis concreta — hoy en día, más comúnmente XML, aunque el estándar en sí es independiente de la sintaxis.',
      },
      {
        heading: 'Por qué importa "ISO 20022 no es XML"',
        body: 'Si solo piensas en términos de etiquetas XML, te pierdes el modelo de negocio detrás de ellas y corres el riesgo de asumir que la presencia de una etiqueta en un esquema significa que es requerida o significativa en todos los contextos. Entender el modelo de negocio subyacente te ayuda a razonar sobre un campo incluso cuando no lo has memorizado.',
      },
      {
        heading: 'Leyendo un identificador de mensaje',
        body: 'Un identificador de mensaje como pacs.008.001.10 se descompone en: área de negocio (pacs), número de mensaje (008), variante (001) y versión (10). Pueden coexistir múltiples versiones del mismo mensaje; nunca asumas que solo existe una versión de un mensaje dado.',
      },
    ],
    commonConfusion: [
      { title: 'ISO 20022 vs. XML', explanation: 'XML es una representación posible de un mensaje ISO 20022. El propio ISO 20022 es una metodología de modelado más amplia que cubre procesos de negocio, no solo un formato de marcado.' },
      { title: 'XML válido vs. pago válido', explanation: 'Un mensaje puede ser sintácticamente válido (bien formado, válido contra el esquema) y aun así violar reglas de negocio o de esquema, o no lograr representar un pago que realmente pueda procesarse.' },
    ],
  },
  'message-families': {
    title: 'Familias de Mensajes',
    subtitle: 'pain, pacs, camt y compañía',
    whyItMatters: 'Reconocer una familia de mensajes te dice instantáneamente, aproximadamente, quién habla con quién y por qué — un enorme atajo al leer documentación desconocida.',
    objectives: [
      'Identificar el propósito típico de los mensajes pain, pacs y camt.',
      'Explicar que estos son patrones comunes, no reglas universales para cada mensaje de la familia.',
    ],
    sections: [
      { heading: 'pain — Payments Initiation', body: 'Se usa típicamente entre un cliente y su institución financiera, para mensajes relacionados con iniciar un pago. Ejemplo: pain.001 (Customer Credit Transfer Initiation).' },
      { heading: 'pacs — Payments Clearing and Settlement', body: 'Se usa típicamente entre instituciones financieras, para mensajes relacionados con clearing y settlement de pagos. Ejemplo: pacs.008 (FIToFICustomerCreditTransfer), pacs.002 (FIToFIPaymentStatusReport), pacs.004 (PaymentReturn).' },
      { heading: 'camt — Cash Management', body: 'Cubre actividades de gestión de efectivo: reportes de cuenta, estados de cuenta, notificaciones de débito/crédito e investigaciones. camt es más amplio que "estados de cuenta bancarios" — también cubre procesos de gestión de efectivo relevantes para los pagos.' },
      { heading: 'Otras familias', body: 'admi (mensajes de administración), head (encabezado de aplicación de negocio), remt (aviso de remesa) también existen. Payment Lab expandirá la cobertura de estos con el tiempo.' },
    ],
    commonConfusion: [
      { title: 'Estas descripciones son patrones, no reglas absolutas', explanation: 'No todos los mensajes de una familia siguen estrictamente el patrón "típico" de participantes descrito aquí — siempre verifica la definición de mensaje específica.' },
    ],
  },
  'pacs-008-deep-dive': {
    title: 'pacs.008 en Profundidad',
    subtitle: 'FIToFICustomerCreditTransfer, de cerca',
    whyItMatters: 'pacs.008 es el mensaje de transferencia de crédito que impulsa la mayoría de los pagos instantáneos. Entenderlo bien — no solo su nombre, sino su propósito, su lugar en el flujo y su estructura — hace que cada lección posterior en esta ruta encaje.',
    objectives: [
      'Explicar qué es pacs.008 y por qué existe.',
      'Ubicar correctamente pacs.008 entre la institución originadora y la receptora.',
      'Predecir qué tipo de información lleva pacs.008 antes de abrir su estructura.',
      'Abrir e inspeccionar la estructura real de campos de un mensaje pacs.008.',
      'Explicar qué ocurre típicamente después de enviar un pacs.008.',
    ],
    mentalModel: 'pacs.008 es cómo una institución financiera le dice a otra "mueve este dinero" — todo lo demás en esta ruta se construye sobre entender bien este mensaje.',
    commonConfusion: [
      { title: 'Un pacs.008 válido no es lo mismo que un pago completado', explanation: 'Pasar la validación de esquema/sintaxis solo significa que el mensaje está bien formado — el pago aún puede ser rechazado por razones de negocio o del esquema, o fallar más adelante en el ciclo de vida.' },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Qué es pacs.008, y por qué existe',
        body: 'pacs.008 (FIToFICustomerCreditTransfer) es un mensaje de institución financiera a institución financiera. Transporta todo lo necesario para procesar una transferencia de crédito de cliente entre instituciones — quién paga, a quién se le paga, cuánto, y los identificadores necesarios para rastrear la transacción de extremo a extremo.',
      },
      {
        type: 'payment-flow',
        heading: 'Por dónde viaja pacs.008',
        actors: [
          { id: 'banka', label: 'BANK_A' },
          { id: 'net', label: 'RED DE PAGOS' },
          { id: 'bankb', label: 'BANK_B' },
        ],
        steps: [
          { from: 'banka', to: 'net', label: 'pacs.008', messageId: 'pacs.008', status: 'active' },
          { from: 'net', to: 'bankb', label: 'pacs.008', messageId: 'pacs.008', status: 'active' },
        ],
      },
      {
        type: 'prediction',
        context: 'BANK_A ──[pacs.008]──▶ RED DE PAGOS',
        question: 'Si pacs.008 falla la validación de esquema en la red, ¿ya se acreditó a Bob?',
        options: [
          { id: 'a', label: 'Sí — el crédito ocurre en cuanto se envía el mensaje', correct: false },
          { id: 'b', label: 'No — esto es antes de la aceptación, así que nada se ha acreditado todavía', correct: true },
        ],
        explanation: 'Un fallo de validación de esquema ocurre antes de que el pago sea aceptado. Nada se ha liquidado ni acreditado en este punto — esta es la forma de un rechazo, no de una devolución.',
      },
      {
        type: 'message-inspector',
        messageId: 'pacs.008',
        intro: 'Explora la estructura real de campos a continuación. Haz clic en cualquier campo para ver su significado de negocio, cardinalidad y errores comunes.',
      },
      {
        type: 'scenario',
        scenarioId: 'pacs008-choose-message',
      },
      {
        type: 'callout',
        title: 'Qué viene típicamente después',
        body: 'Un reporte de estado (comúnmente tipo pacs.002) reporta qué ocurrió con la instrucción. Si algo falla después — tras la aceptación o el settlement — puede seguir una devolución (comúnmente tipo pacs.004). Ambos se cubren en las próximas lecciones.',
        tone: 'info',
      },
    ],
  },
  identifiers: {
    title: 'Identificadores',
    subtitle: 'MsgId, InstrId, EndToEndId, TxId — y por qué no son intercambiables',
    whyItMatters: 'Casi toda investigación, reconciliación o tarea de resolución de problemas empieza correlacionando identificadores entre mensajes. Confundirlos es una de las formas más rápidas de rastrear la transacción equivocada.',
    objectives: [
      'Distinguir identificadores a nivel de mensaje de identificadores a nivel de transacción.',
      'Explicar el propósito típico de MsgId, InstrId, EndToEndId y TxId.',
      'Razonar sobre qué identificador usar al rastrear un pago entre sistemas.',
    ],
    mentalModel: 'Un solo mensaje puede llevar múltiples transacciones. Los identificadores a nivel de mensaje describen el sobre; los identificadores a nivel de transacción describen cada pago individual dentro de él.',
    sections: [
      { heading: 'Niveles de identificación', body: 'Nivel de mensaje: identifica el mensaje en sí (por ejemplo, MsgId). Nivel de transacción: identifica una transacción individual dentro del mensaje (por ejemplo, InstrId, EndToEndId, TxId). También pueden agregarse referencias a nivel de red y a nivel de institución por las infraestructuras o instituciones a medida que el pago viaja.' },
      { heading: 'Roles típicos', body: 'MsgId: identifica el sobre del mensaje, asignado por el emisor del mensaje. InstrId: un identificador de instrucción, a menudo asignado por la parte instructora para su propio seguimiento. EndToEndId: pensado para viajar sin cambios con el pago desde el deudor original hasta el acreedor final, lo que lo hace particularmente valioso para el rastreo de extremo a extremo. TxId: un identificador de transacción, a menudo asignado dentro de la cadena de clearing/settlement. Dependiendo del esquema, pueden existir referencias adicionales (como una referencia del sistema de clearing o una referencia universal de transacción de extremo a extremo).' },
      { heading: 'Por qué importa esto para la reconciliación', body: 'Debido a que un mensaje puede contener varias transacciones, y cada transacción puede llevar varios identificadores, rastrear un solo pago durante una investigación requiere saber exactamente qué identificador se garantiza que permanezca consistente entre los mensajes que estás comparando.' },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Niveles de identificación',
        body: 'Nivel de mensaje: identifica el mensaje en sí (por ejemplo, MsgId). Nivel de transacción: identifica una transacción individual dentro del mensaje (por ejemplo, InstrId, EndToEndId, TxId). También pueden agregarse referencias a nivel de red y a nivel de institución por las infraestructuras o instituciones a medida que el pago viaja.',
      },
      {
        type: 'explanation',
        heading: 'Roles típicos',
        body: 'MsgId: identifica el sobre del mensaje, asignado por el emisor del mensaje. InstrId: un identificador de instrucción, a menudo asignado por la parte instructora para su propio seguimiento. EndToEndId: pensado para viajar sin cambios con el pago desde el deudor original hasta el acreedor final, lo que lo hace particularmente valioso para el rastreo de extremo a extremo. TxId: un identificador de transacción, a menudo asignado dentro de la cadena de clearing/settlement. Dependiendo del esquema, pueden existir referencias adicionales (como una referencia del sistema de clearing o una referencia universal de transacción de extremo a extremo).',
      },
      {
        type: 'explanation',
        heading: 'Por qué importa esto para la reconciliación',
        body: 'Debido a que un mensaje puede contener varias transacciones, y cada transacción puede llevar varios identificadores, rastrear un solo pago durante una investigación requiere saber exactamente qué identificador se garantiza que permanezca consistente entre los mensajes que estás comparando.',
      },
      {
        type: 'identifier-trace',
        messages: [
          { messageId: 'pacs.008', linkFieldId: 'EndToEndId', linkFieldLabel: 'EndToEndId' },
          { messageId: 'pacs.002', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
          { messageId: 'pacs.004', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
        ],
      },
    ],
    commonConfusion: [
      { title: 'MsgId vs. TxId', explanation: 'MsgId identifica el sobre que puede contener potencialmente muchas transacciones. TxId identifica una transacción específica dentro de él. Responden preguntas diferentes.' },
    ],
  },
  'reject-vs-return': {
    title: 'Rechazo vs. Devolución',
    subtitle: 'Una de las distinciones más importantes en pagos',
    whyItMatters: 'Elegir la ruta de investigación equivocada (reject vs. return vs. cancellation) desperdicia tiempo y puede desviar todo un esfuerzo de resolución de problemas. Esta distinción aparece constantemente en operaciones de pagos reales.',
    objectives: [
      'Explicar reject como "no aceptado / no puede continuar" antes/durante la validación.',
      'Explicar return como "ya procesado/aceptado, pero luego no puede completarse".',
      'Razonar sobre cuál aplica dado un punto de fallo en el ciclo de vida.',
    ],
    mentalModel: 'El rechazo (reject) ocurre antes de la aceptación. La devolución (return) ocurre después de la aceptación. El límite exacto y los mensajes usados dependen del esquema de pago.',
    sections: [
      { heading: 'Reject (Rechazo)', body: 'Se recibe una instrucción de pago, se encuentra un problema de validación o de negocio, y el pago no es aceptado — no puede continuar por el flujo normal. Conceptualmente: instrucción → validación/problema → no aceptado.' },
      { heading: 'Return (Devolución)', body: 'Un pago ya ha sido procesado y aceptado, pero después no puede completarse (por ejemplo, la cuenta del beneficiario resulta estar cerrada). Los fondos o el pago mismo se envían de vuelta. Conceptualmente: procesado/aceptado → luego no puede completarse → enviado de vuelta.' },
      { heading: 'El límite exacto depende del esquema', body: 'Dónde exactamente ocurre la "aceptación", y qué mensajes se usan para reject vs. return, depende del esquema de pago específico y del punto en el ciclo de vida. Usa el modelo de esta lección para razonar sobre la forma general del problema, no como una regla universal para cada esquema.' },
    ],
    commonConfusion: [
      { title: 'Reject y Return no son lo mismo', explanation: 'Un reject significa que el pago nunca progresó realmente. Un return significa que sí progresó y ahora se está revirtiendo. Investigar el equivocado desperdicia tiempo.' },
    ],
  },
  'cancellation-recall-reversal': {
    title: 'Cancelación, Recall y Reversión',
    subtitle: 'No son lo mismo que una devolución — ni son lo mismo entre sí',
    whyItMatters: 'Los equipos a menudo dicen "cancélalo" queriendo decir cosas muy distintas. Saber qué concepto aplica realmente cambia qué pides y qué resultado puedes esperar.',
    objectives: [
      'Distinguir una solicitud de cancelación de un recall, una reversión, un rechazo y una devolución.',
      'Explicar por qué ninguno de estos resultados está garantizado una vez que un pago ha progresado lo suficiente.',
      'Usar un árbol de decisión simple para razonar sobre qué concepto aplica a una situación dada.',
    ],
    mentalModel: 'Los conceptos de la familia de cancelación tratan de deshacer algo después de los hechos — difieren en cuándo se usan y si el resultado está garantizado.',
    sections: [
      { heading: 'Solicitud de cancelación', body: 'Una solicitud, generalmente enviada por el lado emisor original, pidiendo que un pago no se procese más o se deshaga. Que tenga éxito depende de cuánto haya progresado ya el pago y de las reglas del esquema involucrado.' },
      { heading: 'Recall', body: 'Similar en espíritu a una solicitud de cancelación — el lado emisor pide que un pago sea devuelto, generalmente después de haber sido enviado. Un recall es una solicitud, no una garantía: el lado receptor puede o no poder honrarla (por ejemplo, si los fondos ya fueron pagados al beneficiario).' },
      { heading: 'Reversión (Reversal)', body: 'Deshacer el efecto de un pago que ya fue liquidado, típicamente iniciado del lado de procesamiento/recepción en vez de como una solicitud impulsada por el cliente (por ejemplo, corregir un duplicado técnico). Los mecanismos exactos dependen mucho del esquema.' },
      { heading: 'Rechazo y Devolución, revisitados', body: 'Como se cubrió antes: un rechazo ocurre antes/durante la aceptación (el pago nunca progresó realmente). Una devolución ocurre después de la aceptación, cuando un pago ya progresó pero luego no puede completarse. Las solicitudes de cancelación y recall son diferentes otra vez — son intentos de deshacer algo que ya podría estar más allá del punto donde deshacerlo está garantizado.' },
    ],
    commonConfusion: [
      { title: 'Cancelación ≠ Devolución', explanation: 'Una devolución significa que el pago ya progresó y los fondos se están enviando de vuelta por el flujo normal de excepción. Una cancelación/recall es una solicitud que puede o no ser honrada — no es un resultado garantizado.' },
      { title: 'Recall ≠ reversión garantizada', explanation: 'Pedir que un pago sea recuperado no significa que se deshará. El lado receptor puede ya haber liberado los fondos, especialmente en esquemas de pagos instantáneos diseñados para alta finalidad.' },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Solicitud de cancelación',
        body: 'Una solicitud, generalmente enviada por el lado emisor original, pidiendo que un pago no se procese más o se deshaga. Que tenga éxito depende de cuánto haya progresado ya el pago y de las reglas del esquema involucrado.',
      },
      {
        type: 'explanation',
        heading: 'Recall',
        body: 'Similar en espíritu a una solicitud de cancelación — el lado emisor pide que un pago sea devuelto, generalmente después de haber sido enviado. Un recall es una solicitud, no una garantía: el lado receptor puede o no poder honrarla (por ejemplo, si los fondos ya fueron pagados al beneficiario).',
      },
      {
        type: 'explanation',
        heading: 'Reversión (Reversal)',
        body: 'Deshacer el efecto de un pago que ya fue liquidado, típicamente iniciado del lado de procesamiento/recepción en vez de como una solicitud impulsada por el cliente (por ejemplo, corregir un duplicado técnico). Los mecanismos exactos dependen mucho del esquema.',
      },
      {
        type: 'explanation',
        heading: 'Rechazo y Devolución, revisitados',
        body: 'Como se cubrió antes: un rechazo ocurre antes/durante la aceptación (el pago nunca progresó realmente). Una devolución ocurre después de la aceptación, cuando un pago ya progresó pero luego no puede completarse. Las solicitudes de cancelación y recall son diferentes otra vez — son intentos de deshacer algo que ya podría estar más allá del punto donde deshacerlo está garantizado.',
        badge: 'simplified-model',
      },
      {
        type: 'decision-tree',
        root: {
          question: '¿El pago ya progresó (aceptado / liquidado)?',
          answers: [
            { label: 'No', result: 'Investigar como un rechazo o solicitud de cancelación' },
            {
              label: 'Sí',
              next: {
                question: '¿Los fondos se están enviando explícitamente de vuelta?',
                answers: [
                  { label: 'Sí', result: 'Investigar como una devolución' },
                  { label: 'No', result: 'Investigar como un recall o solicitud de reversión (no garantizado)' },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  'camt-003-deep-dive': {
    title: 'camt.003 GetAccount',
    subtitle: 'Consultar una cuenta sin mover valor',
    whyItMatters:
      'Los equipos de operaciones deben distinguir una consulta de información de cuenta de una instrucción o devolución de pago. camt.003 hace concreto ese límite: solicita datos a un servicer de cuenta o administrador de transacciones y comúnmente puede ser seguido por una respuesta camt.004.',
    objectives: [
      'Explicar el propósito de camt.003 GetAccount y quién lo intercambia.',
      'Distinguir la consulta camt.003 de la respuesta camt.004 y de la devolución de pago pacs.004.',
      'Leer MsgHdr, MsgId, ReqTp y la ruta de criterios de cuenta en camt.003.001.08.',
      'Explicar por qué enviar camt.003 no prueba un saldo, no mueve fondos ni resuelve una investigación de pago.',
      'Indicar qué queda TO VERIFY antes de relacionar camt.003 con el esquema SPI/SGPI dominicano.',
    ],
    mentalModel: 'camt.003 hace una pregunta sobre una cuenta. camt.004 puede responderla. Ninguno es una instrucción de transferencia de crédito de cliente.',
    blocks: [
      {
        type: 'explanation',
        heading: 'Una consulta sobre una cuenta, no una orden de pago',
        body:
          'camt.003 (GetAccount) transporta una solicitud de información de cuenta seleccionada mediante criterios de búsqueda. Perfiles públicos de infraestructuras de pago utilizan este concepto para consultas orientadas a cuenta, balance o liquidez. ISO define la semántica; el perfil del servicio o esquema aplicable define qué tipos de solicitud y criterios admite.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'Solicitud y respuesta son evidencia separada',
        badge: 'simplified-model',
        steps: [
          {
            id: 'get-account-request',
            from: 'BANK_A',
            to: 'ACCOUNT_SERVICER',
            label: 'camt.003',
            messageId: 'camt.003',
            description: 'Solicita información de cuenta usando un identificador de mensaje, un tipo de solicitud y criterios de cuenta.',
            tone: 'camt',
          },
          {
            id: 'return-account-response',
            from: 'ACCOUNT_SERVICER',
            to: 'BANK_A',
            label: 'camt.004',
            messageId: 'camt.004',
            description: 'Puede devolver los datos de cuenta solicitados bajo el perfil seleccionado.',
            tone: 'camt',
          },
        ],
      },
      {
        type: 'comparison',
        heading: 'La trampa 003/004: lee siempre la familia y el verbo de negocio',
        intro: 'El número por sí solo no basta. Get, ReturnAccount y PaymentReturn representan acciones de negocio diferentes.',
        examplesLabel: 'Campos / conceptos clave',
        badge: 'reference',
        items: [
          {
            id: 'camt003',
            label: 'camt.003 GetAccount',
            keyQuestion: '¿Qué información de cuenta necesito?',
            summary: 'Envía criterios de búsqueda para solicitar información admitida de cuenta, balance o liquidez.',
            examples: ['MsgHdr', 'MsgId', 'ReqTp', 'AcctQryDef'],
            notThis: 'No transfiere fondos de clientes y no prueba el saldo solicitado.',
            tone: 'camt',
          },
          {
            id: 'camt004',
            label: 'camt.004 ReturnAccount',
            keyQuestion: '¿Qué información de cuenta se está devolviendo?',
            summary: 'Proporciona información de cuenta como respuesta o notificación definida por el perfil.',
            examples: ['detalles de cuenta', 'balances', 'respuesta de consulta'],
            notThis: 'No es la devolución de una transferencia de crédito de cliente.',
            tone: 'camt',
          },
          {
            id: 'pacs004',
            label: 'pacs.004 PaymentReturn',
            keyQuestion: '¿Por qué se devuelve el valor de un pago que ya progresó?',
            summary: 'Devuelve un pago y referencia la transacción de pago original.',
            examples: ['OrgnlEndToEndId', 'RtrdIntrBkSttlmAmt', 'RtrRsnInf'],
            notThis: 'No responde una consulta de cuenta aunque comparta el número 004.',
            tone: 'pacs',
          },
        ],
      },
      {
        type: 'prediction',
        context: 'BANK_A envió camt.003 MSG-ACCT-QUERY-001; todavía no llegó respuesta.',
        question: '¿Puede operaciones concluir que ACCOUNT-001 tiene saldo cero?',
        options: [
          { id: 'a', label: 'Sí: ausencia de respuesta significa saldo cero', correct: false },
          { id: 'b', label: 'No: la solicitud solo prueba que se envió una consulta', correct: true },
        ],
        explanation:
          'Una solicitud camt.003 contiene una pregunta y sus criterios de búsqueda. Los datos solicitados requieren evidencia de respuesta, comúnmente un camt.004 bajo el perfil aplicable. Sin respuesta significa desconocido, no cero.',
      },
      {
        type: 'message-inspector',
        messageId: 'camt.003',
        intro: 'Sigue la ruta seleccionada de V08 desde MsgHdr y MsgId hasta AcctQryDef, AcctCrit y los criterios de búsqueda de cuenta.',
      },
      {
        type: 'quick-check',
        question: '¿Qué parte indica al receptor qué información de cuenta debe buscar?',
        options: [
          { id: 'a', label: 'MsgHdr / MsgId', correct: false },
          { id: 'b', label: 'AcctQryDef / AcctCrit', correct: true },
          { id: 'c', label: 'Un EndToEndId de pacs.008', correct: false },
        ],
        explanation:
          'MsgId identifica el mensaje de consulta. AcctQryDef y sus criterios describen qué buscar. Un EndToEndId de pago no es la clave de cuenta de GetAccount.',
      },
      {
        type: 'investigation-checklist',
        heading: 'Qué verificar en un intercambio camt.003 real',
        intro: 'Separa la evidencia de la solicitud, la evidencia de la respuesta y las reglas específicas del perfil.',
        groups: [
          {
            title: 'Evidencia de solicitud',
            items: ['Emisor y receptor', 'versión de camt.003', 'MsgId', 'tipo de solicitud', 'criterios de búsqueda', 'hora de envío'],
          },
          {
            title: 'Evidencia de respuesta',
            items: ['Si llegó camt.004', 'correlación de consulta', 'cuenta encontrada', 'balance o estado devuelto', 'evidencia de error o rechazo'],
          },
          {
            title: 'Preguntas del perfil',
            items: ['Tipos de solicitud admitidos', 'criterios obligatorios', 'reglas de autorización', 'manejo de timeout', 'versión seleccionada de camt.004'],
          },
        ],
      },
      { type: 'scenario', scenarioId: 'spi-rd-message-triage' },
      {
        type: 'callout',
        title: 'Límite SPI/SGPI dominicano',
        body:
          'camt.003 es conocimiento ISO útil, pero el material público del BCRD revisado para este laboratorio no establece que SGPI lo utilice. El servicio exacto, la versión, los tipos de solicitud, los actores y el perfil de respuesta quedan TO VERIFY contra documentación autorizada del esquema o de la institución.',
        tone: 'warning',
      },
    ],
    commonConfusion: [
      { title: 'Consulta enviada no significa saldo conocido', explanation: 'camt.003 prueba que se creó o envió una consulta. Los datos de cuenta requieren una respuesta u otra evidencia autoritativa.' },
      { title: 'camt.004 no es pacs.004', explanation: 'camt.004 devuelve información de cuenta. pacs.004 devuelve un pago que ya progresó.' },
    ],
  },
  'camt-cash-management': {
    title: 'camt y Gestión de Efectivo',
    subtitle: 'Más que "estados de cuenta"',
    whyItMatters: 'Los mensajes camt aparecen constantemente en trabajo de reconciliación e investigación. Saber qué cubre realmente la familia — no solo estados de cuenta — te ayuda a reconocer cuándo un mensaje camt es la herramienta correcta.',
    objectives: [
      'Explicar qué cubre "gestión de efectivo" más allá de los estados de cuenta.',
      'Reconocer reportes de cuenta, notificaciones y mensajes de investigación como casos de uso de camt.',
      'Identificar dónde encaja camt respecto a los mensajes pacs en la vida de un pago.',
    ],
    sections: [
      { heading: 'Más allá del estado de cuenta', body: 'camt a menudo se presenta como "la familia de estados de cuenta bancarios", lo cual la subestima. Cubre un conjunto más amplio de actividades de gestión de efectivo: estados de cuenta periódicos, notificaciones de débito/crédito en tiempo real, solicitudes de reporte de cuenta ad-hoc, y mensajes relacionados con investigaciones usados cuando algo sobre un pago necesita ser revisado después de los hechos.' },
      { heading: 'Dónde encaja camt', body: 'Mientras que los mensajes pain inician pagos y los mensajes pacs los llevan entre instituciones, los mensajes camt típicamente reportan sobre el estado resultante de las cuentas y ayudan a mirar hacia atrás lo que ocurrió — lo que los hace centrales para el trabajo de reconciliación e investigación, cubierto en la siguiente lección.' },
      { heading: 'Dos ejemplos representativos', body: 'Un mensaje tipo estado de cuenta reporta las transacciones y saldos de una cuenta durante un período. Un mensaje tipo investigación se usa para solicitar o reportar sobre la resolución de una pregunta sobre un pago específico (por ejemplo, "¿a dónde fue este pago?"). El Atlas de Payment Lab incluye entradas a nivel de catálogo para ambos — ver la familia camt en el Catálogo de Mensajes.' },
    ],
    commonConfusion: [
      { title: 'camt no es solo estados de cuenta', explanation: 'Los estados de cuenta son una parte de camt. Las notificaciones, solicitudes de reporte y mensajes de investigación también son parte de la familia.' },
    ],
  },
  'reconciliation-investigations': {
    title: 'Reconciliación e Investigaciones',
    subtitle: 'Comparar registros y perseguir excepciones',
    whyItMatters: 'Cuando un cliente pregunta "¿dónde está mi pago?", la reconciliación y la investigación son las disciplinas que lo responden — y dependen enteramente de los identificadores y relaciones entre mensajes cubiertos antes en esta ruta.',
    objectives: [
      'Explicar la reconciliación como comparar registros entre sistemas o instituciones.',
      'Explicar cuándo se abre una investigación y qué típicamente intenta establecer.',
      'Identificar qué identificadores y mensajes son más útiles al iniciar una investigación.',
    ],
    mentalModel: 'La reconciliación pregunta "¿coinciden nuestros registros?" La investigación pregunta "¿qué pasó realmente con este pago específico?"',
    sections: [
      { heading: 'Reconciliación', body: 'La reconciliación compara registros mantenidos por diferentes sistemas o instituciones (por ejemplo, un ledger central y un sistema de pagos) para confirmar que coinciden — mismas transacciones, mismos montos, mismos estados. Las discrepancias encontradas durante la reconciliación a menudo son lo que desencadena una investigación.' },
      { heading: 'Investigación', body: 'Se abre una investigación cuando algo sobre un pago específico necesita establecerse — por ejemplo, si fue recibido, por qué no se ha acreditado, o dónde se encuentra actualmente en la cadena. Las investigaciones típicamente comienzan a partir de un identificador (más confiablemente EndToEndId) y rastrean hacia adelante o hacia atrás a través de mensajes relacionados.' },
      { heading: 'Qué buscas primero', body: 'En la práctica: comienza con el EndToEndId de la transacción en cuestión, busca reportes de estado (tipo pacs.002) que lo referencien, verifica si existe una devolución (tipo pacs.004), y consulta mensajes de reporte/investigación tipo camt para la vista a nivel de cuenta. Esta es la misma habilidad de razonamiento que se ejercita en el laboratorio del Depurador de Pagos.' },
    ],
    commonConfusion: [
      { title: 'Reconciliación vs. Investigación', explanation: 'La reconciliación es un proceso rutinario de comparación que puede revelar una discrepancia. La investigación es el seguimiento enfocado en un pago específico una vez que se identifica una discrepancia o pregunta.' },
    ],
  },
  'payment-architecture': {
    title: 'Arquitectura de Pagos',
    subtitle: 'Una vista educativa genérica de cómo encajan las piezas',
    whyItMatters: 'Tener una sola imagen mental de cómo se relacionan típicamente un canal, un orquestador, la validación y un ledger central facilita mucho adivinar dónde vive un problema cuando alguien describe un problema de pago.',
    objectives: [
      'Describir un flujo técnico genérico desde el canal del cliente hasta el ledger central.',
      'Identificar dónde suelen ubicarse la validación, el fraude/cumplimiento y el mapeo ISO en ese flujo.',
      'Explicar por qué esto es un modelo educativo simplificado, no una arquitectura universal.',
    ],
    mentalModel: 'Esta es una arquitectura genérica plausible, usada para construir intuición — las instituciones reales estructuran esto de forma diferente.',
    sections: [
      { heading: 'Un flujo genérico', body: 'Canal (donde el cliente o sistema inicia) → API de Pagos → Orquestador de Pagos → Validación (incluyendo fraude, cumplimiento, límites y enrutamiento) → Mapper ISO (traduciendo entre modelos de datos internos y mensajes ISO 20022) → Red de Pagos → Adaptador de Entrada (del lado receptor) → Core / Ledger (donde la cuenta realmente se debita o acredita).' },
      { heading: 'Por qué importa esto para la resolución de problemas', body: 'Cuando alguien reporta "el pago falló", este modelo genérico te da preguntas que hacer: ¿falló en la validación (antes de llegar a la red), a nivel de red/esquema, o después de ser recibido, durante el procesamiento del core/ledger? Cada capa tiende a producir síntomas diferentes y requiere personas distintas para investigar.' },
      { heading: 'Esto no es universal', body: 'Las instituciones reales combinan, dividen, renombran o reordenan estos componentes constantemente. Usa este diagrama para construir el hábito de pensar en capas, no como la descripción de un sistema específico.' },
    ],
    commonConfusion: [
      { title: 'Este es un modelo educativo, no una arquitectura real', explanation: 'Ninguna institución está obligada a estructurar sus sistemas exactamente así. Úsalo para razonar sobre capas de responsabilidad, no como una especificación.' },
    ],
    blocks: [
      {
        type: 'explanation',
        heading: 'Un flujo genérico',
        body: 'Canal (donde el cliente o sistema inicia) → API de Pagos → Orquestador de Pagos → Validación (incluyendo fraude, cumplimiento, límites y enrutamiento) → Mapper ISO (traduciendo entre modelos de datos internos y mensajes ISO 20022) → Red de Pagos → Adaptador de Entrada (del lado receptor) → Core / Ledger (donde la cuenta realmente se debita o acredita).',
        badge: 'simplified-model',
      },
      {
        type: 'architecture',
        label: 'Arquitectura educativa genérica',
        steps: ['Canal', 'API de Pagos', 'Orquestador de Pagos', 'Validación', 'Mapper ISO', 'Red de Pagos', 'Adaptador de Entrada', 'Core / Ledger'],
        branchAfterStep: 'Validación',
        branchItems: ['Fraude', 'Cumplimiento', 'Límites', 'Enrutamiento'],
      },
      {
        type: 'explanation',
        heading: 'Por qué importa esto para la resolución de problemas',
        body: 'Cuando alguien reporta "el pago falló", este modelo genérico te da preguntas que hacer: ¿falló en la validación (antes de llegar a la red), a nivel de red/esquema, o después de ser recibido, durante el procesamiento del core/ledger? Cada capa tiende a producir síntomas diferentes y requiere personas distintas para investigar.',
      },
      {
        type: 'callout',
        title: 'Esto no es universal',
        body: 'Las instituciones reales combinan, dividen, renombran o reordenan estos componentes constantemente. Usa este diagrama para construir el hábito de pensar en capas, no como la descripción de un sistema específico.',
        tone: 'warning',
      },
    ],
  },
  'pain-001': {
    title: 'pain.001 Iniciación del Cliente',
    subtitle: 'La instrucción del cliente antes del pago interbancario',
    whyItMatters: 'pain.001 te ayuda a separar la solicitud del cliente del pago interbancario. Ese límite importa para investigar si un problema ocurrió en el canal, en la entidad originadora o después de crear una instrucción interbancaria.',
    objectives: [
      'Explicar el propósito de pain.001 en la iniciación cliente-a-institución.',
      'Distinguir pain.001 de la instrucción interbancaria pacs.008.',
      'Reconocer que recibir pain.001 no prueba que un pago interbancario fue enviado o liquidado.',
      'Inspeccionar Group Header, Payment Information y la estructura de transacciones.',
    ],
    mentalModel: 'pain.001 solicita a una institución financiera iniciar un pago. pacs.008 lleva una transferencia de crédito de cliente entre instituciones financieras.',
    blocks: [
      {
        type: 'explanation',
        heading: 'Solicitud del cliente, no settlement interbancario',
        body: 'pain.001 (CustomerCreditTransferInitiation) lleva una instrucción del cliente hacia una institución financiera. La institución todavía debe validar esa solicitud y decidir cómo procesarla. Un tramo interbancario posterior puede usar pacs.008, pero la transformación y el enrutamiento exactos pertenecen al esquema y a la implementación de la institución.',
        badge: 'reference',
      },
      {
        type: 'message-sequence',
        heading: 'De la iniciación del cliente a una instrucción interbancaria',
        badge: 'simplified-model',
        steps: [
          { id: 'customer-initiation', from: 'CUSTOMER_A', to: 'BANK_A', label: 'pain.001', messageId: 'pain.001', description: 'Solicita una o más transferencias de crédito de cliente.', tone: 'pain' },
          { id: 'interbank-instruction', from: 'BANK_A', to: 'PAYMENT_SYSTEM', label: 'concepto pacs.008', messageId: 'pacs.008', description: 'Una posible instrucción interbancaria después de validar; el uso exacto depende del esquema.', tone: 'pacs' },
        ],
      },
      {
        type: 'prediction',
        context: 'CUSTOMER_A -> BANK_A [pain.001 recibido]',
        question: '¿Puedes concluir que el pago interbancario ya fue enviado y liquidado?',
        options: [
          { id: 'a', label: 'Sí; pain.001 significa que el pago está completo', correct: false },
          { id: 'b', label: 'No; solo prueba que se recibió una instrucción de iniciación', correct: true },
        ],
        explanation: 'Recibir una instrucción del cliente es solamente la etapa de iniciación. Validación, mensajería interbancaria, aceptación, settlement y crédito al beneficiario son eventos posteriores.',
      },
      { type: 'message-inspector', messageId: 'pain.001', intro: 'Abre Payment Information e identifica qué datos pertenecen al lado deudor y cuáles a cada transacción individual.' },
      { type: 'scenario', scenarioId: 'pain001-customer-request' },
      { type: 'callout', title: 'Límite de implementación', body: 'La forma en que un banco recibe pain.001, lo valida, lo mapea a un modelo interno y crea una instrucción interbancaria es específica de la implementación. Trata esta lección como semántica del mensaje, no como descripción de arquitectura interna.', tone: 'warning' },
    ],
    commonConfusion: [
      { title: 'pain.001 no es pacs.008', explanation: 'pain.001 es iniciación de cara al cliente. pacs.008 es una transferencia de crédito de cliente entre instituciones financieras.' },
    ],
  },
  'pacs-002': {
    title: 'pacs.002 Reporte de Estado del Pago',
    subtitle: '¿Qué ocurrió con la instrucción interbancaria original?',
    whyItMatters: 'Los equipos de operaciones rara vez investigan un pago usando solamente la instrucción original. pacs.002 aporta estado y correlación para determinar si una instrucción fue aceptada, rechazada o continúa sin resolverse.',
    objectives: [
      'Explicar el propósito de pacs.002 como reporte de estado.',
      'Correlacionar el reporte con un pacs.008 original mediante identificadores originales.',
      'Distinguir el MsgId del reporte de los identificadores del pago original.',
      'Explicar por qué un estado reportado no prueba automáticamente settlement o crédito al beneficiario.',
    ],
    mentalModel: 'pacs.008 solicita la transferencia. pacs.002 reporta un estado sobre esa instrucción anterior.',
    blocks: [
      { type: 'explanation', heading: 'Un reporte sobre otro mensaje', body: 'pacs.002 (FIToFIPaymentStatusReport) reporta el estado de una instrucción de pago recibida previamente. Su propio MsgId identifica el sobre del reporte; los identificadores originales del mensaje y de la transacción identifican aquello sobre lo que se informa.', badge: 'reference' },
      {
        type: 'message-sequence',
        heading: 'Instrucción y respuesta de estado',
        steps: [
          { id: 'original-instruction', from: 'BANK_A', to: 'PAYMENT_SYSTEM', label: 'pacs.008', messageId: 'pacs.008', description: 'Instrucción interbancaria original de transferencia de crédito.', tone: 'pacs' },
          { id: 'status-report', from: 'PAYMENT_SYSTEM', to: 'BANK_A', label: 'pacs.002', messageId: 'pacs.002', description: 'Reporta un estado y referencia la instrucción o transacción original.', tone: 'pacs' },
        ],
      },
      {
        type: 'prediction',
        context: 'pacs.002 reporta un estado aceptado',
        question: '¿Puedes concluir solo con ese estado que la cuenta del beneficiario fue acreditada?',
        options: [
          { id: 'a', label: 'Sí; aceptado siempre significa acreditado', correct: false },
          { id: 'b', label: 'No; aceptación, settlement y crédito son eventos separados', correct: true },
        ],
        explanation: 'Un estado debe interpretarse dentro de su contexto de reporte y las reglas del esquema. La aceptación evidencia una decisión, no necesariamente settlement o posting al beneficiario.',
      },
      {
        type: 'identifier-trace',
        messages: [
          { messageId: 'pacs.008', linkFieldId: 'EndToEndId', linkFieldLabel: 'EndToEndId' },
          { messageId: 'pacs.002', linkFieldId: 'OrgnlEndToEndId', linkFieldLabel: 'OrgnlEndToEndId' },
        ],
      },
      { type: 'message-inspector', messageId: 'pacs.002', intro: 'Compara el MsgId del reporte con OrgnlEndToEndId, TxSts y Status Reason Information.' },
      { type: 'scenario', scenarioId: 'pacs002-status-correlation' },
      { type: 'callout', title: 'El significado del estado depende del contexto', body: 'ISO define el mensaje y la semántica del reporte de estado. El esquema define qué estados usa, cuándo los envía y qué finalidad operativa representa cada estado.', tone: 'warning' },
    ],
    commonConfusion: [
      { title: 'MsgId del reporte vs. identificadores originales', explanation: 'El MsgId de pacs.002 identifica el reporte. Los identificadores originales lo correlacionan con el pago reportado.' },
    ],
  },
  'payment-status': {
    title: 'Estado del Pago',
    subtitle: 'Recibido no es aceptado; aceptado no es settled; settled no es acreditado',
    whyItMatters: 'La mayoría de las investigaciones se vuelven más claras cuando dejas de tratar los estados como sinónimos. Cada estado responde una pregunta diferente sobre procesamiento, movimiento de dinero y certeza.',
    objectives: [
      'Distinguir recibido, validado, aceptado, settled y acreditado.',
      'Preguntar quién asignó un estado y qué evento representa.',
      'Evitar inferir movimiento de dinero a partir del intercambio de mensajes.',
      'Identificar qué evidencia adicional hace falta cuando el estado es incierto.',
    ],
    mentalModel: 'Pregunta siempre: ¿estado de qué, asignado por quién, en qué etapa y respaldado por qué evidencia?',
    blocks: [
      {
        type: 'lifecycle',
        badge: 'simplified-model',
        stages: [
          { id: 'received', label: 'Recibido', description: 'Un participante o infraestructura recibió la instrucción.', canFail: 'La recepción no prueba aceptación de negocio.' },
          { id: 'validated', label: 'Validado', description: 'La instrucción pasó un conjunto definido de validaciones.', canFail: 'Otras reglas de negocio o esquema todavía pueden rechazarla.' },
          { id: 'accepted', label: 'Aceptado', description: 'Un participante aceptó el pago para continuar procesándolo.', canFail: 'La aceptación por sí sola no prueba settlement.' },
          { id: 'settled', label: 'Settled', description: 'La obligación entre instituciones fue liquidada.', canFail: 'El posting al beneficiario todavía puede estar pendiente o fallar.' },
          { id: 'credited', label: 'Acreditado', description: 'La entidad receptora registró los fondos en la cuenta del beneficiario.', canFail: 'La disponibilidad para el cliente y la notificación pueden ser asuntos separados.' },
        ],
      },
      {
        type: 'quick-check',
        question: 'Un mensaje fue recibido correctamente, pero no existe evidencia de settlement. ¿Puedes concluir que el dinero se movió?',
        options: [
          { id: 'a', label: 'Sí; recibir el mensaje prueba settlement', correct: false },
          { id: 'b', label: 'No; intercambio de mensajes y settlement son eventos distintos', correct: true },
        ],
        explanation: 'Un mensaje recibido aporta evidencia de comunicación. Settlement requiere evidencia sobre la obligación financiera y el esquema o sistema de liquidación relevante.',
      },
      {
        type: 'message-sequence',
        heading: 'Evidencia de estado alrededor de una instrucción',
        badge: 'simplified-model',
        steps: [
          { id: 'instruction', from: 'BANK_A', to: 'PAYMENT_SYSTEM', label: 'pacs.008', messageId: 'pacs.008', description: 'La instrucción entra a procesamiento.', tone: 'pacs' },
          { id: 'status', from: 'PAYMENT_SYSTEM', to: 'BANK_A', label: 'concepto pacs.002', messageId: 'pacs.002', description: 'Un reporte aporta evidencia de procesamiento interpretada bajo las reglas del esquema.', tone: 'pacs' },
          { id: 'money-evidence', from: 'SETTLEMENT', to: 'OPERATIONS', label: 'Evidencia de settlement', description: 'Se necesita evidencia separada antes de concluir que el valor se movió.', tone: 'neutral' },
        ],
      },
      { type: 'scenario', scenarioId: 'status-not-money' },
      { type: 'callout', title: '¿Aceptado por quién?', body: 'Un canal, la entidad originadora, la infraestructura de pagos y la entidad receptora pueden tomar decisiones diferentes. Nunca uses la palabra aceptado sin identificar actor y etapa.', tone: 'warning' },
    ],
    commonConfusion: [
      { title: 'Estado de procesamiento no es estado del dinero', explanation: 'Un estado de procesamiento y el estado de los fondos están relacionados, pero no constituyen la misma evidencia.' },
    ],
  },
  'pacs-004': {
    title: 'pacs.004 Devolución del Pago',
    subtitle: 'Devolver un pago que ya progresó',
    whyItMatters: 'pacs.004 es central en el manejo de excepciones porque describe una devolución, no un rechazo temprano. Para investigarlo debes identificar el pago original, determinar cuánto progresó y entender por qué el valor regresa.',
    objectives: [
      'Explicar el propósito de pacs.004 como PaymentReturn.',
      'Distinguir una devolución de un rechazo antes de la aceptación.',
      'Rastrear identificadores originales desde pacs.004 hasta pacs.008.',
      'Explicar por qué el disparador y la ventana exactos dependen del esquema.',
    ],
    mentalModel: 'pacs.004 apunta hacia atrás: este nuevo mensaje de devolución debe entenderse en relación con un pago anterior.',
    blocks: [
      { type: 'explanation', heading: 'Una devolución después de que el pago progresó', body: 'pacs.004 (PaymentReturn) lleva un pago de vuelta hacia el lado del deudor original e incluye referencias a la transacción original, monto devuelto y motivo. ISO define el mensaje; el esquema determina cuándo se permite una devolución y qué razones aplican.', badge: 'reference' },
      {
        type: 'lifecycle',
        badge: 'simplified-model',
        stages: [
          { id: 'original', label: 'Pago original', description: 'Una instrucción tipo pacs.008 inicia el pago interbancario.' },
          { id: 'progressed', label: 'Progresó', description: 'El pago pasó el límite de rechazo temprano y continuó.', canFail: 'El límite exacto lo define el esquema.' },
          { id: 'settlement', label: 'Settlement', description: 'El valor puede haberse liquidado entre participantes.', canFail: 'Settlement y crédito al beneficiario siguen siendo distintos.' },
          { id: 'later-problem', label: 'Problema posterior', description: 'Se descubre un problema después de que el pago progresó.', canFail: 'Por ejemplo, puede no ser posible acreditar al beneficiario.' },
          { id: 'returned', label: 'Devuelto', description: 'Una devolución envía el valor o el pago hacia el lado original.' },
        ],
      },
      {
        type: 'prediction',
        context: 'Settlement completado; el posting al beneficiario falla después',
        question: '¿Debe investigarse como rechazo temprano o como devolución?',
        options: [
          { id: 'a', label: 'Rechazo temprano', correct: false },
          { id: 'b', label: 'Devolución, porque el pago ya progresó', correct: true },
        ],
        explanation: 'Un rechazo impide que el pago progrese. Un problema posterior a aceptación o settlement tiene la forma de una devolución; el manejo exacto del esquema todavía debe verificarse.',
      },
      {
        type: 'message-sequence',
        heading: 'Pago original y devolución posterior',
        steps: [
          { id: 'original-payment', from: 'BANK_A', to: 'BANK_B', label: 'pacs.008', messageId: 'pacs.008', description: 'Transferencia de crédito original.', tone: 'pacs' },
          { id: 'later-event', from: 'BANK_B', to: 'OPERATIONS', label: 'Problema posterior', description: 'Un problema posterior a la aceptación requiere manejo de excepción.', tone: 'neutral' },
          { id: 'return-message', from: 'BANK_B', to: 'BANK_A', label: 'pacs.004', messageId: 'pacs.004', description: 'Devuelve el pago y referencia la transacción original.', tone: 'pacs' },
        ],
      },
      { type: 'trace-original-payment', originalMessageId: 'pacs.008', returnMessageId: 'pacs.004' },
      { type: 'message-inspector', messageId: 'pacs.004', intro: 'Inspecciona OrgnlEndToEndId, monto devuelto, motivo de devolución y original transaction reference.' },
      { type: 'scenario', scenarioId: 'reject-or-return-1' },
      { type: 'callout', title: 'Manejo dependiente del esquema', body: 'No infieras ventanas de devolución, códigos obligatorios, finalidad de settlement ni reglas operativas de reintento usando solamente ISO 20022. Eso pertenece al esquema seleccionado y a la implementación de la institución.', tone: 'warning' },
    ],
    commonConfusion: [
      { title: 'pacs.004 no significa aceptado', explanation: 'pacs.004 es un mensaje de devolución. El estado de aceptación o rechazo es otro concepto, normalmente investigado mediante reportes de estado.' },
    ],
  },
}
