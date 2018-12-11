/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { register, ValueChangedEvent } from '@lwc/wire-service';

export default function createAdapter(adapterId) {
    let done = false;
    let lastConfig;
    const wiredEventTargets = [];

    const emit = (value) => {
        if (!done) {
            wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: value, error: undefined })));
        }
    };

    const error = (err) => {
        if (!done) {
            done = true;
            wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error: err })));
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

    register(adapterId, (wiredEventTarget) => {
        done = false;
        add(wiredEventTargets, wiredEventTarget);
        wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error: undefined }));

        wiredEventTarget.addEventListener('connect', () => {
            done = false;
            lastConfig = {};
            add(wiredEventTargets, wiredEventTarget);
        });

        wiredEventTarget.addEventListener('disconnect', () => {
            done = true;
            lastConfig = undefined;
            const idx = wiredEventTargets.indexOf(wiredEventTarget);
            if (idx > -1) {
                wiredEventTargets.splice(idx, 1);
            }
        });

        wiredEventTarget.addEventListener('config', (newConfig) => {
            lastConfig = newConfig;
        });
    });

    return {
        emit,
        error,
        getLastConfig
    };
}
