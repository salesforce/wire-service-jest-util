/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    plugins: [
        typescript(),
        babel({
            babelHelpers: 'bundled',
            plugins: [['@babel/plugin-proposal-class-properties']],
        }),
    ],
    output: [
        {
            format: 'es',
            file: 'dist/wire-service-jest-util.es.js',
        },
        {
            format: 'cjs',
            file: 'dist/wire-service-jest-util.common.js',
        },
    ],
};
