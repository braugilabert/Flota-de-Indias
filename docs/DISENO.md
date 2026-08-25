# Documento de diseño — v0.1

## 1. Concepto

**Real Compañía: Carrera de Indias** es un juego web de estrategia económica,
logística, institucional y naval por turnos. El jugador dirige la preparación y
ejecución de una expedición completa: reúne capital y mercancías, compone el
convoy, obtiene la certificación de la Universidad de Mareantes, cruza el
Atlántico, comercia en América, organiza el tornaviaje y liquida seguros,
participaciones y reclamaciones.

El juego no representa un año histórico aislado ni desbloquea las reformas por
épocas. Su marco es deliberadamente **compendiado**: emplea a la vez las normas,
instituciones y alternativas que la Real Cédula reúne a partir del régimen de
1561, las Ordenanzas de 1564 y las reformas de 1720, 1764, 1765 y 1778. Esa
síntesis es parte de la identidad del proyecto, no un error de cronología.

La pregunta central de cada partida es:

> ¿Cuánto beneficio puede obtener la Real Compañía sin romper la protección
> común, la solvencia de sus fondos ni la confianza que hace posible la flota?

## 2. Fuente y jerarquía de reglas

La fuente canónica del proyecto es
[`Real Cédula de la Real Compañía Carrera de Indias.md`](../Real%20C%C3%A9dula%20de%20la%20Real%20Compa%C3%B1%C3%ADa%20Carrera%20de%20Indias.md).
La copia `.docx` tiene valor de archivo y no gobierna la implementación.

El diseño distingue tres capas:

1. **Norma consolidada:** apartados 0 a 14 de la Real Cédula. Son la guía
   principal para instituciones, obligaciones, excepciones y resolución de
   conflictos.
2. **Convención de prototipo:** cifras o automatizaciones necesarias para poder
   jugar la v0.1. Deben quedar identificadas como decisiones de balance, no
   presentarse como hechos históricos.
3. **Hipótesis de diseño:** apartado 15. Contiene dudas, alternativas,
   contradicciones y propuestas aún verdes. Sirve como banco de pruebas, pero
   ninguna de sus ideas desplaza por sí sola una norma de los apartados 0 a 14.
   Una hipótesis puede activarse en el prototipo únicamente si se identifica de
   forma expresa como parámetro experimental.

Cuando una mecánica se aleje de la letra del documento por legibilidad o por
limitaciones del prototipo, la interfaz debe explicarlo brevemente y esta
documentación debe registrarlo.

## 3. Tipo de juego

- Estrategia y gestión por turnos.
- Una expedición completa por partida.
- Interfaz 2D de navegador, sin dependencias ni servidor.
- Un jugador en la v0.1, actuando como junta de la Real Compañía.
- Sistemas preparados para una futura modalidad semicooperativa, con patrimonio
  privado y tesorería común.
- Resolución naval mediante decisiones y probabilidades visibles; no combate en
  tiempo real.

La v0.1 es una **porción vertical**: debe demostrar que preparar el convoy,
decidir qué riesgos financiar y asumir sus consecuencias ya constituye un juego
interesante.

## 4. Pilares de diseño

### 4.1. Protección común, beneficio particular

La flota reduce riesgos que un navío aislado no puede afrontar, pero tiene un
coste. Avería, escolta, pertrechos, seguros y administración compiten por la
misma tesorería. La ganancia individual nunca debe borrar la necesidad de
mantener solvente la institución.

### 4.2. La preparación determina el viaje

Los eventos no son simples tiradas de azar. La escolta, los avisos, los cañones,
las reparaciones, la ruta, el agente de puerto, el seguro y la certificación
deben modificar de forma comprensible las probabilidades y las pérdidas.

### 4.3. La norma crea decisiones

La Real Cédula no aparece como texto decorativo. Sus reglas producen opciones:
inscribirse o navegar suelto, asegurar o retener capital, pagar una escolta o
compensarla de otro modo, admitir un navío de asiento, financiar mediante
participaciones y aceptar o rechazar una reclamación.

### 4.4. Todo queda registrado

El Escribano convierte las decisiones en un libro de viaje. Inscripción, pagos,
carga, certificación, mandos, incidentes, separación y pérdidas generan
asientos. La Real Audiencia utiliza esos asientos como pruebas.

### 4.5. Compendio histórico simultáneo

Las reformas se manifiestan como sistemas concurrentes:

- el convoy organizado y la autoridad de capitana y almiranta;
- la centralización registral, fiscal y de despacho;
- navíos de registro, avisos y navegación suelta como vías alternativas;
- una red de agentes e información marítima más ágil;
- varios puertos habilitados y dos grandes rutas comerciales;
- instituciones mercantiles, docentes, aseguradoras y judiciales superpuestas.

No hay capítulos cronológicos, tecnologías ni una campaña que sustituya unas
normas por otras.

## 5. Papel del jugador

En la v0.1 el jugador representa de forma agregada a la junta de la Real
Compañía. Decide por el Consulado, la Universidad y los mandos navales. Es una
simplificación consciente para probar el sistema sin exigir varios jugadores.

El juego debe conservar la separación conceptual entre cargos:

| Autoridad | Responsabilidad jugable |
| --- | --- |
| Consulado de Mercaderes | Compra carga, cobra tributos y avería, contrata escolta y gestiona la tesorería. |
| Universidad de Mareantes | Revisa barcos y cargas, certifica la salida y mejora la información de riesgo. |
| Capitán General | Abre la formación y toma la decisión principal en una crisis naval. |
| Almirante | Cierra la formación, vigila rezagados y sustituye al Capitán General. |
| Escribano | Registra hechos y aporta pruebas en seguros y reclamaciones. |
| Tesorero | Consolida cuentas, participaciones, primas, indemnizaciones y saldos. |
| Agente de puerto | Prepara carga, almacena sobrantes e informa sobre mercado y amenazas. |
| Real Audiencia | Resuelve reclamaciones cuando la prueba y la buena fe son discutidas. |

En multijugador estos poderes podrán distribuirse y crear negociación; en la
v0.1 son pestañas o pasos de una misma interfaz.

## 6. Bucle de una partida

```text
Consejo y financiación
        ↓
Despacho y certificación
        ↓
Travesía de ida
        ↓
Comercio y reorganización en América
        ↓
Tornaviaje
        ↓
Liquidación, seguros y Audiencia
        ↓
Resultado y libro histórico
```

### Fase 1 — Consejo y financiación

1. Elegir una de las dos rutas comerciales.
2. Examinar demanda, distancia y riesgo estimado.
3. Comprar o asignar mercancías.
4. Abrir participaciones si la tesorería no basta o se desea trasladar parte del
   riesgo asegurador.
5. Reservar fondos para escolta, avería, tributo, seguro y contingencias.

### Fase 2 — Despacho y certificación

1. Inscribir mercantes y decidir qué barcos actuarán como escolta o aviso.
2. Designar nave capitana, nave almiranta, Capitán General, Almirante y
   Escribano.
3. Dotar cañones y reparaciones mínimas.
4. Pagar las cantidades correspondientes o registrar una exención válida.
5. Contratar seguros opcionales.
6. Solicitar a la Universidad de Mareantes la certificación.
7. Zarpar, corregir deficiencias, posponer o cancelar.

### Fase 3 — Viaje de ida

Cada tramo presenta información parcial y una decisión: conservar la formación,
destacar avisos, variar la ruta, auxiliar un rezagado, afrontar un temporal o
responder a un enemigo. Las decisiones consumen tiempo, pertrechos o cohesión.

### Fase 4 — Comercio americano

1. Vender mercancías según demanda y saturación.
2. Pagar o cobrar el Tributo Real aplicable.
3. Usar al agente para almacenar excedentes y mejorar información.
4. Adquirir carga de retorno.
5. Reparar y reorganizar el convoy.
6. Admitir incorporaciones para el tornaviaje y recaudar la media avería cuando
   proceda.

### Fase 5 — Tornaviaje

Antes de salir se comprueba el mínimo de protección. La flota afronta nuevos
tramos con una carga más valiosa y, normalmente, menos margen para reparar. Si
faltan el Capitán General o el Almirante se aplica la sucesión prevista.

### Fase 6 — Liquidación y Audiencia

1. Vender o valorar la carga retornada.
2. Pagar escolta pendiente y servicios.
3. Resolver primas e indemnizaciones automáticas no controvertidas.
4. Abrir expedientes por pérdidas dudosas, falta de diligencia o fraude.
5. Actualizar participaciones, tesorería, reputación y libro de viaje.
6. Calcular el resultado final.

## 7. Sistemas principales

### 7.1. Modalidades de navegación

El compendio mantiene varias posibilidades simultáneas:

- **Flota inscrita:** núcleo del juego; paga o justifica la avería y recibe
  protección y beneficios colectivos.
- **Navío suelto o de registro:** operación autorizada fuera del convoy; asume
  más riesgo y no recibe automáticamente los beneficios de la Flota.
- **En conserva:** un navío se aproxima al convoy sin quedar inscrito; puede
  beneficiarse de su cercanía, pero no adquiere derechos de avería ni seguro.
- **Navío de asiento:** capitán de otra facción admitido por concesión o doble
  avería.
- **Navío de beneficencia:** capitán meritorio admitido con privilegios y sin
  pago, previa autorización.

La v0.1 muestra estas categorías y simula por completo la flota inscrita. Las
otras se reducen a decisiones o modificadores de evento hasta que exista una
economía multijugador.

### 7.2. Barcos y funciones

- Los **mercantes** aportan capacidad y concentran la carga.
- La **escolta** reduce daño, captura y dispersión; no lleva mercantes en su
  flota personal.
- Los **avisos** mejoran información y pueden cumplir ciertos mínimos de salida.
- La **capitana** abre la formación y concentra el mando de batalla.
- La **almiranta** cierra la formación y protege rezagados.

Capitana y almiranta son funciones asignadas a navíos existentes, no clases de
barco independientes.

### 7.3. Economía institucional

La interfaz separa siempre:

- **Avería:** contribución por pertenecer a la protección colectiva.
- **Tributo Real:** contraprestación por carga reunida por Cargadores o por un
  transporte prestado por Portadores.
- **Seguro marítimo:** contrato voluntario que cubre pérdidas fortuitas
  comprobadas.
- **Participaciones:** capital privado que financia parte de la expedición y
  asume el riesgo definido en el contrato.
- **Tesorería:** fondo común del que salen compras, escolta, préstamos,
  pertrechos e indemnizaciones.

Una pantalla de previsión debe mostrar saldo antes de zarpar, exposición máxima
por seguros y coste de una pérdida grave. El jugador no debería necesitar una
hoja de cálculo externa.

#### Parámetros experimentales de la v0.1

El primer motor usa las siguientes cifras para hacer posible una prueba
cuantitativa. Son convenciones de balance —algunas inspiradas en el apartado
15— y no afirmaciones sobre un único régimen histórico:

| Parámetro | Valor inicial |
| --- | ---: |
| Avería por mercante | 1.200 reales |
| Tributo sobre presupuesto de carga | 10 % |
| Prima del seguro de carga | 8 % |
| Prima del seguro de casco | 1,5 % del valor declarado |
| Indemnización de carga perdida | 75 % |
| Indemnización de casco perdido | 33 % del valor declarado |
| Contrata por escolta | 2.400 reales |
| Contrata por aviso | 1.000 reales |
| Pertrechos por barco | 600 reales |
| Participación máxima | 50 % del presupuesto de carga |
| Retorno pactado al partícipe solvente | capital más 10 % |

Estos valores deben vivir en datos configurables. Las pruebas decidirán si se
mantienen, se sustituyen por los valores ordinarios de los apartados 0 a 14 o
se ofrecen como variantes.

### 7.4. Riesgo, información y diligencia

Cada tramo tiene riesgos base —meteorología, enfermedad, avería, enemigo,
dispersión y mercado— modificados por:

- ruta y estación abstracta;
- número y calidad de escoltas y avisos;
- cañones y reparaciones;
- certificación de la Universidad;
- cohesión de la formación;
- información del agente;
- decisiones anteriores.

El azar decide si ocurre un incidente, pero el jugador debe conocer antes los
factores que lo agravan o mitigan. Una acción temeraria genera una marca de
**falta de diligencia**, relevante para el seguro y la Audiencia.

### 7.5. Mercado y agentes

Las dos rutas de la v0.1 ofrecen perfiles diferentes de demanda y riesgo. Los
precios descienden si se satura un puerto con el mismo producto. Un agente:

- revela una estimación más estrecha del precio;
- reduce la incertidumbre de amenaza cercana;
- permite almacenar una parte de la mercancía no vendida;
- prepara carga para el regreso.

La venta coordinada que aparece en el apartado 15 se reinterpreta como gestión
de saturación, nunca como explotación de un fallo de otro videojuego.

### 7.6. Seguros y prueba

El seguro solo responde por un hecho fortuito cubierto. El libro del Escribano
debe conservar:

- objeto y valor asegurados;
- prima y tramo cubierto;
- revisión de la carga;
- causa de la pérdida;
- situación del barco respecto de la flota;
- posibles marcas de dolo o falta de diligencia.

Si todo coincide, la indemnización es automática. Si hay contradicción, se crea
un expediente para la Real Audiencia.

### 7.7. Real Audiencia

La Audiencia es una fase corta de decisión, no un minijuego jurídico extenso.
Cada expediente presenta hechos registrados, norma aplicable y consecuencias de
estimar o rechazar. La v0.1 abstrae Prior y Cónsules en un panel institucional;
el futuro multijugador aplicará recusación, revisión y votación.

## 8. Condiciones de resultado

La partida termina al cerrar la liquidación del tornaviaje o al producirse una
quiebra irrecuperable.

El resultado combina cinco magnitudes:

1. solvencia final de la tesorería;
2. valor neto retornado a España;
3. supervivencia de mercantes, escoltas y avisos;
4. reputación por diligencia, cumplimiento y auxilios;
5. expedientes y obligaciones pendientes.

Una expedición puede ser comercialmente rentable y, sin embargo, dejar una
Compañía frágil o desacreditada. También puede sufrir pérdidas y considerarse
una defensa institucional digna si salva el convoy y paga correctamente a los
afectados.

## 9. Alcance exacto de la v0.1

### Incluido

- Un viaje completo de ida y vuelta.
- Dos rutas seleccionables.
- Mercantes, escoltas y avisos; asignación de capitana y almiranta.
- Carga, capacidad, cañones, reparaciones y tesorería.
- Avería, Tributo Real, seguro y participaciones en forma jugable.
- Certificación de la Universidad de Mareantes.
- Agente de puerto y saturación de mercado.
- Eventos de travesía condicionados por las decisiones de despacho.
- Mínimo de protección distinto para ida y tornaviaje.
- Libro automático del Escribano.
- Liquidación y al menos un tipo de expediente de la Real Audiencia.
- Resumen final con explicación de ingresos, gastos, pérdidas y reputación.

### Representado de forma simplificada

- El jugador acumula las funciones de todos los cargos.
- El tiempo se divide en fases y tramos, no en días de navegación.
- Los barcos usan estadísticas agregadas, no modelos náuticos detallados.
- La carga usa familias mercantiles, no catálogos históricos exhaustivos.
- Las participaciones se emiten y liquidan dentro de una partida.
- Los navíos sueltos, de asiento, de beneficencia y en conserva aparecen como
  opciones limitadas o eventos.
- Las votaciones se resuelven como requisitos institucionales automáticos.
- La Audiencia ofrece casos prediseñados basados en el registro.

### Fuera de alcance

- Multijugador y economía persistente.
- Combate naval en tiempo real.
- Construcción detallada de navíos y tripulaciones individuales.
- Política internacional completa, conquista de puertos y guerra territorial.
- Mercado abierto entre jugadores y reventa persistente de participaciones.
- Exámenes de ingreso y administración social del clan.
- Simulación de todos los impuestos históricos por separado.

## 10. Decisiones de simplificación

| Decisión v0.1 | Motivo | Conserva de la Real Cédula |
| --- | --- | --- |
| Un jugador representa la junta | Permite probar el bucle sin red ni negociación humana. | Separación visible de Consulado, Universidad, mandos, Escribano y Audiencia. |
| Estadísticas agregadas de barco | Evita convertir el prototipo en simulador naval. | Diferencia mercante, escolta, aviso, capitana y almiranta. |
| Dos rutas | Hace comparables riesgo y rentabilidad. | Pluralidad de destinos y agentes del sistema compendiado. |
| Un Tributo Real principal | Mantiene legibles las cuentas. | Pago por carga de Cargadores o transporte de Portadores. |
| Riesgo por tramos | Produce decisiones breves y trazables. | Ida, escalas, puerto de vuelta y tornaviaje. |
| Participaciones por expedición | Evita una bolsa persistente en la primera versión. | Financiación privada y asunción proporcional de riesgo. |
| Audiencia mediante expedientes | Conecta norma y prueba sin exigir interpretación libre. | Reclamación, diligencia, prueba, recusación y revisión. |

Estas convenciones son revisables mediante pruebas. No alteran la decisión
estructural de usar simultáneamente el compendio de reformas.

## 11. Principios de interfaz

- Mostrar siempre el efecto esperado antes de confirmar un gasto o una salida.
- Separar tesorería, capital invertido, ingresos previstos y exposición por
  indemnizaciones.
- Usar lenguaje de época en títulos y lenguaje moderno y claro en ayudas.
- Explicar por qué la Universidad certifica o rechaza una flota.
- Indicar qué privilegios se pierden al incumplir los mínimos.
- Permitir consultar el libro del Escribano desde todas las fases.
- Cerrar cada fase con un resumen de cambios, no con cifras silenciosas.
- Señalar expresamente las reglas provenientes del apartado 15 que se activen
  algún día como experimentales.

## 12. Datos que conviene separar del código

Para facilitar balance y ampliaciones, deberían definirse como datos:

- rutas, tramos, riesgos y mercados;
- barcos y sus estadísticas;
- mercancías, precios y saturación;
- costes, porcentajes y límites;
- eventos, condiciones y resultados;
- requisitos de certificación;
- reglas de seguro y tipos de expediente;
- textos del libro y ayudas históricas.

El motor debe aplicar reglas; los datos deben describir contenido. Así será
posible probar hipótesis del apartado 15 sin reescribir la aplicación.

## 13. Criterios de aceptación de la v0.1

La porción vertical está completa cuando una persona puede:

1. iniciar una partida sin instrucciones externas;
2. elegir ruta y comprender su riesgo;
3. configurar una flota válida o recibir razones concretas del rechazo;
4. financiar carga, avería, escolta, seguro y participaciones;
5. observar que esas elecciones cambian el resultado de los eventos;
6. comerciar, preparar el tornaviaje y regresar;
7. resolver al menos una pérdida asegurada y una reclamación controvertida;
8. leer una liquidación que cuadre ingresos, gastos e indemnizaciones;
9. distinguir normas consolidadas de hipótesis del apartado 15;
10. volver a jugar y afrontar una combinación materialmente distinta.

## 14. Hoja de ruta

### v0.1 — Porción vertical

Un jugador, dos rutas, una expedición completa, instituciones agregadas y
libro automático.

### v0.2 — Profundidad económica

Más mercancías y puertos, contratos de portadores, préstamos, exenciones
motivadas, almacenamiento persistente y mejor liquidación de participaciones.

### v0.3 — Profundidad naval

Formaciones, meteorología más rica, daños por subsistemas, capturas, presas,
auxilios y barcos prestados.

### v0.4 — Instituciones

Cargos separados, votaciones, recusaciones, revisión de sentencias, ingreso y
reputación institucional. Activación opcional y documentada de hipótesis
seleccionadas del apartado 15.

### v0.5 — Semicooperativo

Dos a cuatro jugadores con patrimonios propios, tesorería común, contratos,
información asimétrica y objetivos compatibles pero no idénticos.

### v1.0 — Compañía persistente

Campañas de varias expediciones sin progresión cronológica de reformas: todo el
compendio continúa disponible simultáneamente. Se añaden mercado entre
jugadores, participaciones persistentes, diplomacia, asientos, navíos sueltos
completos y administración de puertos.

## 15. Preguntas de balance para las pruebas

- ¿Pagar la avería es una decisión interesante o un trámite siempre óptimo?
- ¿Los avisos compiten de verdad con una segunda escolta?
- ¿El seguro protege sin eliminar el miedo a una pérdida?
- ¿Las participaciones financian decisiones nuevas o solo añaden contabilidad?
- ¿La información del agente cambia qué y cuándo se vende?
- ¿Una salida no certificada resulta posible pero claramente peligrosa?
- ¿El libro permite entender por qué una reclamación prospera o fracasa?
- ¿Las dos rutas producen estilos de preparación diferentes?
- ¿Tesorería, reputación y retorno generan dilemas o premian exactamente la
  misma estrategia?
