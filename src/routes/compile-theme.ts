import fs from 'fs';
import postcss from 'postcss';
import stylus from 'stylus';
import prettier from 'prettier';

import mergeThemes from '../lib/prefers-color-scheme.js';
import rmMoz from '../lib/remove-stylus.js';

type theme = 'Latte' | 'Frappe' | 'Macchiato' | 'Mocha';

function capitalizeString(str: string) {
	return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
}

function getPureCSS(input: string, theme: theme = 'Mocha', prepareSync: boolean = false): string {
	let output: string;
	stylus(input)
		.set('filename', 'discord.css')
		.define('theme', theme)
		.render((_err, out) => {
			const result = postcss([rmMoz({ prepareSync: prepareSync })]).process(out);
			output = result.css;
		});
	return output;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get(event: import('@sveltejs/kit').RequestEvent) {
	const frontmatterCSS = fs.readFileSync('./data/frontmatter.css', 'utf8');
	const stylusCSS = fs.readFileSync('./catppuccin-discord/discord.user.css', 'utf8');

	const params = event.url.searchParams;
	const options = {
		theme: capitalizeString(params.get('theme') || 'Mocha') as theme,
		darkTheme: capitalizeString(params.get('darkTheme') || 'Mocha') as theme,
		lightTheme: capitalizeString(params.get('lightTheme') || 'Latte') as theme,
		useSync: params.get('sync') ? true : false
	};

	// if dark & light theme are the same, default to the dark theme, and disable sync
	if (options.lightTheme === options.darkTheme) {
		options.theme = options.darkTheme;
		options.useSync = false;
	}

	let compiledTheme;
	// when using sync, compile each Theme separately
	if (options.useSync) {
		let lightThemeCss = getPureCSS(stylusCSS, options.lightTheme, true);
		let darkThemeCss = getPureCSS(stylusCSS, options.darkTheme, true);

		let lightRoot = postcss.parse(lightThemeCss);
		let darkRoot = postcss.parse(darkThemeCss);

		// and pipe them into the mergeThemes function
		compiledTheme = postcss(mergeThemes({ lightTheme: lightRoot, darkTheme: darkRoot })).process(
			postcss.parse('')
		).css;
	} else {
		compiledTheme = getPureCSS(stylusCSS, options.theme, false);
	}

	// always include the frontmatter
	compiledTheme = prettier.format(compiledTheme, { parser: 'css' });
	compiledTheme = frontmatterCSS + compiledTheme;

	return {
		body: compiledTheme,
		Headers: {
			'Content-Type': 'text/css',
			'Cache-Control': 'public, max-age=31536000',
			Expires: new Date(Date.now() + 31536000).toUTCString(),
			'Last-Modified': new Date().toUTCString(),
			ETag: '"' + Date.now() + '"'
		}
	};
}
