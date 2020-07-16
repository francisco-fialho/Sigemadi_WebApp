module.exports = {
    devServer: {
        proxy: {
            '/sigemadi/api':{
                target: 'https://localhost:8443',
                pathRewrite: { '^/api': '/sigemadi/api/'}
            }
        }
    }
}