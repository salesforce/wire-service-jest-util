/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export class ObservableTestWireAdapter {
    _dataCallback;
    config = {};

    constructor(dataCallback, observer) {
        this._dataCallback = dataCallback;
        this.observer = observer;

        this.observer.onCreate(this);
    }

    update(config) {
        this.config = config;
        this.observer.onUpdate(this, config);
    }

    connect() {
        this.observer.onConnect(this);
    }

    disconnect() {
        this.observer.onDisconnect(this);
    }

    emit(value) {
        this._dataCallback(value);
    }
}