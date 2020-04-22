/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { spyOnAdapter } from './utils';

export default function createAdapter(adapterId) {
    let lastConfig;
    const wiredEventTargets = new Set();
    const spy = {
        createInstance(wiredEventTarget) {
            wiredEventTargets.add(wiredEventTarget);
        },
        connect(wiredEventTarget) {
            lastConfig = {};
            wiredEventTargets.add(wiredEventTarget);
        },
        update(wiredEventTarget, config) {
            lastConfig = config;
        },
        disconnect(wiredEventTarget) {
            lastConfig = undefined;
            wiredEventTargets.delete(wiredEventTarget);
        }
    };

    spyOnAdapter(spy, adapterId);

    return {
        emit(value) {
            wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.emit(value));
        },
        getLastConfig() {
            return lastConfig;
        }
    };
}
