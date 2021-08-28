module.exports = {
    publicPath: process.env.USE_SUB_FOLDER === '1' ? '/hidden-jvc-website/' : '/',
    devServer: {
        disableHostCheck: true
    }
};
