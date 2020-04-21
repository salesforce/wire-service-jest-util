/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { register, ValueChangedEvent } from '@lwc/wire-service';

const wireAdaptersRegistryHack = global.wireAdaptersRegistryHack || new Map();

function createLegacyAdapter(adapterId, spy) {
    register(adapterId, (wiredEventTarget) => {
        const instance = {
            emit(value) {
                wiredEventTarget.dispatchEvent(new ValueChangedEvent(value));
            }
        };
        spy.createInstance(instance);

        wiredEventTarget.addEventListener('connect', () => {
            spy.connect(instance);
        });

        wiredEventTarget.addEventListener('disconnect', () => {
            spy.disconnect(instance);
        });

        wiredEventTarget.addEventListener('config', (newConfig) => {
            spy.update(instance, newConfig);
        });
    });
}

export function spyOnAdapter(spy, adapterId) {
    const relatedAdapter = wireAdaptersRegistryHack.get(adapterId);

    if (!relatedAdapter) {
        createLegacyAdapter(adapterId, spy);
    } else {
        relatedAdapter.adapter.spyAdapter(spy);
    }
}