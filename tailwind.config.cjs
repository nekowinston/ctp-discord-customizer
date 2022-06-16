const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', 'sans-serif']
			}
		}
	},
	safelist: ['mocha', 'frappe', 'macchiato', 'latte'],
	plugins: [require('@tailwindcss/forms'), require('@nekowinston/ctp-tailwindcss')]
};
