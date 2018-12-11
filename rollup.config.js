/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const baseRollupConfig = {
    input: 'src/index.js',
    plugins: []
};

const moduleName = 'wire-service-jest-util';

function rollupConfig(format) {
    let formatSuffix = '';
    if (format === 'cjs') {
        formatSuffix = '.common';
    } else if (format === 'es') {
        formatSuffix = '.es';
    }

    const targetName = [
        'dist/',
        moduleName,
        formatSuffix,
        '.js'
    ].join('');

    return Object.assign({}, baseRollupConfig, {
        output: {
            'file': targetName,
            format
        }});
}

export default [
    rollupConfig('es'),
    rollupConfig('cjs')
];
