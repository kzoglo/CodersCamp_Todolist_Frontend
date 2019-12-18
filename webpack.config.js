const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-runtime'],
              ['@babel/plugin-transform-regenerator']
            ]
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
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.mst$/,
        use: [
          {
            loader: 'mustache-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    //user
    new HtmlWebpackPlugin({
      template: './src/modules/users/templates/login.mst',
      filename: 'login.mst'
    }),
    new HtmlWebpackPlugin({
      template: './src/modules/users/templates/register.mst',
      filename: 'register.mst'
    }),
    new HtmlWebpackPlugin({
      template: './src/modules/users/templates/showDetails.mst',
      filename: 'showDetails.mst'
    }),
    //tasks
    new HtmlWebpackPlugin({
      template: './src/modules/tasks/templates/addTask/addTask.mst',
      filename: 'addTask.mst'
    }),
    new HtmlWebpackPlugin({
      template: './src/modules/tasks/templates/tasksList/tasksList.mst',
      filename: 'tasksList.mst'
    }),
    //projects
    new HtmlWebpackPlugin({
      template: './src/modules/projects/templates/addProject.mst',
      filename: 'addProject.mst'
    }),
    //members
    new HtmlWebpackPlugin({
      template: './src/modules/members/templates/addMember.mst',
      filename: 'addMember.mst'
    }),
    //index
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    port: 9000
  }
};
