const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              esModule: false,
              outputPath: 'assets/img/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //index
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        removeComments: false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/modules/projects/templates/addProject.mst',
        to: 'modules/projects/templates/'
      },
      {
        from: 'src/modules/tasks/templates/addTask/addTask.mst',
        to: 'modules/tasks/templates/addTask/',
        flatten: true
      },
      {
        from: 'src/modules/tasks/templates/tasksList/tasksList.mst',
        to: 'modules/tasks/templates/tasksList/',
        flatten: true
      },
      {
        from: 'src/modules/users/templates/*.mst',
        to: 'modules/users/templates/',
        flatten: true
      }
    ]),
    new CleanWebpackPlugin()
  ],
  devServer: {
    port: 9000
  }
};
