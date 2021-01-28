/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Generic from 'example/generic';
import { testAdapter, testAdapterLegacyMock, testAdapterMock } from 'example/adapters';
import { registerTestWireAdapter } from '@salesforce/wire-service-jest-util';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

const cases = [
    {
        testName: 'new api (via createTestWireAdapter)',
        adapter: testAdapterMock,
        adapterName: 'testAdapterMock',
    },
    {
        testName: 'legacy api (registerTestWireAdapter) used with real adapter implementation',
        adapter: registerTestWireAdapter(testAdapter),
        adapterName: 'testAdapter',
    },
    {
        testName: 'legacy api (registerTestWireAdapter) used with legacy adapter mock',
        adapter: registerTestWireAdapter(testAdapterLegacyMock),
        adapterName: 'testAdapterLegacyMock',
    },
    {
        testName: 'legacy api (registerTestWireAdapter) used with new adapter mock',
        adapter: registerTestWireAdapter(testAdapterMock),
        adapterName: 'testAdapterMock',
    },
];

describe('registerTestWireAdapter', () => {
    it('should show console.warn deprecation message', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn');

        registerTestWireAdapter(testAdapter);
        expect(consoleWarnSpy).toHaveBeenCalledWith('registerTestWireAdapter is deprecated. Mock your wire adapters with createLdsTestWireAdapter instead.');

        consoleWarnSpy.mockRestore();
    });
});

describe('TestWireAdapter', () => {
    cases.forEach(({ testName, adapter, adapterName}) => {
        describe(testName, ()=> {
            describe('getLastConfig()', () => {
                it('should return last available config', () => {
                    const element = createElement('example-generic', { is: Generic });
                    element.param = 'v1';

                    document.body.appendChild(element);

                    return Promise.resolve()
                        .then(() => {
                            expect(adapter.getLastConfig()).toStrictEqual({ p: 'v1'});

                            element.param = 'v2';
                        })
                        .then(() => {
                            expect(adapter.getLastConfig()).toStrictEqual({ p: 'v2' });
                        });
                });
            });

            describe('emit()', () => {
                it('should not emit value when component is created but not connected', () => {
                    const element = createElement('example-generic', { is: Generic });

                    const result = element.getWiredValue(adapterName);

                    expect(result).toBeUndefined();
                });

                it('should not emit values after component was disconnected', () => {
                    const element = createElement('example-generic', { is: Generic });
                    document.body.appendChild(element);

                    return Promise.resolve()
                        .then(() => {
                            const mockedValue = { foo: 'bar' };
                            adapter.emit(mockedValue);

                            expect(element.getWiredValue(adapterName)).toStrictEqual(mockedValue);

                            document.body.removeChild(element);

                            adapter.emit({ bar: 'baz' });

                            expect(element.getWiredValue(adapterName)).toStrictEqual(mockedValue);
                        });
                });

                it('should emit values in the correct format', () => {
                    const element = createElement('example-generic', { is: Generic });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        const mockedValue = { foo: 'bar' };
                        adapter.emit(mockedValue);

                        expect(element.getWiredValue(adapterName)).toStrictEqual(mockedValue);
                    });
                });
            });
        });
    });
});
