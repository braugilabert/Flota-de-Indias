# Implementación de la Real Cédula en el juego

Fecha de revisión: 25 de agosto de 2026. Este archivo toma como fuente canónica y guía principal [`Real Cédula de la Real Compañía Carrera de Indias.md`](../Real%20C%C3%A9dula%20de%20la%20Real%20Compa%C3%B1%C3%ADa%20Carrera%20de%20Indias.md). El `.docx` se conserva únicamente como original de archivo. Las reformas históricas se aplican simultáneamente, como orden compuesto, por decisión expresa de diseño. El apartado final de anotaciones se considera material experimental y no norma firme.

## Estados

- **Implementado**: existe una decisión o cálculo jugable y deja asiento en el registro.
- **Implementado parcialmente**: está representado, pero no constituye todavía un sistema completo.
- **Simplificado por encargo**: se conserva una representación mínima porque se ha pedido no desarrollar el sistema completo.
- **Experimental**: cifra o idea procedente del último apartado de anotaciones; sirve para balance, no se presenta como dato histórico definitivo.

## Correspondencia por apartados

| Apartado de la Real Cédula | Estado | Implementación jugable actual | Límites declarados |
|---|---|---|---|
| 0. Régimen de navíos sueltos | **Implementado** | Se puede escoger Flota, registro o navío suelto. El suelto carece de avería, seguro y protección automática. Se añaden inscripción ordinaria, navío de asiento, beneficencia y navegación en conserva. El asiento paga doble avería; la conserva no obtiene privilegios; la beneficencia exige aprobación. | Licencias individuales y negociación entre personas se condensan en una elección de despacho. |
| 1. Preparación o despacho | **Implementado** | Ruta, puerto, manifiesto, presupuesto, composición, escoltas, avisos, pertrechos, seguro, revista, certificación y orden de partida. El Escribano registra el despacho. | La carga usa lotes y valores agregados, no cada bulto físico. |
| 2. Avería | **Implementado** | Se calcula por mercante inscrito; financia protección, avisos y auxilios. Cambia según el régimen y se duplica para asiento. Se muestra separada del seguro y del Tributo Real. | Exenciones y devoluciones se resuelven mediante eventos, no con una oficina contable propia. |
| 3. Tributo Real | **Implementado** | Se calcula al despacho y aparece en el libro de costes. Se muestra un desglose de Corona, almojarifazgo, alcabala y palmeo/tonelada sin cobrar dos veces la misma carga agregada. | Las proporciones del desglose son **experimentales** y deberán recalibrarse contra fuentes fiscales específicas. |
| 4. Protección y escolta | **Implementado** | Composición de mercantes, galeones y avisos; mínimos distintos para ida y vuelta; coste de fletamento; formación cerrada, ordinaria o dispersa; auxilio y efectos de cohesión. | La cadena de mando se representa por decisiones del jugador, no por IA separada para cada oficial. |
| 5. Seguros marítimos | **Implementado** | Prima de casco y mercancía, cobertura solo para regímenes admitidos, indemnización ligada a pérdidas registradas y pérdida del derecho por negligencia o mala fe. | No existe todavía un mercado competitivo de aseguradores ni pólizas redactadas libremente. |
| 6. Viaje de ida | **Implementado** | Derrota por tramos, provisiones, demora, casco, velamen, moral, cohesión, información, formaciones, avisos, temporales, conserva, incorporación y combate táctico por línea, protección o evasión. | El combate es táctico por decisiones y valores, no acción naval en tiempo real. |
| 7. Tornaviaje | **Implementado** | Certificación mínima propia, carga americana, carena, reaprovisionamiento, ruta de regreso, Almiranta, formación, incidencias, pérdidas y llegada para liquidación. | La navegación astronómica se abstrae en rutas y sucesos. |
| 8. Participaciones | **Simplificado por encargo** | Aportación al despacho limitada al 50 %, responsabilidad y devolución pactada al liquidar, sin acceso a secretos de ruta. | No se implementa el mercado de participaciones, reventa, cotización ni cartera persistente. |
| 9. Universidad de Mareantes | **Implementado** | Revista obligatoria, certificación de casco/aparejo/composición y examen interactivo sobre escolta, Almiranta y conserva. También aparece en eventos de asistencia y derroteros. | Formación prolongada y carreras profesionales quedan condensadas en examen y certificación. |
| 10. Consulado de Mercaderes | **Simplificado por encargo** | Compra y venta de carga, administración de tesorería, cobro de cargas, financiación y asientos del Escribano. | No se desarrolla el Consulado completo: elecciones, cargos múltiples, deliberación colegiada y administración extensa quedan fuera. |
| 11. Real Audiencia | **Simplificado por encargo** | Un expediente breve usa registro, diligencia, pérdidas y buena fe para resolver reclamaciones al final. | No se desarrolla un sistema judicial completo, recusaciones extensas, apelaciones encadenadas ni procedimiento libre. |
| 12. Miembros de la Compañía | **Implementado parcialmente** | Solicitud de ingreso basada en buena fama/reputación y compromiso de secreto; condición de aspirante o miembro; la membresía habilita la beneficencia. Filtrar secretos reduce riesgo; compartir noticias mejora diplomacia pero eleva amenaza. | Las mayorías y facciones se condensan en requisitos numéricos; no hay asamblea multijugador. |
| 13. Financiación | **Implementado** | Tesorería, avería, Tributo Real, seguro, participaciones simples, presas autorizadas, mercedes de servicio y préstamos particulares limitados con interés y amortización. No se emiten bonos públicos. | Donaciones, cuotas y bienes sin dueño aparecen como sucesos o premios, no como mercados independientes. |
| 14. Reforma, vigencia y derogación | **Implementado como regla de diseño** | La ayuda del juego y los datos normativos declaran activo el compendio 1561–1824. Ninguna reforma se desbloquea por era: todas las normas seleccionadas operan simultáneamente. | No se simulan conflictos jurídicos entre textos; la Real Cédula del proyecto fija la regla compuesta. |
| 15. Anotaciones finales | **Experimental y separado** | Algunas cifras de balance —porcentajes, topes, premios y costes— alimentan el prototipo cuando hacen falta para que exista juego. | No se les atribuye fuerza normativa ni certeza histórica. Deben seguir etiquetadas y revisarse antes de una versión histórica definitiva. |

## Sistemas transversales añadidos

- **Combate naval táctico**: encuentros de combate permiten formar línea, proteger mercantes o evadir; se calculan fuerza propia y enemiga, casco, cohesión y pérdida de carga. Las presas solo producen premio adicional cuando la misión fue autorizada.
- **Servicio estratégico**: comercio, socorro de plazas, defensa de puerto/convoy y presa autorizada generan riesgos y recompensas diferentes.
- **Información, secreto y diplomacia**: la reserva protege la derrota; compartir información con aliados mejora la relación diplomática a cambio de aumentar la amenaza.
- **Pertrechos y defensa**: provisiones, carena, casco, velamen y carga de servicio influyen en la supervivencia y en la merced final.
- **Préstamos particulares**: aportan liquidez limitada al despacho y crean una deuda exigible al liquidar.
- **Fiscalidad legible**: el coste agregado se abre en conceptos visibles, manteniendo separados avería, seguro y fiscalidad.

## Exclusiones solicitadas

Quedan expresamente fuera de esta ampliación: una Real Audiencia completa, un Consulado completo y un mercado de participaciones. Sus representaciones mínimas anteriores se mantienen para que el bucle económico y probatorio no quede roto.

## Archivos donde comprobarlo

- `js/data.js`: normas, reformas, puertos, barcos, mercancías y sucesos.
- `js/engine.js`: certificación, costes, fiscalidad, financiación, riesgo, combate, seguro y liquidación.
- `js/game.js`: flujo jugable, examen, membresía, secreto, misiones y registro del Escribano.
- `docs/REGLAS_COMPENDIADAS.md`: formulación consolidada de las reglas.
- `docs/DISENO.md`: decisiones de diseño y alcance.
