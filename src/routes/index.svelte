<script>
	import { onMount } from 'svelte';

	// pretty stuff
	import hljs from 'highlight.js/lib/core';
	import hljscss from 'highlight.js/lib/languages/css';
	hljs.registerLanguage('css', hljscss);
	import 'highlight.js/styles/atom-one-dark.css';

	// ideally, this'd be parsed from the css, but whatever
	let options = {
		theme: 'Mocha',
		classicLinks: false,
		pancake: false,
		usefont: false,
		forceColor: false
	};

	// stylus input *.user.css
	let stylusData = '';
	// rendered css
	let result = '';
	let hlResult = '';
	let showCSS = false;

	// all of this has to be client-side only
	onMount(() => {
		window.createTheme = () => {
			document.body.className = options.theme.toLowerCase();
			const output = window.stylus(stylusData).set('filename', 'catppuccin.css');

			for (const key in options) {
				output.define(key, options[key]);
			}

			output.render((err, css) => {
				err && console.error(err);
				hlResult = hljs.highlight(css, { language: 'css' }).value;
				result = css;
			});
		};

		// fetch the current userStyles file, and render it the first time
		fetch('discord.styl')
			.then((res) => res.text())
			.then((parsedText) => {
				stylusData = parsedText;
				window.createTheme();
			});
	});

	const download = () => {
		const blob = new Blob([result], { type: 'text/css' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		console.log(blob);
		link.href = url;
		link.download = 'catppuccin-discord.css';
		link.click();
	};
</script>

<div class="container mx-auto space-y-4 pt-8">
	<div class="mx-auto max-w-fit space-y-4">
		<img
			src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png"
			alt="Catppuccin Logo"
			class="mx-auto w-24"
		/>
		<h1
			class="bg-gradient-to-r from-mauve to-pink bg-clip-text text-3xl font-extrabold text-transparent"
		>
			Catppuccin Discord Customizer
		</h1>
		<form on:change={() => window.createTheme(window.stylusData)} class="">
			<label for="theme">
				<span class="text-sm font-semibold">Use</span>
				<select
					name="theme"
					bind:value={options.theme}
					class="rounded bg-overlay0/30 p-0 text-text focus:ring-mauve"
				>
					<option value="Mocha">Mocha</option>
					<option value="Macchiato">Macchiato</option>
					<option value="Frappe">Frappe</option>
					<option value="Latte">Latte</option>
				</select>
				<span class="text-sm font-semibold">as a flavour!</span>
			</label>
			<div class="space-y-1 py-2">
				<label class="flex items-center">
					<input type="checkbox" id="classicLinks" bind:checked={options.classicLinks} />
					<span class="ml-2">Use classic link colours</span>
				</label>
				<label class="flex items-center">
					<input type="checkbox" id="flatBackground" bind:checked={options.pancake} />
					<span class="ml-2">Flat background colours</span>
				</label>
				<label class="flex items-center">
					<input type="checkbox" id="interFont" bind:checked={options.usefont} />
					<span class="ml-2">Use the <em>Inter</em> font everywhere</span>
				</label>
				<label class="flex items-center">
					<input type="checkbox" id="noUsernameColours" bind:checked={options.forceColor} />
					<span class="ml-2">Don't use role colours for usernames</span>
				</label>
			</div>
			<button
				class="mx-auto block rounded-md border border-crust bg-overlay0/30 px-4 py-2 font-semibold text-rosewater"
				on:click={download}>Save</button
			>
		</form>
	</div>
	<div class="group">
		<label class="mx-auto flex w-fit items-center">
			<input type="checkbox" bind:checked={showCSS} />
			<span class="ml-2 font-mono">Show CSS</span>
		</label>
		<pre class={'bg-mantle p-4 mt-2 overflow-x-scroll ' + (showCSS ? 'block' : 'hidden')}>
    <code
				class="language-css leading-none outline-none"
				id="result"
				bind:innerHTML={hlResult}
				contenteditable="true"
			/>
    </pre>
	</div>
</div>
