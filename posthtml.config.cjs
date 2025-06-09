const include = require('posthtml-include');

module.exports = {
    plugins: [
        include({ root: './src' }),
    ],
};
