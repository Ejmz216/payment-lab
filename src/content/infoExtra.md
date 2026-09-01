## Preguntas para validación – Comparativa Barbados vs. Bahamas

### 1. Procesamiento BULK

En Barbados ya están definidos los modos de procesamiento **INST, BULK y BULK Legacy**, incluyendo flujos e interfaces específicas para pagos masivos. Para Bahamas, la documentación pública indica que el procesamiento BULK no es obligatorio para la implementación inicial y que podría incorporarse posteriormente por fases. Considerando que ambas soluciones utilizan tecnología de Montran, ¿se ha decidido incorporar en Bahamas el mismo modelo de BULK utilizado en Barbados en una fase posterior, o esta funcionalidad continúa fuera del alcance confirmado?

En caso de incorporarse BULK, ¿el FPS de Bahamas recibirá directamente archivos o solicitudes masivas y realizará el **de-bulking** centralmente, o serán los participantes quienes deberán separar el lote y enviar cada transacción individualmente al FPS?

¿Se reutilizarán en Bahamas las mismas interfaces, APIs o endpoints específicos de BULK definidos para Barbados, o Bahamas contará con interfaces diferentes?

En caso de habilitarse BULK, ¿su alcance incluirá únicamente pagos o también otros servicios como **Request to Pay**?

¿Está contemplado para Bahamas un modelo equivalente a **BULK Legacy**, o los mecanismos batch/legacy permanecerán exclusivamente en la infraestructura ACH existente?

---

### 2. Digital Wallet

Barbados implementó una **BiMPay e-Wallet** asociada directamente al sistema de pagos instantáneos. En Bahamas ya existe el ecosistema de **SandDollar wallets** y la documentación pública del FPS no exige una nueva aplicación móvil centralizada. ¿Debemos entender entonces que Bahamas no reutilizará el modelo completo de Digital Wallet de Barbados y que la experiencia del usuario continuará principalmente en las aplicaciones de los participantes y en las wallets de SandDollar?

¿Existe intención de reutilizar componentes de la Digital Wallet de Barbados, como **linked accounts, balance inquiry, tokenización, external onboarding o account validation**, dentro de la solución de Bahamas, o estas funciones permanecerán bajo responsabilidad de las instituciones financieras y del ecosistema SandDollar?

Para el **go-live**, entendemos que se espera interoperabilidad entre cuentas FPS y SandDollar wallets, así como soporte para QR estático y dinámico, mientras que otras capacidades pueden implementarse posteriormente. ¿Qué funcionalidades específicas relacionadas con wallet estarán incluidas desde el lanzamiento?

En particular, ¿estarán incluidos desde go-live **account linking, balance inquiry, external onboarding, Cash In, Cash Out, Request Funds y NFC**, o cuáles de estas capacidades quedarán para fases posteriores?

Si Bahamas utiliza mecanismos similares al **BiMPay Token** de Barbados para vincular o autorizar cuentas, ¿quién será responsable de generar, validar y administrar dichos tokens: el FPS, el participante o SandDollar?

---

### 3. Dispute Management

Barbados dispone de un módulo completo de **Dispute Management**, con creación y seguimiento de casos, propuestas, documentos, correspondencia, matrices de escalamiento, alertas, reportes y cierre. Bahamas exige capacidades de dispute y refund, pero la documentación pública actual no define con el mismo nivel de detalle el workflow. ¿Bahamas reutilizará el mismo modelo de Dispute Management implementado para Barbados o se definirá un ciclo específico para Bahamas?

¿Sobre qué estados de una transacción será posible iniciar una disputa? Por ejemplo, ¿únicamente sobre pagos completados o también sobre transacciones en otros estados?

¿Se reutilizarán las mismas capacidades de Barbados para **propuestas, documentos, correspondencia, matrices de escalamiento, alertas y reglas de cierre**, o habrá diferencias para Bahamas?

Cuando una disputa sea resuelta, ¿el sistema podrá generar automáticamente una transacción de **refund, return, compensation o recovery**, o será necesario que el participante inicie manualmente la transacción financiera correspondiente?

¿Los participantes gestionarán las disputas únicamente desde el **portal central** del FPS o existirán también APIs o mensajes para integrar los sistemas internos de dispute management de cada institución?

¿Qué **SLA, tiempos de escalamiento y tiempos máximos de resolución** estarán definidos para cada tipo de disputa?

¿Qué reportes específicos de disputas estarán disponibles para los participantes y para el Banco Central?

---

### 4. Request to Pay

Barbados diferencia entre **Normal Request to Pay, Fast Request to Pay y variantes basadas en mandato**, con reglas y tiempos de respuesta distintos. En Bahamas se contempla Request to Pay mediante los mensajes correspondientes de ISO 20022, pero la documentación pública no detalla las mismas variantes. ¿Bahamas adoptará las mismas modalidades de Request to Pay utilizadas en Barbados o manejará inicialmente un único flujo?

¿Bahamas tendrá tanto **Normal Request to Pay como Fast Request to Pay** desde el go-live?

En caso de existir ambas variantes, ¿cuáles serán los **tiempos máximos de respuesta** para aceptar, rechazar o dejar expirar una solicitud?

¿Fast Request to Pay estará limitado exclusivamente a transacciones individuales, como ocurre en Barbados?

Si BULK se incorpora posteriormente, ¿Normal Request to Pay podrá utilizar también procesamiento BULK?

Los pagos recurrentes, suscripciones y mecanismos de mandato no forman parte obligatoria de la implementación inicial según la documentación pública. ¿Debemos entender entonces que **Mandate-based Request to Pay** quedará para una fase posterior?

Cuando se implemente Request to Pay basado en mandato, ¿quién será responsable de validar que exista un mandato válido antes de ejecutar el pago: el FPS, el banco pagador, el banco receptor o un componente central de Mandate Management?

¿Qué variantes concretas de Request to Pay están confirmadas para el **go-live**?

---

### 5. Settlement y Prefunding

La documentación de Bahamas plantea como opción preferida un modelo de **real-time settlement utilizando cuentas técnicas prefunded dentro del FPS**. ¿Este modelo quedó confirmado en el diseño finalmente seleccionado para la implementación con Montran o fue modificado durante la fase de diseño posterior al RFP?

¿Cada pago será liquidado individualmente en tiempo real dentro del FPS o existirán también procesos periódicos de net settlement o settlement por ciclos para determinadas operaciones?

¿Qué cuentas utilizarán los participantes para mantener la liquidez del FPS y cómo será la relación entre estas cuentas y **BISS/RTGS**?

---

### 6. Liquidity Management

¿Cómo funcionarán los **liquidity top-ups y withdrawals** entre BISS/RTGS y las cuentas prefunded del FPS?

Dado que el FPS operará 24/7 mientras BISS/RTGS puede tener una ventana operativa más limitada, ¿cómo se manejarán las necesidades de liquidez fuera del horario del RTGS?

¿Los participantes deberán mantener suficiente liquidez antes del cierre de BISS/RTGS o existirán mecanismos adicionales, como ventanas extraordinarias, líneas de liquidez, reservas adicionales o mecanismos stand-in?

¿Existirán **sesiones específicas de ajuste de liquidez**, similares a las definidas para Barbados, o los participantes podrán ajustar sus posiciones en cualquier momento durante el horario de disponibilidad del RTGS?

¿Los participantes recibirán alertas cuando sus posiciones de liquidez alcancen determinados umbrales mínimos o máximos?

---

### 7. Reconciliación y mensajes CAMT

Bahamas contempla los mensajes **camt.052, camt.053 y camt.054** para account reporting. ¿Cuál será la estrategia específica de uso de estos mensajes dentro del FPS?

¿Qué evento o frecuencia generará cada uno de estos mensajes?

En particular, ¿el **camt.053** se emitirá únicamente como estado de cuenta de cierre diario o podrá generarse también para otros periodos o ciclos definidos?

¿Los participantes utilizarán principalmente los mensajes CAMT para reconciliación, reportes descargables desde el portal o se espera utilizar ambos mecanismos?

¿Existirá un proceso formal de **End-of-Day reconciliation** similar al de Barbados aunque los pagos sean liquidados individualmente en tiempo real?

¿Cómo se manejarán las diferencias detectadas entre las posiciones internas del participante y las posiciones registradas por el FPS?

---

### 8. Reporting

La documentación de Bahamas ya contempla capacidades generales de reporting, dashboards, participant statements, activity reports, message-flow reports, compliance reporting y exportación de información. ¿Qué reportes específicos de Barbados se reutilizarán en Bahamas y cuáles serán diseñados específicamente para el nuevo FPS?

¿Los participantes recibirán reportes de **posición y liquidez intradía** además de los mensajes CAMT?

¿Existirán reportes específicos de **reconciliación, settlement y end-of-day positions**?

¿Se incluirán desde go-live reportes específicos de **connectivity, security, user access, disputes y operational incidents**?

¿Los participantes podrán consultar estos reportes únicamente mediante el portal central o también recibirlos de forma automática mediante APIs, archivos o mensajería?

---

### 9. Billing

Bahamas contempla capacidades de billing e invoicing dentro de la solución. ¿Se reutilizará el mismo modelo de facturación definido para Barbados o se establecerán reglas específicas para Bahamas?

¿Qué eventos serán facturables: transacciones procesadas, Request to Pay, consultas, participantes, servicios adicionales u otros?

¿La facturación se realizará por transacción, por volumen, por periodo o mediante una combinación de modelos?

¿Los participantes recibirán reportes detallados que permitan reconciliar las facturas contra las transacciones procesadas por el FPS?

---

### 10. Pregunta transversal de arquitectura

Considerando que **Barbados y Bahamas utilizan Montran**, ¿qué componentes de la solución de Barbados están previstos para ser reutilizados directamente en Bahamas, cuáles serán adaptados a las necesidades locales y cuáles se implementarán como componentes completamente diferentes?

En particular, sería útil confirmar esta clasificación para **BULK, Digital Wallet, Request to Pay, Dispute Management, Settlement, Liquidity Management, Reconciliation, Reporting y Billing**.

Finalmente, ¿existe actualmente una matriz de alcance o roadmap que permita distinguir claramente entre funcionalidades de **go-live, fases posteriores y funcionalidades opcionales** para Bahamas?




________________________

BULK:
“En Barbados tenemos definidos INST, BULK y BULK Legacy. En Bahamas sabemos que BULK no era obligatorio para la implementación inicial. ¿Ya se definió si Bahamas reutilizará el modelo BULK de Barbados, ya sea para go-live o para una fase posterior?”
Digital Wallet:
“Barbados tiene BiMPay e-Wallet, mientras que Bahamas ya tiene el ecosistema SandDollar. ¿Bahamas reutilizará el modelo de Digital Wallet de Barbados o la experiencia seguirá principalmente en las apps de los participantes y las wallets SandDollar?”
Dispute Management:
“Barbados tiene un ciclo de Dispute Management bastante completo. ¿Bahamas reutilizará ese mismo modelo o se está definiendo un workflow específico?”
Request to Pay:
“Barbados diferencia Normal, Fast y Mandate-based Request to Pay. ¿Bahamas utilizará esas mismas variantes o el alcance inicial será diferente?”
Settlement / Liquidity / Reconciliation / Reporting:
“Barbados tiene un modelo bastante detallado de prefunding, ajustes de liquidez, conciliación y reporting. ¿Bahamas reutilizará ese modelo como base o estos procesos se están definiendo específicamente para Bahamas?”

