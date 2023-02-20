/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
export class TestWireAdapterTemplate {
    static _lastConfig = null;
    static _wireInstances = new Set();

    static emit(value, filterFn) {
        let instances = Array.from(this._wireInstances);

        if (typeof filterFn === 'function') {
            instances = instances.filter((instance) => filterFn(instance.getConfig()));
        }

        instances.forEach((instance) => instance.emit(value));
    }

    static getLastConfig() {
        return this._lastConfig;
    }

    static resetLastConfig() {
        this._lastConfig = null;
    }

    _dataCallback;
    config = {};

    constructor(dataCallback) {
        this._dataCallback = dataCallback;
        this.constructor._wireInstances.add(this);
    }

    update(config) {
        this.config = config;
        this.constructor._lastConfig = config;
    }

    connect() {
        this.constructor._lastConfig = {};
        this.constructor._wireInstances.add(this);
    }

    disconnect() {
        this.constructor._wireInstances.delete(this);
    }

    emit(value) {
        this._dataCallback(value);
    }

    getConfig() {
        return this.config;
    }
}

export function buildTestWireAdapter() {
    return class TestWireAdapter extends TestWireAdapterTemplate {
        static _lastConfig = null;
        static _wireInstances = new Set();
    }
}
