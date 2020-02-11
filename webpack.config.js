const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const ROOT = {
    from: path.resolve(__dirname, 'src'),
    to: path.resolve(__dirname, 'dist'),
    port: 8081
};
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const jsLoader = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env'
                ]
            }
        }
    ];

    if(isDev) {
        loaders.push('eslint-loader')
    }

    return loaders;
};

module.exports = {
    context: ROOT.from,
    entry: {
        main: ['@babel/polyfill', './index.js'],
    },
    output: {
        filename: filename('js'),
        path: ROOT.to,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        port: ROOT.port,
        noInfo: true,
        open: true,
        overlay: {
            warnings: true,
            errors: true
        }
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [
        new HTMLWebpackPlugin({
            template: './template/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(ROOT.from, 'static'),
                to: ROOT.to
            }
        ]),
        new MiniCSSExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [
                    'html-loader',
                    'markup-inline-loader',
                ],
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: "pug-loader",
                        options: {
                            pretty: isDev,
                        }
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                            sourceMap: isDev,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDev,
                            ident: 'postcss',
                            plugins: () => [
                                postcssPresetEnv({
                                    browsers: 'last 2 versions',
                                    autoprefixer: { grid: true }
                                })
                            ]
                        }
                    },
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                            sourceMap: isDev,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDev,
                            ident: 'postcss',
                            plugins: () => [
                                postcssPresetEnv({
                                    browsers: 'last 2 versions',
                                    autoprefixer: { grid: true }
                                })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                exclude: /fonts/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images',
                            publicPath: 'images',
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(otf|ttf|woff|woff2|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts',
                        }
                    }
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoader()
            },
        ]
    }
};