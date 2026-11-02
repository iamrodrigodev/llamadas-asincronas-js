import { crearPais } from './dominio.js';
import { localizarDatosPais } from './localizacion.js';

/** Infraestructura: adapta HTTP al contrato obtenerPorRegion del caso de uso. */
export class RepositorioPaises {
  constructor({ consultar = globalThis.fetch.bind(globalThis), direccion = 'https://countries.dev' } = {}) {
    this.consultar = consultar;
    this.direccion = direccion;
  }

  async obtenerPorRegion(region, senal) {
    const respuesta = await this.consultar(`${this.direccion}/region/${encodeURIComponent(region)}`, { signal: senal });
    if (!respuesta.ok) throw new Error('No pudimos consultar los países. Vuelve a intentarlo.');
    const datos = await respuesta.json();
    if (!Array.isArray(datos)) throw new Error('La fuente devolvió una respuesta inesperada.');
    return datos.map(dato => crearPais(localizarDatosPais(dato))).sort((primero, segundo) => primero.nombre.localeCompare(segundo.nombre, 'es'));
  }
}
