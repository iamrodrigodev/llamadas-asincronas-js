/** Presentación: concentra las operaciones sobre el DOM. */
export class VistaPaises {
  constructor(elementos) { this.elementos = elementos; }

  presentarRegiones(regiones) {
    regiones.forEach(region => this.elementos.region.add(new Option(region.nombre, region.codigo)));
  }

  prepararConsulta(hayRegion) {
    const { pais, resultado, vacio, ayudaPais } = this.elementos;
    pais.replaceChildren(new Option(hayRegion ? 'Consultando países…' : 'Primero elige una región', ''));
    pais.disabled = true;
    resultado.hidden = true;
    vacio.hidden = false;
    ayudaPais.textContent = hayRegion ? 'Estamos consultando los países de esta región.' : 'Los países aparecerán al elegir una región.';
    this.elementos.mensajeVacio.textContent = 'Selecciona una región y un país para conocer sus idiomas y nombres nativos.';
  }

  presentarPaises(paises) {
    const { pais, ayudaPais } = this.elementos;
    pais.replaceChildren(new Option(paises.length ? 'Selecciona un país' : 'No hay países disponibles', ''));
    paises.forEach(elemento => pais.add(new Option(elemento.nombre, elemento.codigo)));
    pais.disabled = paises.length === 0;
    ayudaPais.textContent = `${paises.length} países disponibles en esta región.`;
  }

  mostrarEstado(mensaje, tipo = '') {
    const { estado, reintentar, barraEstado } = this.elementos;
    estado.textContent = mensaje;
    reintentar.hidden = tipo !== 'error';
    barraEstado.classList.toggle('error', tipo === 'error');
    barraEstado.classList.toggle('cargando', tipo === 'cargando');
    this.elementos.pais.setAttribute('aria-busy', String(tipo === 'cargando'));
    if (tipo === 'error') {
      this.elementos.pais.replaceChildren(new Option('No se pudo cargar la lista', ''));
      this.elementos.ayudaPais.textContent = 'Reintenta la consulta o elige otra región.';
      this.elementos.mensajeVacio.textContent = 'La consulta no se completó. Puedes volver a intentarlo sin recargar la página.';
    }
  }

  mostrarPais(pais, region) {
    const { resultado, vacio, idiomas } = this.elementos;
    resultado.hidden = !pais;
    vacio.hidden = Boolean(pais);
    if (!pais) return;
    this.elementos.nombrePais.textContent = pais.nombre;
    this.elementos.nombreNativo.textContent = pais.nombreNativo;
    this.elementos.rutaPais.textContent = `${region} / ${pais.codigo}`;
    this.elementos.cantidadIdiomas.textContent = String(pais.idiomas.length).padStart(2, '0');
    this.elementos.etiquetaIdiomas.textContent = pais.idiomas.length === 1 ? 'IDIOMA REGISTRADO' : 'IDIOMAS REGISTRADOS';
    idiomas.replaceChildren();
    for (const idioma of pais.idiomas) {
      const fila = document.createElement('tr');
      for (const valor of [idioma.nombre, idioma.nombreNativo]) {
        const celda = document.createElement('td');
        const texto = document.createElement('bdi');
        texto.textContent = valor;
        celda.append(texto);
        fila.append(celda);
      }
      idiomas.append(fila);
    }
    if (!pais.idiomas.length) {
      const fila = document.createElement('tr');
      const celda = document.createElement('td');
      celda.colSpan = 2;
      celda.textContent = 'La fuente no registra idiomas para este país.';
      fila.append(celda);
      idiomas.append(fila);
    }
  }
}
