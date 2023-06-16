module.exports = [
  {
    test: /\.js$/,
    use: [{
      loader: 'babel-loader'
    }],
    exclude: /node_modules(?!(\/|\\).*(weex).*)/
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.vue(\?[^?]+)?$/,
    use: 'weex-loader',
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          outputPath: 'assets',
          publicPath: './assets',
        },
      },
    ],
  },
]
