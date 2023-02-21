/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
export function generateAdapter() {
  let lastConfig = null;
  const wireInstances = new Set(); 

  return class TestWireAdapterTemplate {
    static emit(value, filterFn) {
        let instances = Array.from(wireInstances);

        if (typeof filterFn === 'function') {
            instances = instances.filter((instance) => filterFn(instance.getConfig()));
        }

        instances.forEach((instance) => instance.emit(value));
    }

    static getLastConfig() {
        return lastConfig;
    }

    static resetLastConfig() {
        lastConfig = null;
    }

    _dataCallback;
    config = {};

    constructor(dataCallback) {
        this._dataCallback = dataCallback;
        wireInstances.add(this);
    }

    update(config) {
        this.config = config;
        lastConfig = config;
    }

    connect() {
        lastConfig = {};
        wireInstances.add(this);
    }

    disconnect() {
        wireInstances.delete(this);
    }

    emit(value) {
        this._dataCallback(value);
    }

    getConfig() {
        return this.config;
    }
  }
}