/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import ApexMethod from '@salesforce/apex/FooClass.FooMethod';
import Apex from 'example/apex';
import { registerApexTestWireAdapter } from '../../../../../src';

const apexMethodAdapter = registerApexTestWireAdapter(ApexMethod);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-apex', () => {
    describe('registerApexTestWireAdapter', () => {
        describe('getLastConfig()', () => {
            it('should return last available config', () => {
                const element = createElement('example-apex', { is: Apex });
                document.body.appendChild(element);

                return Promise.resolve()
                    .then(() => {
                        expect(apexMethodAdapter.getLastConfig()).toStrictEqual({});

                        element.param = 'v1';
                    })
                    .then(() => {
                        expect(apexMethodAdapter.getLastConfig()).toStrictEqual({ p: "v1" });
                    });
            });
        });

        describe('emit()', () => {
            it('should emit value when component is created but not connected', () => {
                const element = createElement('example-apex', { is: Apex });

                const result = element.getWiredValue();

                expect(result.data).toBeUndefined();
                expect(result.error).toBeUndefined();
            });

            it('should not emit values after component was disconnected', () => {
                const element = createElement('example-apex', { is: Apex });
                document.body.appendChild(element);

                return Promise.resolve()
                    .then(() => {
                        const mockedValue = { foo: 'bar' };
                        apexMethodAdapter.emit(mockedValue);

                        const result = element.getWiredValue();

                        expect(result.data).toStrictEqual(mockedValue);
                        expect(result.error).not.toBeDefined();

                        document.body.removeChild(element);

                        apexMethodAdapter.emit({ bar: 'baz' });

                        const secondResult = element.getWiredValue();

                        expect(secondResult.data).toStrictEqual(mockedValue);
                        expect(secondResult.error).not.toBeDefined();
                    });
            });

            it('should emit values in the correct format', () => {
                const element = createElement('example-apex', { is: Apex });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    const mockedValue = { foo: 'bar' };
                    apexMethodAdapter.emit(mockedValue);

                    const result = element.getWiredValue();

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
                    apexMethodAdapter.error();

                    const result = element.getWiredValue();

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
                    apexMethodAdapter.error(expectedBody);

                    const result = element.getWiredValue();

                    expect(result.data).toBeUndefined();
                    expect(result.error.body).toStrictEqual(expectedBody);
                });
            });

            it('should throw when status is invalid', () => {
                const element = createElement('example-apex', { is: Apex });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    expect(() => {
                        apexMethodAdapter.error(undefined, 300);
                    }).toThrow("'status' must be >= 400 or <= 599");
                });
            });

            it('should use statusText when provided', () => {
                const element = createElement('example-apex', { is: Apex });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    const expectedStatusText = "test status text";
                    apexMethodAdapter.error(undefined, 400, expectedStatusText);

                    const result = element.getWiredValue();

                    expect(result.data).toBeUndefined();
                    expect(result.error.statusText).toBe(expectedStatusText);
                });
            });
        });
    });
});
