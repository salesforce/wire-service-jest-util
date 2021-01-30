/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export class TestWireAdapterObserver {
    wiredInstances = new Set();
    _lastConfig = null;

    onCreate() {}

    onUpdate(instance, config) {
        this._lastConfig = config;
    }

    onConnect(instance) {
        this._lastConfig = {};
        this.wiredInstances.add(instance);
    }

    onDisconnect(instance) {
        this._lastConfig = undefined;
        this.wiredInstances.delete(instance);
    }

    emit(value, filterFn) {
        let instances = Array.from(this.wiredInstances);

        if (typeof filterFn === 'function') {
            instances = instances.filter((instance) => filterFn(instance.getConfig()));
        }

        instances.forEach((instance) => instance.emit(value));
    }

    getLastConfig() {
        return this._lastConfig;
    }
}