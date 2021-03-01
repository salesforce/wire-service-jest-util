/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Provides temporary backward compatibility for wire-protocol reform (lwc > 1.5.0). This code
// should be removed once all adapters are migrated to the the API.
const wireAdaptersRegistryHack = global.wireAdaptersRegistryHack || new Map();

export function deprecatedRegisterAdapter(adapterId, adapterObserver) {
    const spy = {
        createInstance(wiredEventTarget) {
            adapterObserver.onCreate(wiredEventTarget);
        },
        connect(wiredEventTarget) {
            adapterObserver.onConnect(wiredEventTarget);
        },
        update(wiredEventTarget, config) {
            adapterObserver.onUpdate(wiredEventTarget, config);
        },
        disconnect(wiredEventTarget) {
            adapterObserver.onDisconnect(wiredEventTarget)
        }
    };

    const relatedAdapter = wireAdaptersRegistryHack.get(adapterId);

    if (relatedAdapter) {
        relatedAdapter.adapter.spyAdapter(spy);
    }
}