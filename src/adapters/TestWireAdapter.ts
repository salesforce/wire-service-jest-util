/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export interface HttpFetchResponse {
    body: any;
    status: number;
    statusText: string;
}

export class TestWireAdapterTemplate {
    static _lastConfig: Record<string, any> | null = null;
    static _wireInstances = new Set<TestWireAdapterTemplate>();

    static emit(value: any, filterFn?: (config: Record<string, any>) => boolean) {
        let instances = Array.from(this._wireInstances);

        if (typeof filterFn === 'function') {
            instances = instances.filter((instance) => filterFn(instance.getConfig()));
        }

        instances.forEach((instance) => instance.emit(value));
    }

    static getLastConfig() {
        return this._lastConfig;
    }

    _dataCallback;
    config = {};

    constructor(dataCallback: (value: any) => void) {
        this._dataCallback = dataCallback;
        (this.constructor as typeof TestWireAdapterTemplate)._wireInstances.add(this);
    }

    update(config: Record<string, any>) {
        this.config = config;
        (this.constructor as typeof TestWireAdapterTemplate)._lastConfig = config;
    }

    connect() {
        (this.constructor as typeof TestWireAdapterTemplate)._lastConfig = {};
        (this.constructor as typeof TestWireAdapterTemplate)._wireInstances.add(this);
    }

    disconnect() {
        (this.constructor as typeof TestWireAdapterTemplate)._wireInstances.delete(this);
    }

    emit(value: any) {
        this._dataCallback(value);
    }

    getConfig() {
        return this.config;
    }
}

export function buildTestWireAdapter() {
    return class TestWireAdapter extends TestWireAdapterTemplate {
        static _lastConfig = null;
        static _wireInstances = new Set<TestWireAdapter>();
    };
}
