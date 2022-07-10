const plugin = (opts = {}) => ({
	postcssPlugin: 'remove-stylus',
	Once(root) {
		root.nodes.forEach((node) => {
			if (node.name == '-moz-document') {
				root.nodes = node.nodes;
				if (opts.prepareSync) {
					root.nodes = node.nodes;
				}
			}
		});
	}
});

plugin.postcss = true;

export default plugin;
