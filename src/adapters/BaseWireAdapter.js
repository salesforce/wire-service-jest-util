/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export default class BaseWireAdapter {
    constructor(dataCallback, { onUpdate, onConnect, onDisconnect }) {
        this._dataCallback = dataCallback;
        this._onUpdate = onUpdate;
        this._onConnect = onConnect;
        this._onDisconnect = onDisconnect;
    }

    update(config) {
        this._onUpdate(config);
    }

    connect() {
        this._onConnect();
    }

    disconnect() {
        this._onDisconnect();
    }

    emit(value) {
        this._dataCallback(value);
    }

}
