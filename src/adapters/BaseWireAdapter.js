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
// export default function BaseWireAdapter(dataCallback, { onUpdate, onConnect, onDisconnect }) {
//     this._dataCallback = dataCallback;
//     this._onUpdate = onUpdate;
//     this._onConnect = onConnect;
//     this._onDisconnect = onDisconnect;
// }
//
// BaseWireAdapter.prototype.update = function (config) {
//     this._onUpdate(config);
// };
//
// BaseWireAdapter.prototype.connect = function () {
//     this._onConnect();
// };
//
// BaseWireAdapter.prototype.disconnect = function () {
//     this._onDisconnect();
// };
//
// BaseWireAdapter.prototype.emit = function (value) {
//     this._dataCallback(value);
// };
