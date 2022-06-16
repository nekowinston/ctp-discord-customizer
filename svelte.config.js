import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		},
    paths: {
      base: '/ctp-discord-customizer'
    }
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
