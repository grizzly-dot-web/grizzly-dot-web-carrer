/* eslint-disable */  // --> OFF
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
	devtool: debug ? "inline-source-map" : false,
	entry: {
		main: ['./src/js/main.js', './src/styles/main.scss'],
	},
	output: {
		path: path.resolve(__dirname, 'dest'),
		filename: 'main.js',
		publicPath: './'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.(css|scss)/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader?url=false', 'sass-loader?url=false']
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('main.css'),
		new BrowserSyncPlugin({
			port: 3000,
			server: { baseDir: ['.'] }
		})
	],
};
