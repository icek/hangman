/*
 *
 *        ______      __  ______          __
 *       / ____/___ _/ /_/ ____/___  ____/ /__
 *      / /_  / __ `/ __/ /   / __ \/ __  / _ \
 *     / __/ / /_/ / /_/ /___/ /_/ / /_/ /  __/
 *    /_/    \__,_/\__/\____/\____/\__,_/\___/
 *
 *  Copyright (c) 2017 FatCode Grzegorz Michlicki
 *
 */

module.exports = {
    map: true,
    plugins: [
        require('autoprefixer')({
            browsers: [
                "> 1%",
                "last 2 versions",
                "IE >= 10"
            ]
        }),
        require("css-mqpacker")()
    ]
};
