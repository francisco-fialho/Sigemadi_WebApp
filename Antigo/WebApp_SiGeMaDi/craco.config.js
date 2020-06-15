module.exports = {
    devServer: {
        proxy: {
            '/sigemadi/api':{
                target: 'http://localhost:8080',
                pathRewrite: { '^/api': '/sigemadi/api/'}
            }
        }
    }
}