/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Provides temporary backward compatibility for wire-protocol reform (lwc > 1.5.0). This code
// should be removed once all adapters are migrated to the the API.
const wireAdaptersRegistryHack = global.wireAdaptersRegistryHack || new Map();

export function deprecatedRegisterAdapter(adapterId, TestWireAdapter) {
    const eventTargetToAdapterMap = new WeakMap();

    const spy = {
        createInstance(wiredEventTarget) {
            eventTargetToAdapterMap.set(
                wiredEventTarget,
                new TestWireAdapter(data => wiredEventTarget.emit(data))
            );
        },
        connect(wiredEventTarget) {
            const wireInstance = eventTargetToAdapterMap.get(wiredEventTarget);

            if (wireInstance) {
                wireInstance.connect();
            }
        },
        update(wiredEventTarget, config) {
            const wireInstance = eventTargetToAdapterMap.get(wiredEventTarget);

            if (wireInstance) {
                wireInstance.update(config);
            }
        },
        disconnect(wiredEventTarget) {
            const wireInstance = eventTargetToAdapterMap.get(wiredEventTarget);

            if (wireInstance) {
                wireInstance.disconnect();
            }
        }
    };

    const relatedAdapter = wireAdaptersRegistryHack.get(adapterId);

    if (relatedAdapter) {
        relatedAdapter.adapter.spyAdapter(spy);
    }
}