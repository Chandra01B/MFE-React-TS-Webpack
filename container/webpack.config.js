const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // only add this if you don't have yet
const { ModuleFederationPlugin } = webpack.container;
const deps = require('./package.json').dependencies;

const buildDate = new Date().toLocaleString();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  console.log({ isProduction });
  return {
    entry: './src/index.ts',
    mode: process.env.NODE_ENV || 'development',
    devServer: {
      port: 3000,
      open: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },

    plugins: [
      new webpack.EnvironmentPlugin({ BUILD_DATE: buildDate }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new ModuleFederationPlugin({
        name: 'container',
        remotes: { },
        shared: {
          ...deps,
          react: {
            singleton: true,
            eager:true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            eager:true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };
};