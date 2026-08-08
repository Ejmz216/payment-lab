// Spanish translations for Fast Payments Path lessons.
// Keyed by lesson id; only translatable prose fields are provided here.
// keyTerms are intentionally left untranslated (ISO 20022 role/field names
// are used internationally in English in real documentation and conversation).
import type { LessonBlock } from '@/types/blocks'

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
}
