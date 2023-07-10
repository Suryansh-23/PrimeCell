/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				Montserrat: ['Montserrat', 'sans-serif']
			}
		}
	},
	daisyui: {
		themes: ['night']
	},

	plugins: [require('daisyui'), require('@tailwindcss/typography')]
};

module.exports = config;
