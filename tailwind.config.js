/** @type {import('tailwindcss').Config} */

import tailwindForm from "@tailwindcss/forms";
import tailwindAR from "@tailwindcss/aspect-ratio";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    // extend: {},
  },
  plugins: [tailwindForm, tailwindAR],
};
