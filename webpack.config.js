var path = require('path'),
	webpack = require('webpack'),
	entry = require('./amp-config').wpentry,
	WebpackDevServer = require('webpack-dev-server');

module.exports = {
	entry: entry,
	output: {
		path: path.resolve(__dirname, './release/js'),
		publicPath: '/js/',
		filename: '[name].js'
	},
	devServer : {
		inline: true,
		port: 3333,
		contentBase: './release',
		publicPath: '/js/',
		hot: true,
		historyApiFallback: true,
		stats: {
			colors: true
		}
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['es2015','react','stage-2'],
					plugins: ['transform-decorators-legacy']
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['es2015','react','stage-2'],
					plugins: ['transform-decorators-legacy']
				}
			}
		]
	},
	resolve: {
		modules: [
			path.join(__dirname, 'node_modules'),
			'node_modules',
			'source/js/modules/',
			'source/js/components/'
		]
		//extensions: ['.js', '.jsx']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	devtool: 'eval'
};
