/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import createLdsAdapter from './adapters/lds';
import createGenericAdapter from './adapters/generic';
import createApexAdapter from './adapters/apex';

function validateAdapterId(adapterId) {
    if (!adapterId) {
        throw new Error('No adapter specified');
    }
}

function registerLdsTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    return createLdsAdapter(identifier);
}

function registerApexTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    return createApexAdapter(identifier);
}

function registerTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    return createGenericAdapter(identifier);
}

export {
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
};