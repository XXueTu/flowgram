"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.importExpression = exports.requireCallExpression = exports.jestCallExpression = void 0;
const tree_pattern_1 = require("@rushstack/tree-pattern");
// Matches a statement expression like this:
//   jest.mock('./thing')
//
// Tree:
//   {
//     type: 'CallExpression',
//     callee: {
//       type: 'MemberExpression',
//       object: {
//         type: 'Identifier',
//         name: 'jest'
//       },
//       property: {
//         type: 'Identifier',
//         name: 'mock'
//       }
//     },
//     arguments: [
//       {
//         type: 'Literal',
//         value: './thing'
//       }
//     ]
//   };
exports.jestCallExpression = new tree_pattern_1.TreePattern({
    type: 'CallExpression',
    callee: {
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: 'jest'
        },
        property: {
            type: 'Identifier',
            name: tree_pattern_1.TreePattern.tag('methodName')
        }
    }
});
// Matches require() in a statement expression like this:
//   const x = require("package-name");
exports.requireCallExpression = new tree_pattern_1.TreePattern({
    type: 'CallExpression',
    callee: {
        type: 'Identifier',
        name: 'require'
    }
});
// Matches import in a statement expression like this:
//   const x = import("package-name");
exports.importExpression = new tree_pattern_1.TreePattern({
    type: 'ImportExpression',
    source: {
        type: 'Literal'
    }
});
//# sourceMappingURL=hoistJestMockPatterns.js.map