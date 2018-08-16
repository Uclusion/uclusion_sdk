path = require('path');
module.exports = {
    entry: './src/uclusion.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'bundle.web.js',
        library: 'uclusion',
        libraryTarget: 'umd'
    }
};