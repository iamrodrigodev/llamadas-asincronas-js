/** Dominio: convierte la respuesta externa a datos propios de la aplicación. */
export function crearPais(datos) {
  if (!datos || typeof datos.name !== 'string' || typeof datos.alpha3Code !== 'string') {
    throw new Error('La fuente devolvió un país con formato inesperado.');
  }
  return {
    codigo: datos.alpha3Code,
    nombre: datos.name,
    nombreNativo: datos.nativeName || 'No disponible',
    idiomas: Array.isArray(datos.languages) ? datos.languages.map(idioma => ({
      nombre: idioma.name || 'No disponible',
      nombreNativo: idioma.nativeName || 'No disponible'
    })) : []
  };
}

export const regiones = Object.freeze([
  { codigo: 'africa', nombre: 'África' },
  { codigo: 'americas', nombre: 'América' },
  { codigo: 'asia', nombre: 'Asia' },
  { codigo: 'europe', nombre: 'Europa' },
  { codigo: 'oceania', nombre: 'Oceanía' },
  { codigo: 'polar', nombre: 'Polar' }
]);
