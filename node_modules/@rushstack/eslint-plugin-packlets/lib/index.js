"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const mechanics_1 = require("./mechanics");
const circular_deps_1 = require("./circular-deps");
const readme_1 = require("./readme");
const plugin = {
    rules: {
        // Full name: "@rushstack/packlets/mechanics"
        mechanics: mechanics_1.mechanics,
        // Full name: "@rushstack/packlets/circular-deps"
        'circular-deps': circular_deps_1.circularDeps,
        readme: readme_1.readme
    },
    configs: {
        recommended: {
            plugins: ['@rushstack/eslint-plugin-packlets'],
            rules: {
                '@rushstack/packlets/mechanics': 'warn',
                '@rushstack/packlets/circular-deps': 'warn',
                '@rushstack/packlets/readme': 'off'
            }
        }
    }
};
module.exports = plugin;
//# sourceMappingURL=index.js.map