# Reglas del juego

Guía de iniciación para **Real Compañía: Carrera de Indias**, versión 0.1.

## 1. ¿Qué clase de juego es?

Es un juego de estrategia económica, logística y naval por turnos. Diriges una
expedición de la Carrera de Indias desde su preparación en España hasta el
regreso y la liquidación de las cuentas.

No reproduce una única fecha histórica. Conforme a la
[Real Cédula del proyecto](./Real%20C%C3%A9dula%20de%20la%20Real%20Compa%C3%B1%C3%ADa%20Carrera%20de%20Indias.md),
las reformas y modalidades históricas seleccionadas funcionan simultáneamente.

## 2. Objetivo de la partida

Debes completar una expedición de ida y vuelta sin arruinar la tesorería de la
Real Compañía. Una buena partida combina:

- beneficios comerciales y solvencia final;
- conservación de los barcos y de la carga;
- cumplimiento de la Real Cédula;
- buena reputación;
- pocos retrasos y reclamaciones;
- protección del convoy y auxilio a sus integrantes.

No basta con traer mucho dinero. Una expedición rentable puede obtener una mala
puntuación si pierde barcos, incumple sus obligaciones o actúa con negligencia.

## 3. Cómo empezar

Desde la carpeta del juego ejecuta:

```powershell
python -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Para detener el servidor, vuelve
a la consola y pulsa `Ctrl+C`.

La partida se guarda automáticamente en el navegador. El botón de nueva partida
borra esa partida local y comienza otra expedición.

## 4. Las cuatro estaciones

La campaña usa cuatro estaciones jugables y un cierre contable:

1. **Primavera — despacho y salida:** eliges ruta, composición, carga, protección y financiación.
2. **Verano — travesía de ida:** das órdenes de formación y resuelves incidencias.
3. **Otoño — feria americana:** vendes la carga de ida y preparas el retorno.
4. **Invierno — invernada:** la flota permanece en América, se repara y se concentra; al abrirse la primavera siguiente inicia el tornaviaje.

Tras regresar se abre la **liquidación**, que es el cierre de la expedición y no
una quinta estación.

El calendario de la ruta matiza este esquema: la Flota de Nueva España muestra
salida de mayo y la de Tierra Firme salida de agosto. Ambas pasan el invierno en
Indias y preparan la concentración en La Habana para regresar desde marzo. Las
cuatro estaciones de la interfaz resumen este calendario variable sin fingir
que ambos convoyes salían el mismo día.

Las pestañas superiores indican la fase actual. Las fases futuras se abren al
cumplir las condiciones de la anterior.

## 5. Primavera: despacho y salida

### 5.1. Ruta y puerto

Elige la ruta comercial y el puerto español de despacho. La ruta determina el
destino, los tramos de navegación, la demanda y parte del riesgo comercial.

Todos los jugadores comienzan como **mercaderes**. Ser mercader permite
organizar el comercio y la expedición, pero no equivale a ser miembro de pleno
derecho de la Compañía. El ingreso posterior exige reputación y secreto y
habilita privilegios como la incorporación por beneficencia.

### Cádiz o Sevilla

| Puerto | Efecto en el juego | Razón histórica representada |
|---|---|---|
| **Cádiz** | Reduce el apresto en 800 reales y comienza con +6 de información naval. No añade demora inicial. | Su bahía y salida oceánica eran más funcionales para navíos de gran porte. Terminó convirtiéndose en cabecera de las flotas. |
| **Sevilla y Sanlúcar** | La red mercantil aumenta un 6 % el valor efectivo de la carga comprada, pero añade 2 jornadas de demora. | Sevilla conservaba su gran comunidad mercantil y de contratación, pero los buques debían descender el Guadalquivir y franquear la barra de Sanlúcar. |

Estos porcentajes son convenciones de balance: traducen ventajas históricas a
decisiones jugables y no pretenden ser tarifas históricas literales.

### 5.2. Régimen de navegación

| Régimen | Ventaja | Inconveniente |
|---|---|---|
| **Flota** | Menor riesgo y protección común. Puede contratar seguro. | Debe cumplir la composición mínima y pagar avería. |
| **Registro** | Expedición más flexible; conserva avería y seguro. | Tiene más riesgo que la Flota y puede partir con apoyo insuficiente. |
| **Navío suelto** | No paga avería. | No recibe escolta, protección ni seguro de la Compañía y soporta el mayor riesgo. |

Una Flota necesita para la ida **dos escoltas o dos navíos de aviso**. Para el
tornaviaje necesita **una escolta o dos avisos**. La Universidad de Mareantes no
certificará una Flota que incumpla estos mínimos.

### 5.3. Composición y carga

Escoge una composición de mercantes, escoltas y avisos. Después decide cuánto
capital destinar a mercancías.

- Los **mercantes** transportan la carga que produce ingresos.
- Las **escoltas** reducen el peligro enemigo y dan fuerza en combate.
- Los **avisos** exploran, transmiten información y pueden satisfacer el mínimo reglamentario.

Destinar demasiado dinero a la carga puede dejarte sin fondos para protección,
seguro o reparaciones. Destinar demasiado poco desaprovecha la capacidad de los
mercantes.

### 5.4. Avería, Tributo Real y seguro

- La **avería** es la contribución común de los mercantes inscritos. Financia la
  protección y los auxilios; no es un seguro.
- El **Tributo Real** es una carga fiscal separada. La interfaz muestra su
  desglose sin cobrar dos veces la misma cantidad.
- El **seguro marítimo** es voluntario y cubre parte de las pérdidas registradas
  de casco y mercancías.

El seguro no paga si el capitán actuó con negligencia, fraude o fuera de la
cobertura admitida. El navío suelto y la navegación en conserva no reciben el
seguro de la Compañía.

### 5.5. Formas de incorporación

| Incorporación | Regla principal |
|---|---|
| **Ordinaria** | Inscripción normal con los derechos y obligaciones correspondientes. |
| **Navío de asiento** | Obtiene incorporación especial y paga doble avería. |
| **Beneficencia** | Exige haber sido admitido como miembro de la Compañía. |
| **En conserva** | Puede acompañar al convoy, pero no adquiere automáticamente avería, seguro ni privilegios. |

Para solicitar ingreso en la Compañía necesitas reputación suficiente y un
compromiso adecuado de secreto.

### 5.6. Financiación

Puedes reducir el desembolso inmediato mediante participaciones o un préstamo:

- Las **participaciones** no pueden superar la mitad del presupuesto de carga.
  Al final se devuelve el capital aceptado más el rendimiento pactado.
- El **préstamo particular** aporta liquidez al despacho, pero debe amortizarse
  con un 12 % adicional durante la liquidación.

Las participaciones no conceden acceso a los secretos de la ruta. En esta
versión se emiten y liquidan dentro de una sola expedición; no existe mercado de
reventa.

### 5.7. Misión y secreto

La expedición puede dedicarse al comercio, socorro de una plaza, defensa del
puerto o presa autorizada. Los servicios estratégicos pueden generar una merced
al regresar. Una presa solo obtiene premio especial si fue autorizada como
misión.

Mantener el secreto reduce la exposición de la ruta. Compartir noticias con
aliados mejora la diplomacia, pero también aumenta la amenaza.

### 5.8. Orden de partida

Antes de pulsar **Solicitar despacho y zarpar**, revisa:

- que la Universidad haya certificado la expedición;
- que la Flota cumpla sus mínimos de escolta o avisos;
- que la tesorería y la financiación cubran el coste total;
- que la beneficencia, si se eligió, haya sido aprobada;
- que quede claro qué deudas y pagos vencerán al regreso.

El mensaje inferior explica por qué está bloqueado el despacho cuando falta un
requisito.

## 6. Verano: travesía de ida

En cada tramo eliges la formación y pulsas **Avanzar una jornada**. Después
resuelves el suceso que aparezca.

| Formación | Efecto general |
|---|---|
| **Cerrada** | Reduce mucho el riesgo enemigo, pero avanza más despacio y sufre peor los temporales. |
| **Ordinaria** | Equilibrio entre velocidad, defensa y navegación. |
| **Dispersa** | Es más rápida y tolera mejor el temporal, pero facilita ataques y separaciones. |

Vigila estos indicadores:

- **casco y velamen:** capacidad material de continuar;
- **provisiones:** se consumen durante la navegación;
- **cohesión:** capacidad de mantener unido el convoy;
- **moral:** disposición de las tripulaciones;
- **información:** calidad de avisos y noticias;
- **amenaza:** peligro de corsarios o fuerzas enemigas;
- **demora:** perjudica el resultado final.

### Combate naval

Ante velas enemigas puedes:

- **formar línea:** causa más daño, pero expone a la escolta;
- **proteger los mercantes:** reduce especialmente las pérdidas de carga;
- **evadir:** intenta romper el contacto, con riesgo de dispersión y pérdida de mercancías.

La fuerza de escolta, la amenaza, el casco, la cohesión y la decisión elegida
determinan el resultado.

## 7. Otoño: feria americana

Al llegar debes:

1. vender la carga de ida;
2. consultar los precios de los bienes americanos;
3. comprar al menos un lote para el tornaviaje;
4. reparar y reaprovisionar la flota si es necesario;
5. cerrar el registro y preparar la invernada.

Puedes esperar hasta el tercer día de feria para obtener otros precios, pero
cada espera añade demora. No podrás pasar a la invernada sin haber vendido la
carga de ida y embarcado carga de retorno.

## 8. Invierno en América y tornaviaje

La Flota vuelve a ser revisada y pasa el invierno en América antes de partir.
La invernada cuesta 3.000 reales y recupera parte del casco, velamen y
provisiones. El mínimo de retorno es menos exigente que el de ida: una escolta
o dos avisos.

Al abrirse la primavera siguiente, los navíos se concentran para iniciar el
tornaviaje. Esta secuencia representa la práctica de invernar en Indias y
reunirse en La Habana para el regreso.

La navegación funciona como en la ida, pero ahora proteges la carga americana
que producirá el principal ingreso al llegar a España. Una pérdida tardía puede
arruinar una expedición que parecía rentable.

## 9. Cierre del ciclo: liquidación

Al regresar se realizan automáticamente estas operaciones:

1. venta de la carga de retorno;
2. cálculo de la indemnización asegurada, si procede;
3. pago de las participaciones;
4. reconocimiento de mercedes por servicios;
5. amortización del préstamo particular;
6. cálculo de la tesorería y puntuación final.

La puntuación valora especialmente la tesorería, reputación y conservación del
casco. Los retrasos y barcos perdidos la reducen.

La **Real Audiencia** permite resolver un expediente final breve basándose en
los asientos del Escribano, la diligencia y la buena fe. Es un sistema
simplificado en esta versión.

## 10. Una primera expedición recomendada

Para aprender el flujo utiliza:

- régimen de **Flota**;
- composición **equilibrada**;
- escolta activada y seguro marítimo;
- incorporación **ordinaria**;
- misión de **comercio**;
- reserva de secreto ordinaria;
- sin préstamo particular;
- formación **ordinaria** durante las primeras jornadas.

En América vende primero toda la carga de ida, compra un lote de retorno y
repara la flota si casco, velamen o provisiones han bajado de forma apreciable.

Esta configuración no garantiza la victoria, pero permite conocer todos los
pasos sin asumir riesgos especiales desde el comienzo.

## 11. Errores frecuentes

- **No puedo zarpar:** consulta el mensaje de validación; suele faltar escolta,
  avisos, certificación, aprobación o dinero.
- **El seguro no paga:** pudo existir negligencia, falta de cobertura o régimen
  de navío suelto/conserva.
- **No puedo salir de América:** primero vende la carga de ida y compra al menos
  un lote de retorno.
- **Tengo dinero, pero mala puntuación:** también cuentan reputación, casco,
  demora y barcos perdidos.
- **El préstamo parecía una ganancia:** es financiación temporal y se devuelve
  con interés.
- **La formación cerrada siempre parece mejor:** protege del enemigo, pero
  aumenta la demora y el efecto de los temporales.

## 12. Glosario breve

| Término | Significado en el juego |
|---|---|
| **Almiranta** | Navío situado en retaguardia para mantener la formación y prestar auxilio. |
| **Avería** | Contribución común para defensa y socorro de la Flota. |
| **Aviso** | Navío ligero de exploración, información y correo. |
| **Capitana** | Navío principal desde el que se dirige la Flota. |
| **Cargador** | Persona o institución que aporta, organiza o entrega mercancías. |
| **En conserva** | Navegación junto al convoy sin adquirir automáticamente sus privilegios. |
| **Escribano** | Registra decisiones, pagos, incidencias y pruebas de la expedición. |
| **Registro** | Régimen autorizado más flexible que la Flota ordinaria. |
| **Tornaviaje** | Viaje de regreso desde América hasta España. |
| **Universidad de Mareantes** | Revisa preparación, barcos, formación y aptitud para navegar. |

## 13. Regla de interpretación

Si la interfaz y esta guía no resuelven una duda, consulta por este orden:

1. [Real Cédula de la Real Compañía Carrera de Indias.md](./Real%20C%C3%A9dula%20de%20la%20Real%20Compa%C3%B1%C3%ADa%20Carrera%20de%20Indias.md);
2. [Reglas compendiadas](docs/REGLAS_COMPENDIADAS.md);
3. [Implementación por apartados](docs/IMPLEMENTACION_REAL_CEDULA.md).

Los capítulos 0–14 de la Real Cédula contienen las normas consolidadas. El
capítulo 15 reúne anotaciones e hipótesis y no debe interpretarse como norma
firme salvo que una mecánica las identifique expresamente como experimentales.
