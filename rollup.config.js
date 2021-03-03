/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { babel } from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [
        babel({
            babelHelpers: 'bundled',
            plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]]
        }),
    ],
    external: [
        '@lwc/engine',
        '@lwc/wire-service'
    ],
    output: [
        {
            format: 'es',
            file: 'dist/wire-service-jest-util.es.js',
        },
        {
            format: 'cjs',
            file: 'dist/wire-service-jest-util.common.js'
        }
    ]
};
