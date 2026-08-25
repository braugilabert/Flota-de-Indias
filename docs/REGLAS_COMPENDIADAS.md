# Reglas compendiadas del prototipo

## 1. Naturaleza del compendio

Estas reglas convierten en un sistema jugable los apartados 0 a 14 de la
**Real Cédula de la Real Compañía Carrera de Indias**. Por decisión de diseño,
las disposiciones inspiradas en 1561, 1564, 1720, 1764, 1765 y 1778 rigen
**simultáneamente**.

La autoridad documental corresponde a
[`Real Cédula de la Real Compañía Carrera de Indias.md`](../Real%20C%C3%A9dula%20de%20la%20Real%20Compa%C3%B1%C3%ADa%20Carrera%20de%20Indias.md),
que es la guía canónica del juego. El `.docx` queda como original archivado.

Por tanto:

- no hay eras, capítulos cronológicos ni desbloqueo de reformas;
- el convoy no queda sustituido por los navíos de registro;
- la apertura de puertos no elimina el despacho, la avería ni las instituciones;
- avisos, agentes, registros, flotas y navegación suelta son opciones
  concurrentes dentro de un único orden compuesto;
- cuando dos prácticas históricas tuvieron funciones sucesivas, el juego las
  convierte en alternativas con costes, permisos y riesgos distintos.

El objetivo es respetar la Real Cédula como constitución interna del juego, no
reconstruir literalmente la legislación vigente en una fecha concreta.

## 2. Autoridad de las reglas

La prioridad es:

1. reglas consolidadas de los apartados 0 a 14;
2. reglas de implementación de la v0.1 indicadas en este documento;
3. ninguna idea del apartado 15, salvo que aparezca expresamente marcada como
   **regla experimental**.

El apartado 15 es un cuaderno de trabajo. Sus propuestas sirven para diseñar
pruebas y pueden contradecirse entre sí. No tienen aplicación automática: las
únicas excepciones de la v0.1 son los parámetros que la tabla siguiente marca
expresamente como experimentales.

### 2.1. Parámetros activos de la v0.1

| Parámetro del motor | Valor | Condición |
| --- | ---: | --- |
| Avería | 1.200 reales por mercante | Convención de prototipo |
| Tributo Real | 10 % del presupuesto de carga | Valor supletorio consolidado, aplicado de forma agregada |
| Prima de carga | 8 % del presupuesto de carga | Experimental |
| Prima de casco | 1,5 % del valor declarado | Experimental |
| Cobertura de carga perdida | 75 % | Experimental |
| Cobertura de casco perdido | 33 % del valor declarado | Experimental; hipótesis del apartado 15 |
| Contrata de escolta | 2.400 reales por barco | Convención de prototipo |
| Contrata de aviso | 1.000 reales por barco | Convención de prototipo |
| Pertrechos | 600 reales por barco | Convención de prototipo |
| Máximo de participaciones | 50 % del presupuesto de carga | Experimental |
| Obligación con partícipes | capital aceptado más 10 % | Experimental; solo se paga hasta el activo disponible |

Estas cifras permiten probar la economía, no reforman la Real Cédula. Si el
motor y una regla cualitativa entran en tensión, la interfaz debe presentar la
cifra como variante de v0.1 y el resultado de las pruebas decidirá su destino.

## 3. Objetivo y final de partida

El jugador debe despachar una expedición, alcanzar un puerto americano,
comerciar y completar el tornaviaje conservando la solvencia de la Real
Compañía.

La partida termina:

- al liquidarse el viaje de regreso; o
- si la Compañía no puede pagar una obligación exigible ni continuar la
  expedición.

La evaluación final considera tesorería, valor retornado, barcos supervivientes,
reputación y reclamaciones pendientes. No basta con maximizar dinero si se deja
insolvente o desacreditada la institución.

## 4. Conceptos básicos

| Concepto | Significado en el juego |
| --- | --- |
| Flota de Indias | Convoy formalmente inscrito, mandado, financiado y registrado. |
| Flota personal | Conjunto de barcos bajo un capitán o propietario. |
| Mercante | Barco cuya función principal es transportar carga. |
| Escolta | Barco de guerra contratado para defender el convoy. |
| Aviso | Barco ligero que obtiene información y detecta amenazas. |
| Capitana | Nave que abre la formación y cuyo capitán ejerce de Capitán General. |
| Almiranta | Nave que cierra la formación y cuyo capitán ejerce de Almirante. |
| Avería | Contribución por la protección y recursos colectivos de la Flota. |
| Tributo Real | Pago por recibir carga reunida o por encargar su transporte. |
| Prima | Precio de un seguro marítimo. |
| Participación | Aportación privada que financia la expedición y asume el riesgo pactado. |
| Cargador | Persona o institución que reúne carga para entregarla a un capitán. |
| Portador | Capitán contratado para transportar carga ajena. |
| Agente de puerto | Cargador local que además almacena e informa. |
| Diligencia | Conducta razonable exigida para conservar derechos e indemnizaciones. |
| Tramo | Unidad abstracta de navegación entre dos decisiones. |

## 5. Formas simultáneas de navegar

### 5.1. Flota inscrita

Un mercante inscrito paga la avería correspondiente o acredita una exención.
Desde el amarre de salida hasta el amarre de regreso recibe los beneficios
colectivos, incluidos los puertos de escala o aguada previstos o imprevistos.

### 5.2. Navío suelto o de registro

Opera fuera del régimen ordinario de la Flota. No puede reclamar sus privilegios
por el mero uso de información de la Compañía. Un registro o permiso expreso
puede autorizar una ruta independiente y fijar sus condiciones.

En la v0.1 esta modalidad se representa mediante una decisión especial o un
evento comparativo; la simulación económica completa queda reservada para una
versión posterior.

### 5.3. Navegación en conserva

Un navío español no inscrito puede aproximarse y navegar junto al convoy. No se
convierte por ello en miembro de la Flota ni recibe iguales derechos de avería,
reparación, escolta o indemnización.

### 5.4. Navío de asiento

Un capitán de otra facción puede ser admitido por concesión de la Compañía o por
el pago del doble de la avería ordinaria. La admisión no le concede acceso a
información que no necesite para navegar.

### 5.5. Navío de beneficencia

Un capitán meritorio de la facción puede recibir los privilegios de la avería
sin pagarla si obtiene mayoría simple de los miembros presentes.

## 6. Secuencia de juego

Una partida sigue cuatro estaciones obligatorias y un cierre contable:

1. **Primavera:** consejo, financiación, despacho y salida.
2. **Verano:** travesía de ida.
3. **Otoño:** comercio y preparación americana.
4. **Invierno:** invernada, concentración y apresto; el tornaviaje comienza al
   abrirse la primavera siguiente.

La liquidación y la Real Audiencia cierran el ciclo, pero no constituyen una
quinta estación.

El calendario visible distingue la salida histórica de mayo para Nueva España
y la de agosto para Tierra Firme. El modelo estacional resume fechas variables:
ambas rutas invernan en Indias y preparan la concentración en La Habana para el
regreso desde marzo.

No se puede volver a una estación cerrada salvo que una carta o decisión lo diga
expresamente. Toda transacción confirmada genera un asiento del Escribano.

## 7. Consejo y financiación

### 7.1. Elección de ruta

El jugador elige una de las dos rutas disponibles. Cada una informa de:

- distancia o número de tramos;
- intervalo estimado de amenaza;
- mercados de ida y de retorno;
- agente disponible;
- requisitos o costes particulares.

La elección no activa una época histórica diferente: ambas rutas pertenecen al
mismo compendio normativo.

#### 7.1.1. Puerto de despacho

Todo jugador empieza como mercader y escoge una de estas cabeceras:

- **Cádiz:** salida oceánica y apresto naval más eficientes; descuenta 800
  reales del despacho, no añade demora y concede 6 puntos de información.
- **Sevilla y Sanlúcar:** su red mercantil aumenta un 6 % el valor efectivo de
  la carga, pero la navegación del Guadalquivir y la barra añaden 2 jornadas;
  concede 2 puntos de información.

Los valores son convenciones de balance inspiradas en la función histórica de
ambos puertos, no porcentajes documentales.

### 7.2. Orden de financiación

La expedición puede financiarse mediante:

1. tesorería de la Compañía;
2. capital o trabajo de Cargadores;
3. aportaciones de entidades aliadas;
4. préstamos particulares limitados;
5. participaciones de la expedición.

También ingresan en la Compañía avería, Tributo Real, sobrantes lícitos de
seguros, donaciones, bienes sin dueño o capturados, resoluciones de la Audiencia,
intereses y cuotas válidamente acordadas.

La Compañía no emite bonos de deuda ni se apoya en endeudamiento ilimitado.

### 7.3. Participaciones

Las participaciones financian parte de la expedición y trasladan a los partícipes
la fracción de riesgo asegurador indicada al emitirlas.

- El total emitido no puede superar la exposición asegurable definida para la
  expedición.
- Un capitán de la Flota puede ser también partícipe.
- Los partícipes no adquieren por ello derecho a conocer ruta, fecha o secretos.
- Las transmisiones deben quedar registradas por el Tesorero.
- Los nombres representativos o testaferros no alteran el límite económico ni la
  responsabilidad de la participación.
- Beneficios y pérdidas modifican el valor liquidable según el contrato visible
  al comienzo de la partida.

**Convención v0.1:** las participaciones nacen y se liquidan dentro de una sola
partida. No existe aún mercado secundario persistente.

## 8. Despacho de la Flota

Antes de zarpar deben completarse, en este orden, las siguientes operaciones:

1. inscribir los mercantes;
2. declarar propietario, carga y función de cada barco;
3. nombrar Capitán General, Almirante y Escribano;
4. asignar capitana y almiranta;
5. contratar o asignar escoltas y avisos;
6. cargar cañones y reparaciones mínimas;
7. recaudar avería y Tributo Real, o registrar exenciones;
8. contratar los seguros voluntarios;
9. revisar barcos y cargas;
10. solicitar certificación de la Universidad de Mareantes.

Todo barco principal y todo barco de una flota personal debe llevar cañones. El
barco principal lleva además reparaciones para casco, velas y mástiles.

La salida puede posponerse o cancelarse si no existen condiciones razonables de
seguridad. Zarpar sin certificación es posible únicamente cuando la interfaz lo
permita expresamente, deja constancia de falta de diligencia y puede invalidar
derechos posteriores.

## 9. Avería

### 9.1. Devengo

Paga avería el capitán que inscribe un mercante cargado en la Flota, salvo
acuerdo o exención válidos. La cantidad se determina por mercante, no por barco
de escolta o aviso.

Se paga antes de la salida. Quien se incorpora más tarde paga antes de recibir
protección, incluso en alta mar o en un puerto de escala si la incorporación
ocurre durante el retorno.

### 9.2. Beneficios

La avería financia y da derecho a:

- protección por el resto de la Flota;
- dotación mínima de reparaciones y cañones cuando sea necesaria;
- barcos prestados que deberán devolverse al terminar;
- pago de escoltas y otras fuerzas destinadas al éxito del convoy;
- cobertura institucional durante ida, escalas y vuelta.

Suprimir el pago supone perder estos beneficios, salvo exención expresa.

### 9.3. División por trayecto

La avería se divide en mitad de ida y mitad de vuelta.

- Quien solo participa en una mitad paga esa mitad.
- Quien participa únicamente en parte de ida o parte de vuelta paga la mitad del
  trayecto correspondiente según la convención visible de la partida.
- Si el capitán pagó y finalmente no participa, el importe se devuelve o se
  conserva para la siguiente expedición.
- Si pierde todos los barcos antes del tornaviaje, se devuelve la parte de
  vuelta.

**Convención v0.1:** como no hay campaña persistente, todo crédito guardado para
la siguiente expedición se devuelve en la liquidación.

### 9.4. Exenciones

Puede concederse exención por préstamo de barcos, proeza anterior, información
providencial, colaboración importante en el despacho, aportación de
reparaciones, servicio como agente, trabajo extraordinario del Consulado o la
Universidad, mando de capitana o almiranta, escolta no pagada, pérdida total en
la expedición anterior o incorporación con barcos de guerra.

Toda exención debe identificar causa, autoridad y expedición. En la v0.1 solo
aparecen las causas que el motor pueda verificar automáticamente.

## 10. Tributo Real

### 10.1. Carga de los Cargadores

El capitán que recibe mercancía reunida por un Cargador paga:

- el coste de compra de la carga; más
- el porcentaje acordado del beneficio previsto.

Si el beneficio no puede concretarse, se añade por defecto el 10 % del coste de
compra. El pago corresponde al Cargador que entrega la mercancía y queda
registrado por el Tesorero.

### 10.2. Transporte por Portadores

Quien encarga a un Portador el transporte de mercancía paga el porcentaje
acordado del beneficio previsto. Si no puede concretarse, se aplica por defecto
el 10 % del coste de compra.

### 10.3. Cargador Particular

El capitán que compra y carga su propia mercancía es Cargador Particular y no
paga Tributo Real por esa misma entrega. Sí conserva las demás obligaciones,
incluidas revisión, avería y seguro cuando procedan.

**Convención v0.1:** el juego muestra por separado coste de mercancía y recargo
del Tributo Real, aunque los liquide en una sola confirmación.

## 11. Escolta

- La compensación se acuerda antes de zarpar y puede pagarse antes o después del
  arribo.
- Puede consistir en reales, doblones, mercancías, reparaciones, exención futura
  de avería o una mezcla.
- Puede fijarse como cantidad total o por mercante que llegue a destino.
- Una escolta no pagada obtiene la exención de avería prevista para una
  expedición futura.
- Un capitán de escolta puede cargar mercancías en sus barcos de guerra, pero no
  llevar mercantes en su flota personal.
- Puede haber escoltas diferentes para ida y retorno.
- La escolta puede ser extranjera.
- Siempre que sea posible navega a barlovento para acudir al socorro.
- Las presas pertenecen a quien determine la escolta, excepto barcos recuperados
  de la propia Flota, que vuelven a sus propietarios.
- No se paga escolta si el encuentro fue provocado dolosamente o si se incumplió
  el deber de diligencia.

**Convención v0.1:** dinero, mercancías y reparaciones se convierten a una unidad
común de valor para la liquidación. La exención futura se devuelve como crédito
al final, pues aún no hay campaña persistente.

## 12. Seguros marítimos

### 12.1. Reglas comunes

El seguro es voluntario y se contrata antes de zarpar. Una incorporación tardía
puede contratarlo al incorporarse o en el puerto de vuelta.

- Puede cubrir ida, vuelta o ambas; un solo trayecto cuesta la mitad.
- Si el capitán no participa, la prima se devuelve o queda como crédito.
- Se asegura toda la categoría declarada de la flota personal o ninguna; no se
  eligen arbitrariamente solo los barcos de mayor riesgo.
- Solo responde por pérdida fortuita y no provocada.
- Dolo o falta de diligencia eliminan la indemnización afectada.
- Separarse de la formación no es fraude automático, pero puede constituir falta
  de diligencia según causa y prueba.

### 12.2. Seguro de mercancías

- Cubre el valor de compra de la carga asegurada.
- La indemnización se paga en dinero o, si falta, con mercancía equivalente.
- La prima acordada se calcula sobre coste o beneficio previsto.
- En la norma consolidada, a falta de acuerdo, la prima es el 10 % del coste de
  compra.
- La carga de un Cargador Particular debe ser revisada por la Universidad.
- La carga entregada por un Cargador Real se considera revisada al entregarse.

**Parámetro experimental v0.1:** el motor cobra el 8 % y cubre el 75 % de la
pérdida. La interfaz y la liquidación deben identificar esta variante.

### 12.3. Seguro de barcos

- Cubre hundimiento y captura.
- Solo se aseguran barcos construidos, comprados o capturados por su capitán.
- No se aseguran barcos prestados ni adquiridos por el Almirantazgo.
- La prima fija por tipo equivale al 10 % de la indemnización pactada.
- Los barcos de escolta no se aseguran como si fueran navíos ajenos al servicio
  contratado.

**Parámetro experimental v0.1:** se cobra el 1,5 % del valor declarado y se
indemniza el 33 % cuando existe pérdida computable. Esta cobertura parcial toma
como hipótesis el apartado 15 y no se considera norma cerrada.

### 12.4. Orden de reclamación

1. comprobar póliza y pago;
2. comprobar objeto y tramo asegurados;
3. consultar revisión de carga y asiento de salida;
4. identificar causa de la pérdida;
5. revisar marcas de dolo o diligencia;
6. pagar automáticamente o abrir expediente de Audiencia.

## 13. Composición y viaje de ida

La Flota incluye mercantes, escoltas, avisos, capitana y almiranta.

- La capitana abre la formación y su capitán es el Capitán General.
- La almiranta cierra la formación y su capitán es el Almirante, segundo al
  mando.
- Capitana y almiranta pueden ser mercantes o barcos de guerra si cumplen los
  requisitos.
- El nombre del Capitán General da nombre a la expedición en el libro histórico.

Para el viaje de ida se requieren al menos:

- dos barcos de escolta; o
- en su defecto, dos avisos que apoyen a los mercantes.

La capitana y la almiranta pueden ser los únicos barcos de escolta si ambas
cumplen esa función.

En cada tramo el jugador elige una respuesta a la situación presentada. Mantener
formación mejora la protección; destacar avisos mejora información; auxiliar
consume tiempo o reparaciones; perseguir al enemigo puede comprometer el deber
de escolta.

## 14. Agentes y comercio en puerto

Un agente de puerto puede:

- entregar la carga reunida para la siguiente etapa;
- almacenar mercancía que el mercado no absorba;
- avisar de movimientos enemigos;
- ayudar a estimar precios y saturación.

El agente que entrega carga recibe el mismo tratamiento básico que un Cargador.
Solo conoce la información mínima necesaria, especialmente si pertenece a otra
facción.

**Convención v0.1:** cada producto tiene demanda limitada. Vender por encima de
ella reduce su precio marginal. El jugador puede vender, almacenar o reservar
carga para evitar saturación. No existe ninguna mecánica basada en aprovechar un
fallo de mercado externo.

## 15. Tornaviaje

El retorno no puede comenzar sin:

- al menos un barco de escolta; o
- dos avisos.

Si la Flota zarpa sin ese mínimo, pierde para ese trayecto los privilegios de la
avería y los seguros marítimos. La interfaz debe advertirlo antes de confirmar.

Además:

- si falta el Almirante, se nombra otro antes de salir;
- si falta el Capitán General, el Almirante asume el primer mando;
- los Cargadores o agentes de destino reciben el Tributo Real aplicable a la
  carga de vuelta;
- quien se incorpora para regresar puede pagar media avería y adquirir sus
  privilegios;
- salvo estas diferencias, rigen las reglas del viaje de ida.

## 16. Universidad de Mareantes

La Universidad enseña, revisa y certifica. En la v0.1 realiza cuatro controles:

1. capacidad mínima de los capitanes, abstraída como preparación;
2. aptitud de barcos, cañones y reparaciones;
3. revisión de las cargas que deban asegurarse;
4. suficiencia razonable de la formación y la ruta.

También puede proporcionar información de trayecto, coordinar asistencia y
localizar barcos prestados.

La certificación no garantiza el éxito: confirma que la expedición satisface el
umbral de diligencia conocido al zarpar.

## 17. Consulado de Mercaderes

El Consulado:

- compra y reparte mercancías;
- administra reparaciones y cañones mínimos;
- organiza escoltas, patrullas, guardacostas o corsarios contratados;
- cobra avería, Tributo Real y primas;
- explora acuerdos comerciales o de protección;
- custodia secretos y la integridad económica de la Flota.

El Tesorero consolida las cuentas y el historial. Los Cargadores Reales reúnen,
entregan y certifican carga. Los Mercaderes del Consulado votan las decisiones
que la Real Cédula reserva a la institución.

**Convención v0.1:** el jugador ejerce todos estos cargos, pero la interfaz
identifica qué órgano autoriza cada acción.

## 18. Real Audiencia

La Audiencia interviene cuando comerciantes no resuelven un conflicto o cuando
una reclamación de avería o seguro no puede decidirse automáticamente.

### 18.1. Prueba

Se consideran, por este orden:

1. asientos del Escribano;
2. póliza, pagos y revisión de carga;
3. decisiones registradas durante el viaje;
4. testimonios o informes de agentes y revisores;
5. norma aplicable y deber de diligencia.

### 18.2. Tribunal

El modelo completo usa dos Cónsules y un Prior. Las decisiones de los Cónsules
pueden ser revisadas por el Prior y las del Prior por el Consulado.

- Una persona implicada en la expedición se recusa del conflicto relacionado.
- Si no hay tribunal puede aplazarse el caso.
- Si no puede aplazarse, decide un tribunal excepcional de miembros presentes.
- Las partes pueden recibir ayuda de abogados.
- Las vistas pueden ser públicas.

**Convención v0.1:** un panel presenta pruebas y dos o tres resoluciones
motivadas. La composición humana del tribunal llegará con el multijugador.

### 18.3. Fraude probado

Cuando se descubre robo, fraude, engaño o incumplimiento sancionable, el dinero
que corresponda repartir se distribuye según la regla de la Real Cédula: mitad
para quien lo descubre, cuarta parte para el tribunal y cuarta parte para el
Consulado.

## 19. Miembros, reputación y secreto

Son miembros de la Real Compañía quienes forman parte de la Universidad, el
Consulado o la Real Audiencia. Agentes, Portadores, Cargadores Particulares,
capitanes de una Flota y mandos navales no se convierten en miembros solo por
ejercer esas funciones.

El ingreso exige propuesta, buena reputación, compromiso con las funciones y el
secreto, y mayoría absoluta. Una persona de facción aliada requiere además las
condiciones reforzadas y dos tercios de apoyo.

Los miembros deben colaborar, votar, compartir información internamente,
defender el comercio y evitar que rutas o archivos lleguen a terceros. El uso
privado no autorizado de información reduce reputación y puede provocar
expulsión.

**Convención v0.1:** membresía y secreto se condensan en una puntuación de
reputación y en decisiones de evento. No se simulan chats, archivos privados ni
expulsiones de personas reales.

## 20. Modificación de las normas

- Añadir o modificar una norma exige mayoría absoluta de la Compañía.
- Derogar una norma exige dos tercios.

En el desarrollo del software, esto se traduce en una regla documental: toda
alteración de una mecánica consolidada debe registrarse como cambio de reglas;
una simple cifra de balance puede cambiar sin fingir que altera la Real Cédula.

## 21. Conciliación de reformas históricas

La simultaneidad se resuelve con el siguiente criterio funcional:

| Tradición o reforma compendiada | Aplicación simultánea |
| --- | --- |
| Convoyes de 1561 y ordenación de 1564 | Definen la Flota inscrita, sus mandos, defensa colectiva, despacho y registro. |
| Reorganización de 1720 | Refuerza planificación, fiscalidad, control de salidas, avisos y registros. |
| Comunicación marítima de 1764 | Refuerza avisos, agentes e información anticipada. |
| Apertura de 1765 | Amplía destinos y operaciones habilitadas sin anular el convoy. |
| Reglamento de 1778 | Amplía la red de puertos y hace viable escoger rutas o registros directos. |
| Régimen de navíos sueltos | Ofrece alternativa fuera de la protección ordinaria y exige permiso cuando usa secretos de la Compañía. |

El resultado es una institución ficticia coherente consigo misma: centraliza
registro, seguro y protección, pero admite una red amplia de puertos y licencias.

## 22. Apartado 15: hipótesis no consolidadas

Las siguientes ideas se conservan para pruebas, pero **no son reglas ordinarias
de la v0.1**, salvo los parámetros activados y etiquetados en la sección 2.1:

- incluir en la avería un seguro automático de un tercio del valor del barco;
- ampliar esa cobertura mediante una compañía de seguros separada;
- pagar a Cargadores y agentes solo después del arribo o las indemnizaciones;
- remunerarlos según beneficio, valor de compra u otra base alternativa;
- fijar un rendimiento máximo para partícipes;
- hacer que partícipes respondan antes que Cargadores por las pérdidas;
- usar participaciones de precio fijo, reiniciadas por expedición;
- mantener participaciones persistentes cuyo precio suba o baje;
- centralizar toda venta de un mismo producto en una sola persona;
- sustituir parte de la escolta por cobertura aseguradora implícita;
- crear una Casa Lonja o compañía aseguradora autónoma;
- añadir exámenes de ingreso y un número máximo de miembros de la Universidad;
- reproducir impuestos históricos adicionales por separado;
- usar testaferros extranjeros como protección diplomática indirecta;
- decidir si el seguro continúa cubriendo separaciones no fraudulentas;
- cambiar la avería entre porcentaje de carga y cantidad fija por mercante.

Varias propuestas son incompatibles. Solo podrán activarse como variantes con:

1. nombre visible;
2. objetivo de la prueba;
3. regla sustituida;
4. métrica de evaluación;
5. posibilidad de desactivación sin alterar una partida guardada.

## 23. Regla de interpretación

Si surge una situación no prevista:

1. se protege primero la trazabilidad del libro del Escribano;
2. se distingue pérdida fortuita de dolo o falta de diligencia;
3. nadie obtiene derechos de la avería o del seguro que no haya pagado, recibido
   por exención o adquirido válidamente al incorporarse;
4. la seguridad del convoy prevalece sobre una ventaja privada no pactada;
5. la decisión se registra para que pueda revisarla la Real Audiencia;
6. una solución del apartado 15 solo se usa si estaba activada antes de la
   expedición.
