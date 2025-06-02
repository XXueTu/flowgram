"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const hoist_jest_mock_1 = require("./hoist-jest-mock");
const no_new_null_1 = require("./no-new-null");
const no_null_1 = require("./no-null");
const no_untyped_underscore_1 = require("./no-untyped-underscore");
const typedef_var_1 = require("./typedef-var");
const plugin = {
    rules: {
        // Full name: "@rushstack/hoist-jest-mock"
        'hoist-jest-mock': hoist_jest_mock_1.hoistJestMock,
        // Full name: "@rushstack/no-new-null"
        'no-new-null': no_new_null_1.noNewNullRule,
        // Full name: "@rushstack/no-null"
        'no-null': no_null_1.noNullRule,
        // Full name: "@rushstack/no-untyped-underscore"
        'no-untyped-underscore': no_untyped_underscore_1.noUntypedUnderscoreRule,
        // Full name: "@rushstack/typedef-var"
        'typedef-var': typedef_var_1.typedefVar
    }
};
module.exports = plugin;
//# sourceMappingURL=index.js.map