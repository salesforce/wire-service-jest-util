/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Lds from 'example/lds';
import { ldsAdapter, ldsAdapterLegacyMock, ldsAdapterMock } from 'example/adapters';
import { registerLdsTestWireAdapter } from '@salesforce/wire-service-jest-util';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

const cases = [
    {
        testName: 'new api (via createLdsTestWireAdapter)',
        adapter: ldsAdapterMock,
        adapterName: 'ldsAdapterMock',
    },
    {
        testName: 'legacy api (registerLdsTestWireAdapter) used with real adapter implementation',
        adapter: registerLdsTestWireAdapter(ldsAdapter),
        adapterName: 'ldsAdapter',
    },
    {
        testName: 'legacy api (registerLdsTestWireAdapter) used with legacy adapter mock',
        adapter: registerLdsTestWireAdapter(ldsAdapterLegacyMock),
        adapterName: 'ldsAdapterLegacyMock',
    },
    {
        testName: 'legacy api (registerLdsTestWireAdapter) used with new adapter mock',
        adapter: registerLdsTestWireAdapter(ldsAdapterMock),
        adapterName: 'ldsAdapterMock',
    },
];

describe('registerLdsTestWireAdapter', () => {
    it('should show console.warn deprecation message', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn');

        registerLdsTestWireAdapter(ldsAdapter);
        expect(consoleWarnSpy).toHaveBeenCalledWith('registerLdsTestWireAdapter is deprecated. Mock your wire adapters with createLdsWireAdapterMock instead.');

        consoleWarnSpy.mockRestore();
    });
});

describe('LdsTestWireAdapter', () => {
    cases.forEach(({ testName, adapter, adapterName}) => {
        describe(testName, ()=> {
            describe('getLastConfig()', () => {
                it('should return last available config', () => {
                    const element = createElement('example-lds', { is: Lds });
                    element.param = 'v1';

                    document.body.appendChild(element);

                    return Promise.resolve()
                        .then(() => {
                            expect(adapter.getLastConfig()).toStrictEqual({ p: 'v1' });

                            element.param = 'v2';
                        })
                        .then(() => {
                            expect(adapter.getLastConfig()).toStrictEqual({ p: 'v2' });
                        });
                });
            });

            describe('emit()', () => {
                it('should emit value when component is created but not connected', () => {
                    const element = createElement('example-lds', { is: Lds });

                    const result = element.getWiredValue(adapterName);

                    expect(result.data).toBeUndefined();
                    expect(result.error).toBeUndefined();
                });

                it('should not emit values after component was disconnected', () => {
                    const element = createElement('example-lds', { is: Lds });
                    document.body.appendChild(element);

                    return Promise.resolve()
                        .then(() => {
                            const mockedValue = { foo: 'bar' };
                            adapter.emit(mockedValue);

                            const result = element.getWiredValue(adapterName);

                            expect(result.data).toStrictEqual(mockedValue);
                            expect(result.error).not.toBeDefined();

                            document.body.removeChild(element);

                            adapter.emit({ bar: 'baz' });

                            const secondResult = element.getWiredValue(adapterName);

                            expect(secondResult.data).toStrictEqual(mockedValue);
                            expect(secondResult.error).not.toBeDefined();
                        });
                });

                it('should emit values in the correct format', () => {
                    const element = createElement('example-lds', { is: Lds });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        const mockedValue = { foo: 'bar' };
                        adapter.emit(mockedValue);

                        const result = element.getWiredValue(adapterName);

                        expect(result.data).toStrictEqual(mockedValue);
                        expect(result.error).not.toBeDefined();
                    });
                });
            });

            describe('error()', () => {
                it('should emit default error when invoked without arguments', () => {
                    const element = createElement('example-lds', { is: Lds });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        adapter.error();

                        const result = element.getWiredValue(adapterName);

                        expect(result.data).toBeUndefined();
                        expect(result.error).toStrictEqual({
                            body: [{
                                errorCode: 'NOT_FOUND',
                                message: 'The requested resource does not exist',
                            }],
                            ok: false,
                            status: 404,
                            statusText: "NOT_FOUND"
                        });
                    });
                });

                it('should use body when provided', () => {
                    const element = createElement('example-lds', { is: Lds });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        const expectedBody = { message: 'This is a test error' };
                        adapter.error(expectedBody);

                        const result = element.getWiredValue(adapterName);

                        expect(result.data).toBeUndefined();
                        expect(result.error.body).toStrictEqual(expectedBody);
                    });
                });

                it('should throw when status is invalid', () => {
                    const element = createElement('example-lds', { is: Lds });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        expect(() => {
                            adapter.error(undefined, 300);
                        }).toThrow("'status' must be >= 400 or <= 599");
                    });
                });

                it('should use statusText when provided', () => {
                    const element = createElement('example-lds', { is: Lds });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        const expectedStatusText = "test status text";
                        adapter.error(undefined, 400, expectedStatusText);

                        const result = element.getWiredValue(adapterName);

                        expect(result.data).toBeUndefined();
                        expect(result.error.statusText).toBe(expectedStatusText);
                    });
                });
            });
        });
    });
});
