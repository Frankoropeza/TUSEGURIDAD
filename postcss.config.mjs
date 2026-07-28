import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Se pasa la ruta del config de forma explícita: si se depende de la
// autodetección por cwd, un dev server de larga vida puede quedarse con
// un config obsoleto en memoria cuando los archivos cambian de inodo.
export default {
  plugins: [tailwindcss('./tailwind.config.mjs'), autoprefixer],
};
