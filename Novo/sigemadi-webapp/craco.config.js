module.exports = {
    devServer: {
        proxy: {
            '/sigemadi/api':{
                target: 'https://10.62.73.49:8443',
                pathRewrite: { '^/api': '/sigemadi/api/'}
            }
        }
    }
}