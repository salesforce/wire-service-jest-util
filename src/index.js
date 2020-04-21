/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { register } from '@lwc/engine';
import { registerWireService } from '@lwc/wire-service';
import createLdsAdapter from './adapters/lds';
import createGenericAdapter from './adapters/generic';
import createApexAdapter from './adapters/apex';

let registered = false;

// Not needed since lwc >= 1.5.0
function ensureWireServiceRegistered() {
    if (!registered) {
        registerWireService(register);
        registered = true;
    }
}


function validateAdapterId(adapterId) {
    if (!adapterId) {
        throw new Error('No adapter specified');
    }
}

function registerLdsTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    ensureWireServiceRegistered();

    return createLdsAdapter(identifier);
}

function registerApexTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    ensureWireServiceRegistered();

    return createApexAdapter(identifier);
}

function registerTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    ensureWireServiceRegistered();

    return createGenericAdapter(identifier);
}

export {
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
};