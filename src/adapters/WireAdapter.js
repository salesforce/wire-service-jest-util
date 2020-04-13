export default function WireAdapter(dataCallback, { onUpdate, onConnect, onDisconnect }) {
    this._dataCallback = dataCallback;
    this._onUpdate = onUpdate;
    this._onConnect = onConnect;
    this._onDisconnect = onDisconnect;
}

WireAdapter.prototype.update = function (config) {
    this._onUpdate(config);
};

WireAdapter.prototype.connect = function () {
    this._onConnect();
};

WireAdapter.prototype.disconnect = function () {
    this._onDisconnect();
};

WireAdapter.prototype.emit = function (value) {
    this._dataCallback(value);
};
