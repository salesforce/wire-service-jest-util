/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/* eslint-env node */

module.exports = {
    preset: '@lwc/jest-preset',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '@salesforce/wire-service-jest-util': '<rootDir>/src/',
        '^(example)/(.+)$': '<rootDir>/test/modules/$1/$2/$2',
    },
    collectCoverageFrom: ['src/**', '!**/__tests__/**'],
    coverageReporters: ['text', 'text-summary'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 70,
            lines: 75,
            statements: 75
        },
    },
};