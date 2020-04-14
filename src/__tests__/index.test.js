/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import * as target from '../index.js';

const INVALID_ADAPTER_ERROR = "If you are in platform, please remove your custom adapter mock or " +
    "use createWireAdapterMock to mock wire adapters that will be used " +
    "with registerLdsTestWireAdapter, registerApexTestWireAdapter or registerTestWireAdapter.";

describe('createWireAdapterMock', () => {
    it('should return a wire adapter', () => {
        const wireAdapterMock = target.createWireAdapterMock();

        expect(wireAdapterMock).toHaveProperty('adapter');
        const adapterInstance = new wireAdapterMock.adapter(() => {});
        expect(adapterInstance).toHaveProperty('emit');
        expect(adapterInstance).toHaveProperty('connect');
        expect(adapterInstance).toHaveProperty('update');
        expect(adapterInstance).toHaveProperty('disconnect');
    });

    it('should return a wire adapter mock for apex when apex fn is passed', () => {
        const apexFn = jest.fn();
        const wireAdapterMock = target.createWireAdapterMock(apexFn);

        expect(wireAdapterMock).toHaveProperty('adapter');

        apexFn('test');

        expect(apexFn).toHaveBeenCalled();
        expect(apexFn).toHaveBeenCalledWith('test');
    });
});

describe('registerLdsTestWireAdapter', () => {
    const adapterMock = target.createWireAdapterMock();

    it('returns a test wire adapter', () => {
        const testWireAdapter = target.registerLdsTestWireAdapter(adapterMock);
        expect(testWireAdapter).toHaveProperty('emit');
        expect(testWireAdapter).toHaveProperty('error');
        expect(testWireAdapter).toHaveProperty('getLastConfig');
    });

    it('should emit values', () => {
        const testWireAdapter = target.registerLdsTestWireAdapter(adapterMock);

        const dataCallbackMock = jest.fn();
        // mock the lwc engine wiring the adapter to the component.
        // eslint-disable-next-line no-unused-vars
        const wireInstance = new adapterMock.adapter(dataCallbackMock);
        const testValue = { test: 'value' };
        testWireAdapter.emit(testValue);

        expect(dataCallbackMock).toHaveBeenCalled();
        expect(dataCallbackMock).toHaveBeenCalledWith({ data: testValue, error: undefined });
    });

    it('should emit error', () => {
        const testWireAdapter = target.registerLdsTestWireAdapter(adapterMock);

        const dataCallbackMock = jest.fn();
        // mock the lwc engine wiring the adapter to the component.
        // eslint-disable-next-line no-unused-vars
        const wireInstance = new adapterMock.adapter(dataCallbackMock);
        testWireAdapter.error('body', 'status', 'text');

        expect(dataCallbackMock).toHaveBeenCalled();
        const expectedError = {
            "body": "body",
            "ok": false,
            "status": "status",
            "statusText": "text",
        };

        expect(dataCallbackMock).toHaveBeenCalledWith({ data: undefined, error: expectedError });
    });

    it('should get last config', () => {
        const testWireAdapter = target.registerLdsTestWireAdapter(adapterMock);

        // mock the lwc engine wiring the adapter to the component.
        const wireInstance = new adapterMock.adapter(jest.fn());
        const firstConfig = { v: 'first' };
        const secondConfig = { v: 'second' };

        wireInstance.update(firstConfig);

        expect(testWireAdapter.getLastConfig()).toBe(firstConfig);

        wireInstance.update(secondConfig);

        expect(testWireAdapter.getLastConfig()).toBe(secondConfig);
    });

    it('throws error when no adapter id', () => {
        expect(() => {
            target.registerLdsTestWireAdapter();
        }).toThrow('No adapter specified');
    });

    it('throws error when no valid mock', () => {
        expect(() => {
            target.registerLdsTestWireAdapter(function () {});
        }).toThrow(INVALID_ADAPTER_ERROR);
    });
});

describe('registerTestWireAdapter', () => {
    const adapterMock = target.createWireAdapterMock();

    it('returns a test wire adapter', () => {
        const testWireAdapter = target.registerTestWireAdapter(adapterMock);
        expect(testWireAdapter).toHaveProperty('emit');
        expect(testWireAdapter).not.toHaveProperty('error');
        expect(testWireAdapter).toHaveProperty('getLastConfig');
    });

    it('should emit values', () => {
        const testWireAdapter = target.registerTestWireAdapter(adapterMock);

        const dataCallbackMock = jest.fn();
        // mock the lwc engine wiring the adapter to the component.
        // eslint-disable-next-line no-unused-vars
        const wireInstance = new adapterMock.adapter(dataCallbackMock);
        const testValue = { test: 'value' };
        testWireAdapter.emit(testValue);

        expect(dataCallbackMock).toHaveBeenCalled();
        expect(dataCallbackMock).toHaveBeenCalledWith(testValue);
    });

    it('should get last config', () => {
        const testWireAdapter = target.registerTestWireAdapter(adapterMock);

        // mock the lwc engine wiring the adapter to the component.
        const wireInstance = new adapterMock.adapter(jest.fn());
        const firstConfig = { v: 'first' };
        const secondConfig = { v: 'second' };

        wireInstance.update(firstConfig);

        expect(testWireAdapter.getLastConfig()).toBe(firstConfig);

        wireInstance.update(secondConfig);

        expect(testWireAdapter.getLastConfig()).toBe(secondConfig);
    });

    it('throws error when no adapter id', () => {
        expect(() => {
            target.registerTestWireAdapter();
        }).toThrow('No adapter specified');
    });

    it('throws error when no valid mock', () => {
        expect(() => {
            target.registerTestWireAdapter(function () {});
        }).toThrow(INVALID_ADAPTER_ERROR);
    });
});

describe('registerApexTestWireAdapter', () => {
    const apexCallMock = jest.fn();
    const adapterMock = target.createWireAdapterMock(apexCallMock);

    it('returns a test wire adapter', () => {
        const testWireAdapter = target.registerApexTestWireAdapter(adapterMock);
        expect(testWireAdapter).toHaveProperty('emit');
        expect(testWireAdapter).toHaveProperty('error');
        expect(testWireAdapter).toHaveProperty('getLastConfig');
    });

    it('apex can be used as callable', () => {
        apexCallMock.mockClear();

        const apexParameter1 = { a: 'b' };
        const apexParameter2 = { c: 'd' };
        adapterMock(apexParameter1, apexParameter2);

        expect(apexCallMock).toHaveBeenCalled();
        expect(apexCallMock).toHaveBeenCalledWith(apexParameter1, apexParameter2);
    });

    it('should emit values', () => {
        const testWireAdapter = target.registerApexTestWireAdapter(adapterMock);

        const dataCallbackMock = jest.fn();
        // mock the lwc engine wiring the adapter to the component.
        // eslint-disable-next-line no-unused-vars
        const wireInstance = new adapterMock.adapter(dataCallbackMock);
        const testValue = { test: 'value' };
        testWireAdapter.emit(testValue);

        expect(dataCallbackMock).toHaveBeenCalled();
        expect(dataCallbackMock).toHaveBeenCalledWith({ data: testValue, error: undefined });
    });

    it('should emit error', () => {
        const testWireAdapter = target.registerApexTestWireAdapter(adapterMock);

        const dataCallbackMock = jest.fn();
        // mock the lwc engine wiring the adapter to the component.
        // eslint-disable-next-line no-unused-vars
        const wireInstance = new adapterMock.adapter(dataCallbackMock);
        testWireAdapter.error('body', 'status', 'text');

        expect(dataCallbackMock).toHaveBeenCalled();
        const expectedError = {
            "body": "body",
            "ok": false,
            "status": "status",
            "statusText": "text",
        };

        expect(dataCallbackMock).toHaveBeenCalledWith({ data: undefined, error: expectedError });
    });

    it('should get last config', () => {
        const testWireAdapter = target.registerApexTestWireAdapter(adapterMock);

        // mock the lwc engine wiring the adapter to the component.
        const wireInstance = new adapterMock.adapter(jest.fn());
        const firstConfig = { v: 'first' };
        const secondConfig = { v: 'second' };

        wireInstance.update(firstConfig);

        expect(testWireAdapter.getLastConfig()).toBe(firstConfig);

        wireInstance.update(secondConfig);

        expect(testWireAdapter.getLastConfig()).toBe(secondConfig);
    });

    it('throws error when no adapter id', () => {
        expect(() => {
            target.registerApexTestWireAdapter();
        }).toThrow('No adapter specified');
    });

    it('throws error when no valid mock', () => {
        expect(() => {
            target.registerApexTestWireAdapter(function () {});
        }).toThrow(INVALID_ADAPTER_ERROR);
    });
});