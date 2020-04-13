/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import WireAdapter from "./WireAdapter";

export default function createAdapter(adapterId) {
    let lastConfig;
    const wiredEventTargets = [];

    const emit = (value) => {
        wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.emit(value));
    };

    const getLastConfig = () => {
        return lastConfig;
    };

    const add = (arr, item) => {
        const idx = arr.indexOf(item);
        if (idx === -1) {
            arr.push(item);
        }
    };

    // @todo: maybe we shouldn't allow other mocks that are not those returned by createWireAdapterMock.
    const adapter = adapterId.adapter ? adapterId.adapter : adapterId;

    adapter.mockReset();
    adapter.mockImplementation(function(dataCallback) {
        const wireAdapterInstance = new WireAdapter(dataCallback, {
            onConnect: (adapterInstance) => {
                lastConfig = {};
                add(wiredEventTargets, adapterInstance);
            },
            onUpdate: (newConfig) => {
                lastConfig = newConfig;
            },
            onDisconnect: (adapterInstance) => {
                lastConfig = undefined;
                const idx = wiredEventTargets.indexOf(adapterInstance);
                if (idx > -1) {
                    wiredEventTargets.splice(idx, 1);
                }
            }
        });

        add(wiredEventTargets, wireAdapterInstance);

        return wireAdapterInstance;
    });

    return {
        emit,
        getLastConfig
    };
}
