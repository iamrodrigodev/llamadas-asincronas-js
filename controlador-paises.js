/** Coordina casos de uso y vista. Puede probarse sin navegador. */
export class ControladorPaises {
  constructor({ consulta, vista, regiones }) {
    this.consulta = consulta;
    this.vista = vista;
    this.regiones = regiones;
    this.paises = [];
    this.regionActual = '';
    this.cancelacion = null;
    this.version = 0;
  }

  async cambiarRegion(region) {
    const versionActual = ++this.version;
    this.cancelacion?.abort();
    this.regionActual = region;
    this.paises = [];
    this.vista.prepararConsulta(Boolean(region));
    if (!region) { this.vista.mostrarEstado('Elige una región para comenzar.'); return; }
    this.cancelacion = new AbortController();
    const cancelacionActual = this.cancelacion;
    const limite = setTimeout(() => cancelacionActual.abort(), 15000);
    this.vista.mostrarEstado('Consultando los países. Puedes seguir explorando la página.', 'cargando');
    try {
      const paises = await this.consulta.ejecutar(region, cancelacionActual.signal);
      if (versionActual !== this.version) return;
      this.paises = paises;
      this.vista.presentarPaises(paises);
      this.vista.mostrarEstado(paises.length ? 'Consulta completada. Elige un país para descubrir sus idiomas.' : 'No se encontraron países para esta región.');
    } catch (error) {
      if (versionActual !== this.version) return;
      const mensaje = cancelacionActual.signal.aborted ? 'La consulta tardó demasiado. Vuelve a intentarlo.' : 'No se pudieron cargar los países. Comprueba tu conexión y vuelve a intentarlo.';
      this.vista.mostrarEstado(mensaje, 'error');
    } finally {
      clearTimeout(limite);
    }
  }

  cambiarPais(codigo) {
    const pais = this.paises.find(elemento => elemento.codigo === codigo);
    const region = this.regiones.find(elemento => elemento.codigo === this.regionActual);
    this.vista.mostrarPais(pais, region?.nombre || '');
    this.vista.mostrarEstado(pais ? `Mostrando los idiomas y nombres nativos de ${pais.nombre}.` : 'Elige un país para descubrir sus idiomas.');
  }
}
