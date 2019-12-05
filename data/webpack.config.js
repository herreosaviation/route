var path = require("path");
module.exports = {
    entry: "./main.ts",
    module: {
        rules: [{
                use: 'ts-loade',
                exclude: /node_modules/
            }]
    },
    resolve: {
        extensions: [
            ".ts", ".js"
        ]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    }
};
