module.exports = {
    devServer: {
        proxy: {
            '/sigemadi/api':{
                target: 'https://localhost:8085',
                pathRewrite: { '^/api': '/sigemadi/api/'}
            }
        }
    }
}