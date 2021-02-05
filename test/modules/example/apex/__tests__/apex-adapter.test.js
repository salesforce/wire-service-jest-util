/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Apex from 'example/apex';
import ApexMethod from '@salesforce/apex/Apex.ApexMethod';
import LegacyApexMethod from '@salesforce/apex/Apex.LegacyApexMethod';
import { registerApexTestWireAdapter } from '@salesforce/wire-service-jest-util';

jest.mock(
    '@salesforce/apex/Apex.ApexMethod',
    () => require('./apex-mock'),
    { virtual: true }
);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

const cases = [
    {
        testName: 'new api (via createApexTestWireAdapter)',
        adapter: ApexMethod,
        adapterName: 'ApexMethod',
    },
    {
        testName: 'legacy api (registerApexTestWireAdapter) used with legacy adapter mock',
        adapter: registerApexTestWireAdapter(LegacyApexMethod),
        adapterName: 'LegacyApexMethod',
    },
    {
        testName: 'legacy api (registerApexTestWireAdapter) used with new adapter mock',
        adapter: registerApexTestWireAdapter(ApexMethod),
        adapterName: 'ApexMethod',
    },
];

describe('registerApexTestWireAdapter', () => {
    it('should show console.warn deprecation message', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn');

        registerApexTestWireAdapter(ApexMethod);
        expect(consoleWarnSpy).toHaveBeenCalledWith('registerApexTestWireAdapter is deprecated. More details: https://github.com/salesforce/wire-service-jest-util/blob/master/README.md##migrating-from-version-2x-to-3x.');

        consoleWarnSpy.mockRestore();
    });
});

describe('createLdsTestWireAdapter', () => {
    describe('emit()', () => {
        it('should emit values to all wire instances when no filter function is specified', () => {
            const element = createElement('example-apex', { is: Apex });
            document.body.appendChild(element);

            return Promise.resolve().then(() => {
                const mockedValue = { foo: 'bar' };
                ApexMethod.emit(mockedValue);

                expect(element.getWiredValue('ApexMethod').data).toBe(mockedValue);
                expect(element.getWiredValue('ApexMethodSecondUsage').data).toBe(mockedValue);
            });
        });

        it('should emit values only to those instances with specific config', () => {
            const element = createElement('example-apex', { is: Apex });
            document.body.appendChild(element);

            return Promise.resolve().then(() => {
                const mockedValue = { foo: 'bar' };
                ApexMethod.emit(mockedValue, (config) => config.p2 === 'second');

                expect(element.getWiredValue('ApexMethod').data).not.toBe(mockedValue);
                expect(element.getWiredValue('ApexMethodSecondUsage').data).toBe(mockedValue);
            });
        });
    })
});

describe('ApexTestWireAdapter', () => {
    cases.forEach(({ testName, adapter, adapterName}) => {
        describe(testName, ()=> {
            describe('getLastConfig()', () => {
                it('should return last available config', () => {
                    const element = createElement('example-apex', { is: Apex });
                    element.param = 'v1';

                    document.body.appendChild(element);

                    return Promise.resolve()
                        .then(() => {
                            expect(adapter.getLastConfig().p).toBe('v1');

                            element.param = 'v2';
                        })
                        .then(() => {
                            expect(adapter.getLastConfig().p).toBe('v2');
                        });
                });
            });

            describe('emit()', () => {
                it('should emit value when component is created but not connected', () => {
                    const element = createElement('example-apex', { is: Apex });

                    const result = element.getWiredValue(adapterName);

                    expect(result.data).toBeUndefined();
                    expect(result.error).toBeUndefined();
                });

                it('should not emit values after component was disconnected', () => {
                    const element = createElement('example-apex', { is: Apex });
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
                    const element = createElement('example-apex', { is: Apex });
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
                    const element = createElement('example-apex', { is: Apex });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        adapter.error();

                        const result = element.getWiredValue(adapterName);

                        expect(result.data).toBeUndefined();
                        expect(result.error).toStrictEqual({
                            body: {
                                message: "An internal server error has occurred"
                            },
                            ok: false,
                            status: 400,
                            statusText: "Bad Request"
                        });
                    });
                });

                it('should use body when provided', () => {
                    const element = createElement('example-apex', { is: Apex });
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
                    const element = createElement('example-apex', { is: Apex });
                    document.body.appendChild(element);

                    return Promise.resolve().then(() => {
                        expect(() => {
                            adapter.error(undefined, 300);
                        }).toThrow("'status' must be >= 400 or <= 599");
                    });
                });

                it('should use statusText when provided', () => {
                    const element = createElement('example-apex', { is: Apex });
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
