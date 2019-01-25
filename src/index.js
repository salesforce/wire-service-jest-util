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

// will not be necessary once wire-service is self-registering (W-4844671)
function ensureWireServiceRegistered() {
    if (!registered) {
        registerWireService(register);
        registered = true;
    }
}

function registerLdsTestWireAdapter(identifier) {
    if (!identifier) {
        throw new Error('No adapter specified');
    }

    ensureWireServiceRegistered();

    return createLdsAdapter(identifier);
}

function registerApexTestWireAdapter(identifier) {
    if (!identifier) {
        throw new Error('No adapter specified');
    }

    ensureWireServiceRegistered();

    return createApexAdapter(identifier);
}

function registerTestWireAdapter(identifier) {
    if (!identifier) {
        throw new Error('No adapter specified');
    }

    ensureWireServiceRegistered();

    return createGenericAdapter(identifier);
}

export {
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
};