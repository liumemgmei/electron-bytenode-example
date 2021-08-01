const { BytenodeWebpackPlugin } = require('@herberttn/bytenode-webpack-plugin');
const rules = require('./webpack.rules');
const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    // {
    //   loader: require.resolve('style-loader'),
    //   options: {
    //     singleton: true,
    //   },
    // },
    isEnvDevelopment && require.resolve("style-loader"),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith(".")
        ? { publicPath: "../../" }
        : {},
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009",
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          lessOptions: {
            // modifyVars: require('../theme.json'),
            javascriptEnabled: true,
          },
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

/** @type {import(‘@types/webpack’).Configuration} */
module.exports = {
  output: { devtoolModuleFilenameTemplate: '[absolute-resource-path]' },
  resolve:{
    extensions: [
      ".tsx",
      ".ts",
      ".mjs",
      ".js",
      ".jsx",
      ".vue",
      ".json",
      ".wasm"
    ],
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        // use: getStyleLoaders(
        //   {
        //     importLoaders: 3
        //     // sourceMap: isEnvProduction && shouldUseSourceMap,
        //   },
        //   "less-loader"
        // ),
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          }
        ],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
    ],
  },

  plugins: [
    new BytenodeWebpackPlugin({ compileForElectron: true }),
  ],
};
