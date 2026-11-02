import { regiones } from './dominio.js';
import { RepositorioPaises } from './repositorio-paises.js';
import { ConsultarPaises } from './consultar-paises.js';
import { VistaPaises } from './vista-paises.js';
import { ControladorPaises } from './controlador-paises.js';

const obtener = identificador => document.getElementById(identificador);
const elementos = {
  region: obtener('region'), pais: obtener('pais'), estado: obtener('estado'),
  ayudaPais: obtener('ayuda-pais'), resultado: obtener('resultado'), vacio: obtener('vacio'),
  mensajeVacio: obtener('mensaje-vacio'), barraEstado: obtener('estado').parentElement,
  reintentar: obtener('reintentar'), nombrePais: obtener('nombre-pais'),
  nombreNativo: obtener('nombre-nativo'), rutaPais: obtener('ruta-pais'),
  cantidadIdiomas: obtener('cantidad-idiomas'), etiquetaIdiomas: obtener('etiqueta-idiomas'),
  idiomas: obtener('idiomas')
};
const vista = new VistaPaises(elementos);
const consulta = new ConsultarPaises(new RepositorioPaises(), regiones);
const controlador = new ControladorPaises({ consulta, vista, regiones });
vista.presentarRegiones(regiones);
elementos.region.addEventListener('change', evento => controlador.cambiarRegion(evento.target.value));
elementos.pais.addEventListener('change', evento => controlador.cambiarPais(evento.target.value));
elementos.reintentar.addEventListener('click', () => controlador.cambiarRegion(elementos.region.value));
