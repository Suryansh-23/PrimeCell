/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['night']
	},

	plugins: [require('daisyui'), require('@tailwindcss/typography')]
};

module.exports = config;
