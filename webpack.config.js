/* eslint-disable */  // --> OFF
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';

var frontendConfig = {
	devtool: debug ? "inline-source-map" : false,
	entry: {
		main: ['./src/frontend/js/main.js', './src/frontend/styles/main.scss']
	},
	output: {
			path: path.resolve(__dirname, 'compiled/public/compiled'),
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
			port: 3000, // you can specify the port here
						 // can't use the same port that nodemon uses.
			 proxy: {
					 target: 'localhost:9000', // original port
					 ws: true // enables websockets
			 }
		})
	]
}

var serverConfig = {
	target: 'node',
	devtool: debug ? "inline-source-map" : false,
	entry: {
		main: ['./src/server/index.js'],
	},
	output: {
			path: path.resolve(__dirname, 'compiled/server'),
			filename: 'index.js',
			publicPath: './'
	},
	module: {
		loaders: [
			{
					test: /\.js$/,
					query: {
						presets: [
							["env", { "modules": false }]
						],
						babelrc: false,
					},
					exclude: '/node_modules',
					loader: 'babel-loader',
			}
		]
	}
};

module.exports = [
	serverConfig,
	frontendConfig
];
