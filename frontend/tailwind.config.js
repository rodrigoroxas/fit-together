/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5a67d8',      // Azul violeta (bonito para botones y acentos)
        secondary: '#38b2ac',    // Verde agua
        accent: '#fbbf24',       // Amarillo suave para detalles
        fondo: '#f8fafc',        // Fondo claro moderno
        card: '#ffffff',         // Para tarjetas (cards)
        text: '#22223b',         // Texto principal
      },
    },
  },
  plugins: [],
};