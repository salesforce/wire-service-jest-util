#!/usr/bin/env node

/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { execaSync } = require('execa');
const isCI = require('is-ci');

const ARGS = [
    // https://github.com/lerna/lerna/tree/master/commands/publish
    'publish',
    // Publish as public
    '--access public',
    // Explicitly set registry
    '--registry=https://registry.npmjs.org',
];

if (!isCI) {
    console.error('This script is only meant to run in CI.');
    process.exit(1);
}

try {
    execaSync('npm', ARGS, {
        // Prioritize locally installed binaries (node_modules/.bin)
        preferLocal: true,
        stdio: 'inherit',
    });
} catch (ex) {
    console.error(ex);
    process.exit(1);
}
