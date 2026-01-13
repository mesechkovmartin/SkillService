/**
 * Tailwind CSS configuration file for the Skill Service project.
 * 
 * Configures Tailwind CSS to process template files in the src directory
 * and includes the daisyUI plugin for pre-built component styles.
 * 
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path if necessary
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
  themes: ["light", "dark"],
},
}