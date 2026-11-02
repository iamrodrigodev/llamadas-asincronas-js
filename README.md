<div align="center">
  <table>
    <thead>
      <tr>
        <th>
          <img src="https://github.com/RodrigoStranger/imagenes-la-salle/blob/main/logo_secundario_color.png?raw=true" width="150" alt="Logo de la Universidad La Salle" />
        </th>
        <th>
          <strong>UNIVERSIDAD LA SALLE DE AREQUIPA</strong><br />
          <strong>FACULTAD DE INGENIERÍAS Y ARQUITECTURA</strong><br />
          <strong>DEPARTAMENTO ACADÉMICO DE INGENIERÍA Y MATEMÁTICAS</strong><br />
          <strong>CARRERA PROFESIONAL DE INGENIERÍA DE SOFTWARE</strong>
        </th>
      </tr>
    </thead>
  </table>
</div>

<div align="center">
  <h1>LLAMADAS ASÍNCRONAS CON JAVASCRIPT</h1>
  <strong>Tecnologías de Construcción de Software</strong><br />
  <strong>Profesor: Luis Enrique Patiño Herrera</strong>
</div>

---

## Descripción

**Meridiano** es un explorador de países e idiomas con dos listas desplegables dependientes. Al elegir una región, consulta sus países de forma asíncrona; al elegir un país, muestra una tabla con los idiomas y sus nombres nativos. También presenta el nombre nativo del país para distinguir ambos conceptos.

Diseño personalizado y minimalista, sin iconos ni bibliotecas de interfaz: fondo cálido, tipografía editorial, tonos oliva y una composición tipográfica realizada en CSS. Los recursos de la aplicación no dependen de fuentes o imágenes externas.

## Tecnologías utilizadas

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Fetch API](https://img.shields.io/badge/Fetch_API-async%2Fawait-7060DF?style=for-the-badge&logo=javascript&logoColor=white)](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
[![API Countries](https://img.shields.io/badge/API_Countries-REST-52634A?style=for-the-badge)](https://www.apicountries.com/docs/api/region)
[![Node.js](https://img.shields.io/badge/Node.js-Pruebas-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

- **HTML** para la estructura, los selectores y la tabla de datos.
- **CSS** para el diseño personalizado, adaptable y los controles accesibles.
- **JavaScript** con módulos y funciones y variables propias en español.
- API estándar **Fetch**, `async/await` y `AbortController` para consultas asíncronas y cancelación.
- **API Countries** como servicio REST de países e idiomas por región.
- **Node.js** para ejecutar las comprobaciones con `node:test`.
- **Python 3** para servir los archivos localmente.

La aplicación no requiere instalar paquetes ni dependencias externas. El logo y las insignias de este README requieren conexión para visualizarse. Las consultas de países también necesitan conexión al servicio; la interfaz no depende de las imágenes del README.

## Ejecución

Clonar el repositorio y abrir una terminal en su raíz:

```bash
git clone https://github.com/iamrodrigodev/llamadas-asincronas-js.git
cd llamadas-asincronas-js
```

Iniciar el servidor local:

```bash
python3 -m http.server 8001
```

Abrir [http://localhost:8001](http://localhost:8001).

Alternativamente, con Node.js y Python 3 instalados:

```bash
npm start
```

No es necesario ejecutar `npm install`. Node.js no es el servidor de la aplicación ni ejecuta sus consultas: la aplicación funciona en el navegador. Se necesita conexión para consultar la API y un servidor HTTP para cargar los módulos; no abrir con `file://`.

## Fuente de datos

Se utiliza la alternativa API Countries permitida por la consigna. El dominio `www.apicountries.com` redirige actualmente a `countries.dev`; el proyecto consulta directamente su destino para evitar problemas de redirección entre orígenes:

```text
GET https://countries.dev/region/americas
GET https://countries.dev/region/asia
```

[Documentación de consultas por región](https://www.apicountries.com/docs/api/region).

REST Countries v3.1 fue verificada durante el desarrollo y respondió con un aviso de descontinuación, por lo que no se utiliza en esta implementación. Las regiones son estáticas, como permite la alternativa de la consigna: África, América, Asia, Europa, Oceanía y Polar.

Los países y los idiomas se presentan en español con `Intl.DisplayNames`, usando los códigos ISO de la respuesta. Así, Perú aparece con tilde y Japan como Japón. Los nombres nativos se conservan exactamente como los devuelve la fuente. Si no hay un código reconocido, se mantiene la etiqueta original; no se inventan idiomas ausentes. La disponibilidad y la vigencia de los datos dependen del servicio externo.

## Funcionamiento

```text
Seleccionar región
      ↓
ControladorPaises → ConsultarPaises → RepositorioPaises
                                          ↓
                                    fetch + await
                                          ↓
Respuesta JSON → modelo de dominio → lista de países
                                          ↓
                               Seleccionar país
                                          ↓
                       Tabla de idiomas y nombres nativos
```

Cada cambio de región dispara una nueva consulta y limpia el país y la tabla anteriores. El selector de países se deshabilita durante la carga. La respuesta regional ya contiene los idiomas, por lo que seleccionar un país actualiza la tabla sin otra solicitud.

Se muestran estados de carga, error y ausencia de datos. Una consulta fallida ofrece un botón para reintentar. Se cancelan consultas anteriores y se ignoran respuestas desactualizadas; el tiempo de espera máximo es de 15 segundos.

## Arquitectura y buenas prácticas

Todos los archivos se encuentran en la raíz del proyecto.

| Archivo | Capa y responsabilidad |
|---|---|
| `localizacion.js` | Adaptador de nombres de países e idiomas al español con códigos ISO. |
| `dominio.js` | Modelo de país, normalización de idiomas y catálogo de regiones. |
| `consultar-paises.js` | Caso de uso para consultar una región válida. |
| `repositorio-paises.js` | Adaptador HTTP que transforma la respuesta externa al modelo propio. |
| `controlador-paises.js` | Coordinación del flujo, cancelación y control de concurrencia. |
| `vista-paises.js` | Actualización del DOM, selectores, mensajes y tabla. |
| `aplicacion.js` | Composición de dependencias y conexión de eventos. |
| `index.html` | Estructura accesible. |
| `estilos.css` | Diseño personalizado y adaptable. |
| `pruebas.test.js` | Pruebas del dominio, repositorio, caso de uso y controlador. |

Se aplican principios SOLID según el alcance: responsabilidad única por componente, dependencias recibidas por constructor y un contrato pequeño de repositorio (`obtenerPorRegion`) que permite cambiar el proveedor sin modificar el caso de uso. El dominio y el caso de uso no dependen del DOM ni de `fetch`. El controlador recibe una vista que se sustituye en las pruebas, y el repositorio recibe su función de consulta.

Se utilizan nombres propios en español, `textContent` para representar datos con seguridad y `bdi` para aislar nombres en diferentes direcciones de escritura. La interfaz incluye etiquetas, ayudas, anuncios de estado, navegación por teclado, foco visible y respeto a la preferencia de movimiento reducido.

## Resultado esperado

Al seleccionar **América** y luego **Perú**:

| Language | Native name |
|---|---|
| Español | Español |

Nombre nativo del país: **Perú**.

Al seleccionar **Asia** y luego **Japón**:

| Language | Native name |
|---|---|
| Japonés | 日本語 (にほんご) |

Nombre nativo del país: **日本**.

Estos resultados corresponden a la respuesta observada durante la comprobación; no pretenden constituir un inventario exhaustivo de los idiomas hablados en cada país.

## Comprobación

```bash
npm test
```

Ocho pruebas automatizadas verifican la normalización de datos, el rechazo de regiones inválidas, la señal de cancelación y ordenamiento, los errores HTTP y de formato, el descarte de respuestas antiguas el estado de reintento, la localización de Perú y la conservación de etiquetas sin código válido.

También se verificó en el navegador la consulta real de América y Perú y el cambio a Asia y Japón, con recarga del selector y limpieza del resultado anterior.

## Evidencia de funcionamiento

### Pantalla inicial

![Interfaz inicial de Meridiano](./01-inicio.jpg)

### América y Perú

![Consulta de Perú y nombres nativos de sus idiomas](./02-peru.jpg)

### Asia y Japón

![Recarga por región y resultado de Japón](./03-japon.jpg)
