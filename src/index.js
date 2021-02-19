/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ObservableTestWireAdapter } from "./ObservableTestWireAdapter";
import { ApexWireAdapterObserver } from "./observers/ApexWireAdapterObserver";
import { LdsWireAdapterObserver } from "./observers/LdsWireAdapterObserver";
import { TestWireAdapterObserver } from "./observers/TestWireAdapterObserver";
import { registerAdapter } from "./utils";

const WIRE_ADAPTER_MOCK_MARK = '$wire_adapter_mock$';
const MIGRATION_LINK = 'https://github.com/salesforce/wire-service-jest-util/blob/master/README.md##migrating-from-version-2x-to-3x.';

function getMigrationMessageFor(registerFnName) {
    return `${registerFnName} is deprecated. More details: ${MIGRATION_LINK}`;
}

function validateAdapterId(adapterId) {
    if (!adapterId) {
        throw new Error('No adapter specified');
    }
}

function isWireAdapterMock(adapter) {
    return !!adapter[WIRE_ADAPTER_MOCK_MARK];
}

/**
 * @deprecated
 */
function registerLdsTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerLdsTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const spy = new LdsWireAdapterObserver();

        registerAdapter(identifier, spy);

        return spy;
    }

    return identifier;
}

/**
 * @deprecated
 */
function registerApexTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerApexTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const spy = new ApexWireAdapterObserver();

        registerAdapter(identifier, spy);

        return spy;
    }

    return identifier;
}

/**
 * @deprecated
 */
function registerTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const spy = new TestWireAdapterObserver();

        registerAdapter(identifier, spy);

        return spy;
    }

    return identifier;
}

function createWireAdapterMock(fn, adapterObserver) {
    const adapterMock = typeof fn === "function" ? fn : function(){};

    adapterMock.adapter = function (dataCallback) {
        return new ObservableTestWireAdapter(
            dataCallback,
            adapterObserver
        );
    };

    adapterMock[WIRE_ADAPTER_MOCK_MARK] = true;
    adapterMock.emit = (...args) => adapterObserver.emit(...args);
    if (adapterObserver.error) {
        adapterMock.error = (...args) => adapterObserver.error(...args);
        adapterMock.emitError = (...args) => adapterObserver.emitError(...args);
    }
    adapterMock.getLastConfig = () => adapterObserver.getLastConfig();

    return adapterMock;
}

function createApexTestWireAdapter(fn) {
    return createWireAdapterMock(fn, new ApexWireAdapterObserver());
}

function createLdsTestWireAdapter(fn) {
    return createWireAdapterMock(fn, new LdsWireAdapterObserver());
}

function createTestWireAdapter(fn) {
    return createWireAdapterMock(fn, new TestWireAdapterObserver());
}

export {
    createApexTestWireAdapter,
    createLdsTestWireAdapter,
    createTestWireAdapter,

    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
};
