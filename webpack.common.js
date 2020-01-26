const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  plugins: [
    new CopyPlugin([
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
    ])
  ],
  module: {
    rules: [
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
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]'
            outputPath: 'assets/img'
          }
        }
      }
    ]
  }
};
