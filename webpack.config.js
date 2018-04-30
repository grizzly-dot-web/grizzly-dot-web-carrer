/* eslint-disable */  // --> OFF
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';

var frontendConfig = {
	name: 'Frontend side Changes',
	mode: debug ? 'development' : 'production',
	devtool: debug ? "cheap-source-map" : false,
	entry: {
		main: ['./src/frontend/ts/main.tsx']
	},
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
	output: {
			path: path.resolve(__dirname, 'compiled/public/compiled'),
			filename: 'main.js',
			publicPath: './'
	},
	module: {
		rules: [
			{
				// Include ts, tsx, and js files.
				test: /((?!backend).).*\.(js|tsx?)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(css|scss)/,
				use: ['style-loader', 'css-loader?url=false', 'sass-loader?url=false']
			}
		]
	},
	plugins: [
		new BrowserSyncPlugin({
			port: 3000, 
			proxy: {
				target: 'localhost:9000', // nodemon port
				ws: true
			}
		})
	]
}

var backendConfig = {
	name: 'Server side Changes',
	mode: debug ? 'development' : 'production',
	target: 'node',
	entry: {
		main: ['./src/backend/index.ts'],
	},
	output: {
			path: path.resolve(__dirname, 'compiled/backend'),
			filename: 'index.js',
			publicPath: './'
	},
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
	module: {
		rules: [
			{
				test: /((?!frontend).).*\.(js|tsx?)$/,
				query: {
					presets: [
						["@babel/env", { "modules": false }]
					],
					babelrc: false,
				},
				exclude: /node_modules/,
				loader: 'babel-loader',
			}
		]
	}
};

module.exports = [ frontendConfig, backendConfig];
