module.exports = {
    devServer: {
        proxy: {
            '/sigemadi/api':{
                target: 'http://localhost:8085',
                pathRewrite: { '^/api': '/sigemadi/api/'}
            }
        }
    }
}