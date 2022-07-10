const plugin = (opts) => ({
	postcssPlugin: 'prefers-color-scheme',
	Once(root) {
		root.append({
			name: 'media',
			params: '(prefers-color-scheme: dark)',
			nodes: [opts.darkTheme]
		});
		root.append({
			name: 'media',
			params: '(prefers-color-scheme: light)',
			nodes: [opts.lightTheme]
		});
	}
});

plugin.postcss = true;

export default plugin;
