/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./client/**/*.{html,js,svelte,ts}', './imports/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["synthwave"],
  },
}
