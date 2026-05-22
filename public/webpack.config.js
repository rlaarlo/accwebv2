const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const { execSync } = require('child_process');

function safeGit(cmd, fallback) {
	try {
		return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
	} catch (e) {
		return fallback;
	}
}

const APP_VERSION = process.env.APP_VERSION
	|| safeGit('git describe --tags --abbrev=0', 'dev');
const APP_COMMIT = process.env.APP_COMMIT
	|| safeGit('git rev-parse --short HEAD', 'unknown');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: __dirname+'/dist',
		filename: 'build.js',
		publicPath: 'dist'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					js: 'babel-loader'
				}
			},
			{
				resourceQuery: /blockType=i18n/,
				loader: '@kazupon/vue-i18n-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
			{
				test: /\.s[a|c]ss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	},
	watchOptions: {
		poll: true
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			__APP_VERSION__: JSON.stringify(APP_VERSION),
			__APP_COMMIT__:  JSON.stringify(APP_COMMIT)
		})
	]
}
