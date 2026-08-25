# Real Compañía: Carrera de Indias

Prototipo web de estrategia económica, logística y naval inspirado en la
`Real Cédula de la Real Compañía Carrera de Indias`.

El prototipo emplea simultáneamente las instituciones y posibilidades
históricas compiladas en la Real Cédula: convoyes, navíos sueltos y de
registro, avería, tributo real, seguros, escolta, avisos, participaciones,
Consulado de Mercaderes, Universidad de Mareantes, agentes de puerto y Real
Audiencia.

## Documento base

La fuente de diseño se conserva en la raíz del proyecto:
[Real Cédula de la Real Compañía Carrera de Indias.docx](./Real%20C%C3%A9dula%20de%20la%20Real%20Compa%C3%B1%C3%ADa%20Carrera%20de%20Indias.docx).

Los apartados 0–14 gobiernan el prototipo. El apartado 15 se documenta por
separado como banco de hipótesis y cifras experimentales.

La correspondencia verificable entre cada apartado y las mecánicas está en
[`docs/IMPLEMENTACION_REAL_CEDULA.md`](docs/IMPLEMENTACION_REAL_CEDULA.md).

## Ejecutar

No necesita instalar dependencias. Desde la carpeta del proyecto:

```powershell
python -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador.

También puede abrirse `index.html` directamente, aunque se recomienda el
servidor local para evitar restricciones del navegador.

## Publicar en GitHub Pages

El proyecto no necesita compilación. Una vez subido al repositorio, activa
GitHub Pages sobre la rama principal y la carpeta raíz. `index.html` será la
página de entrada.

## Objetivo de la partida

Preparar una expedición, cruzar el Atlántico, comerciar en América y completar
el tornaviaje sin quebrar la Real Compañía. El resultado combina:

- solvencia de la tesorería común;
- valor retornado a España;
- supervivencia de los navíos;
- reputación y cumplimiento de las normas;
- reclamaciones resueltas ante la Real Audiencia.

## Estructura

```text
.
├── index.html
├── assets/
│   └── favicon.svg
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── engine.js
│   └── game.js
├── docs/
│   ├── DISENO.md
│   └── REGLAS_COMPENDIADAS.md
└── tests/
    ├── browser-smoke.html
    ├── smoke.test.js
    └── validate.py
```

## Estado

Versión `0.1.0`: un viaje completo de ida y vuelta, con dos rutas,
configuración del despacho, financiación, certificación, eventos navales,
mercado americano, seguro, liquidación y expedientes de la Real Audiencia.

El apartado 15 de la Real Cédula se considera un banco de hipótesis de diseño.
Sus cifras y alternativas no se tratan como normas cerradas hasta ser probadas.

## Pruebas

Las reglas puras cuentan con pruebas de humo sin dependencias externas:

```powershell
npm test
```

No hace falta Node para jugar; solo se utiliza para ejecutar estas pruebas.

La estructura y la codificación pueden comprobarse sin instalar nada:

```powershell
python tests/validate.py
```

Con el servidor local en marcha, `tests/browser-smoke.html` recorre también
automáticamente las cinco fases en un navegador real.
