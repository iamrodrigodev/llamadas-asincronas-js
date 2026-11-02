/** Aplicación: depende del contrato del repositorio, no de fetch ni del DOM. */
export class ConsultarPaises {
  constructor(repositorio, regionesPermitidas) {
    this.repositorio = repositorio;
    this.regionesPermitidas = new Set(regionesPermitidas.map(region => region.codigo));
  }

  async ejecutar(region, senal) {
    if (!this.regionesPermitidas.has(region)) throw new Error('Selecciona una región válida.');
    return this.repositorio.obtenerPorRegion(region, senal);
  }
}
