/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import * as target from '../index.js';

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

    it('throws error when no adapter id', () => {
        expect(() => {
            target.registerLdsTestWireAdapter();
        }).toThrow('No adapter specified');
    });

    it('throws error when no valid mock', () => {
        expect(() => {
            target.registerLdsTestWireAdapter(function () {});
        }).toThrow('adapterId should be a jest mock function. Please update your mocks and use ' +
            'createWireAdapterMock to mock wire adapters.');
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

    it('throws error when no adapter id', () => {
        expect(() => {
            target.registerTestWireAdapter();
        }).toThrow('No adapter specified');
    });

    it('throws error when no valid mock', () => {
        expect(() => {
            target.registerTestWireAdapter(function () {});
        }).toThrow('adapterId should be a jest mock function. Please update your mocks and use ' +
            'createWireAdapterMock to mock wire adapters.');
    });
});