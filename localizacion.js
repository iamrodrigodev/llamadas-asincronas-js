/** Adaptador de idioma: traduce etiquetas y conserva los nombres nativos originales. */
export function localizarDatosPais(datos, idioma = 'es') {
  const nombresRegiones = new Intl.DisplayNames([idioma], { type: 'region', fallback: 'none' });
  const nombresIdiomas = new Intl.DisplayNames([idioma], { type: 'language', fallback: 'none' });
  const codigoPais = datos.alpha2Code;
  const nombrePais = typeof codigoPais === 'string' && /^[a-z]{2}$/i.test(codigoPais)
    ? nombresRegiones.of(codigoPais.toUpperCase()) : null;
  return {
    ...datos,
    name: nombrePais || datos.name,
    languages: Array.isArray(datos.languages) ? datos.languages.map(lengua => {
      const codigo = lengua.iso639_1;
      const nombre = typeof codigo === 'string' && /^[a-z]{2,3}$/i.test(codigo)
        ? nombresIdiomas.of(codigo.toLowerCase()) : null;
      return { ...lengua, name: nombre ? nombre.charAt(0).toLocaleUpperCase(idioma) + nombre.slice(1) : lengua.name };
    }) : datos.languages
  };
}
