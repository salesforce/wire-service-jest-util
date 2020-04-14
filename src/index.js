/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import createLdsAdapter from './adapters/lds';
import createGenericAdapter from './adapters/generic';
import createApexAdapter from './adapters/apex';
import BaseWireAdapter from "./adapters/BaseWireAdapter";

const { hasOwnProperty } = Object.prototype;

function validateAdapterId(adapterId) {
    if (!adapterId) {
        throw new Error('No adapter specified');
    }

    // @todo: maybe this should be an error.
    if (!hasOwnProperty.call(adapterId, 'adapter') || !hasOwnProperty.call(adapterId.adapter, 'mock')) {
        // If we reach this path, it means:
        // 1- You are in platform with custom mocks for a wire adapter. Remove it, the stubs provide platform mocks.
        // 2- You are off-platform. You need to use createWireAdapterMock, in order to use register(*)WireAdapter.
        console.warn("If you are in platform, please remove your custom adapter mock or " +
            "use createWireAdapterMock to mock wire adapters that will be used " +
            "with registerLdsTestWireAdapter, registerApexTestWireAdapter or registerTestWireAdapter.");
    }

    // If the adapterId is not a jest.mock, we can't use it in the wire reform.
    if (!hasOwnProperty.call(adapterId, 'mock')) {
        // improve message later.
        throw new Error('adapterId should be a jest mock function. ' +
            'Please update your mocks and use createWireAdapterMock to mock wire adapters.')
    }
}

const noop = ()=>{};

/**
 * Returns a mock for a wire adapter.
 *
 * @param {Function} apexFn An apex adapters are also callable, this function will be called
 *                          when the wire adapter is invoked imperatively.
 * @returns {typeof jest.fn}
 */
function createWireAdapterMock(apexFn) {
    const adapterMock = jest.fn();
    if (typeof apexFn === "function") {
        adapterMock.mockImplementation(apexFn);
    }

    adapterMock.adapter = jest.fn().mockImplementation((dataCallback) => {
        return new BaseWireAdapter(
            dataCallback, {
                onUpdate: noop,
                onConnect: noop,
                onDisconnect: noop
            }
        );
    });

    return adapterMock;
}

function registerLdsTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    return createLdsAdapter(identifier);
}

function registerApexTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    return createApexAdapter(identifier);
}

function registerTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    return createGenericAdapter(identifier);
}

export {
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
    createWireAdapterMock,
};