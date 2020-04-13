/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import WireAdapter from "./WireAdapter";

export default function createAdapter(adapterId) {
    let done = false;
    let lastConfig;
    const wiredEventTargets = [];

    const emit = (value) => {
        if (!done) {
            wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.emit({ data: value, error: undefined }));
        }
    };

    const error = (body, status, statusText) => {
        if (!done) {
            done = true;

            if (status && (status < 400 || status > 599)) {
                throw new Error("'status' must be >= 400 or <= 599");
            }

            body = body || {
                message: 'An internal server error has occurred',
            };

            status = status || 400;

            statusText = statusText || 'Bad Request';

            const err = {
                body,
                ok: false,
                status,
                statusText,
            };

            wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.emit({ data: undefined, error: err }));
        }
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

    const adapter = adapterId.adapter ? adapterId.adapter : adapterId;

    adapter.mockReset();
    adapter.mockImplementation(function(dataCallback) {
        done = false;

        const wireAdapterInstance = new WireAdapter(dataCallback, {
            onConnect: (adapterInstance) => {
                done = false;
                lastConfig = {};
                add(wiredEventTargets, adapterInstance);
            },
            onUpdate: (newConfig) => {
                lastConfig = newConfig;
            },
            onDisconnect: (adapterInstance) => {
                done = true;
                lastConfig = undefined;
                const idx = wiredEventTargets.indexOf(adapterInstance);
                if (idx > -1) {
                    wiredEventTargets.splice(idx, 1);
                }
            }
        });

        add(wiredEventTargets, wireAdapterInstance);
        dataCallback({ data: undefined, error: undefined });

        return wireAdapterInstance;
    });

    return {
        emit,
        error,
        getLastConfig
    };
}
