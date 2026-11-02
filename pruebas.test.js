import prueba from 'node:test';
import { localizarDatosPais } from './localizacion.js';
import verificar from 'node:assert/strict';
import { crearPais, regiones } from './dominio.js';
import { ConsultarPaises } from './consultar-paises.js';
import { RepositorioPaises } from './repositorio-paises.js';
import { ControladorPaises } from './controlador-paises.js';

prueba('normaliza nombres nativos sin inventar datos ausentes', () => {
  verificar.deepEqual(crearPais({ name: 'Peru', alpha3Code: 'PER', languages: [{ name: 'Spanish', nativeName: 'Español' }] }), {
    codigo: 'PER', nombre: 'Peru', nombreNativo: 'No disponible', idiomas: [{ nombre: 'Spanish', nombreNativo: 'Español' }]
  });
});
prueba('rechaza regiones no permitidas sin consultar la red', async () => {
  const consulta = new ConsultarPaises({ obtenerPorRegion() { throw new Error('No debe llamarse'); } }, regiones);
  await verificar.rejects(consulta.ejecutar('invalida'), /región válida/);
});
prueba('el repositorio propaga la señal, normaliza y ordena la respuesta', async () => {
  const senal = new AbortController().signal;
  const repositorio = new RepositorioPaises({ consultar: async (direccion, opciones) => {
    verificar.match(direccion, /region\/americas$/);
    verificar.equal(opciones.signal, senal);
    return { ok: true, json: async () => [{ name: 'Peru', alpha3Code: 'PER' }, { name: 'Argentina', alpha3Code: 'ARG' }] };
  }});
  verificar.deepEqual((await repositorio.obtenerPorRegion('americas', senal)).map(pais => pais.codigo), ['ARG', 'PER']);
});
prueba('maneja errores HTTP y respuestas inesperadas', async () => {
  await verificar.rejects(new RepositorioPaises({ consultar: async () => ({ ok: false }) }).obtenerPorRegion('asia'), /consultar/);
  await verificar.rejects(new RepositorioPaises({ consultar: async () => ({ ok: true, json: async () => ({}) }) }).obtenerPorRegion('asia'), /inesperada/);
});
function prepararVista() {
  return { resultados: [], estados: [], prepararConsulta() {}, presentarPaises(paises) { this.resultados.push(paises); }, mostrarEstado(...estado) { this.estados.push(estado); }, mostrarPais() {} };
}
prueba('una respuesta antigua no sobrescribe la región más reciente', async () => {
  const pendientes = {};
  const vista = prepararVista();
  const controlador = new ControladorPaises({ regiones, vista, consulta: { ejecutar: region => new Promise(resolver => { pendientes[region] = resolver; }) } });
  const primera = controlador.cambiarRegion('americas');
  const segunda = controlador.cambiarRegion('asia');
  pendientes.asia([{ codigo: 'JPN' }]);
  await segunda;
  pendientes.americas([{ codigo: 'PER' }]);
  await primera;
  verificar.deepEqual(vista.resultados, [[{ codigo: 'JPN' }]]);
});
prueba('un fallo permite presentar el estado de reintento', async () => {
  const vista = prepararVista();
  const controlador = new ControladorPaises({ regiones, vista, consulta: { ejecutar: async () => { throw new Error('Sin conexión'); } } });
  await controlador.cambiarRegion('asia');
  verificar.equal(vista.estados.at(-1)[1], 'error');
});

prueba('localiza Perú e idiomas sin modificar los nombres nativos', () => {
  const pais = localizarDatosPais({ name: 'Peru', alpha2Code: 'PE', nativeName: 'Perú', languages: [{ name: 'Spanish', iso639_1: 'es', nativeName: 'Español' }] });
  verificar.equal(pais.name, 'Perú');
  verificar.equal(pais.languages[0].name, 'Español');
  verificar.equal(pais.languages[0].nativeName, 'Español');
});
prueba('conserva la fuente cuando falta un código de traducción válido', () => {
  verificar.equal(localizarDatosPais({ name: 'País de ejemplo', languages: [{ name: 'Idioma de ejemplo', iso639_1: '??' }] }).languages[0].name, 'Idioma de ejemplo');
});

prueba('rechaza registros de país sin identificador', () => {
  verificar.throws(() => crearPais({ name: 'Peru' }), /formato inesperado/);
});
prueba('admite regiones sin países', async () => {
  const vista = prepararVista();
  const controlador = new ControladorPaises({ regiones, vista, consulta: { ejecutar: async () => [] } });
  await controlador.cambiarRegion('polar');
  verificar.deepEqual(vista.resultados, [[]]);
  verificar.match(vista.estados.at(-1)[0], /No se encontraron/);
});
prueba('volver a la región vacía cancela y descarta una consulta pendiente', async () => {
  let resolverConsulta, senalRecibida;
  const vista = prepararVista();
  const controlador = new ControladorPaises({ regiones, vista, consulta: { ejecutar: (region, senal) => {
    senalRecibida = senal;
    return new Promise(resolver => { resolverConsulta = resolver; });
  } } });
  const pendiente = controlador.cambiarRegion('asia');
  await controlador.cambiarRegion('');
  verificar.equal(senalRecibida.aborted, true);
  resolverConsulta([{ codigo: 'JPN' }]);
  await pendiente;
  verificar.deepEqual(vista.resultados, []);
  verificar.deepEqual(controlador.paises, []);
});
prueba('selecciona solo países de la región actual y elimina selecciones inválidas', async () => {
  const vista = prepararVista();
  const mostrados = [];
  vista.mostrarPais = (pais, region) => mostrados.push({ pais, region });
  const peru = { codigo: 'PER', nombre: 'Perú' };
  const controlador = new ControladorPaises({ regiones, vista, consulta: { ejecutar: async () => [peru] } });
  await controlador.cambiarRegion('americas');
  controlador.cambiarPais('PER');
  verificar.deepEqual(mostrados.at(-1), { pais: peru, region: 'América' });
  controlador.cambiarPais('JPN');
  verificar.equal(mostrados.at(-1).pais, undefined);
});
