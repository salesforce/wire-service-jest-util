/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import { ldsAdapter } from 'example/adapters';
import Lds from 'example/lds';
import { registerLdsTestWireAdapter } from '../../../../../src';

const ldsTestWireAdapter = registerLdsTestWireAdapter(ldsAdapter);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-lds', () => {
    describe('registerLdsTestWireAdapter', () => {
        describe('getLastConfig()', () => {
            it('should return last available config', () => {
                const element = createElement('example-lds', { is: Lds });
                document.body.appendChild(element);

                return Promise.resolve()
                    .then(() => {
                        expect(ldsTestWireAdapter.getLastConfig()).toStrictEqual({});

                        element.param = 'v1';
                    })
                    .then(() => {
                        expect(ldsTestWireAdapter.getLastConfig()).toStrictEqual({ p: "v1" });
                    });
            });
        });

        describe('emit()', () => {
            it('should emit value when component is created but not connected', () => {
                const element = createElement('example-lds', { is: Lds });

                const result = element.getWiredValue();

                expect(result.data).toBeUndefined();
                expect(result.error).toBeUndefined();
            });

            it('should not emit values after component was disconnected', () => {
                const element = createElement('example-lds', { is: Lds });
                document.body.appendChild(element);

                return Promise.resolve()
                    .then(() => {
                        const mockedValue = { foo: 'bar' };
                        ldsTestWireAdapter.emit(mockedValue);

                        const result = element.getWiredValue();

                        expect(result.data).toStrictEqual(mockedValue);
                        expect(result.error).not.toBeDefined();

                        document.body.removeChild(element);

                        ldsTestWireAdapter.emit({ bar: 'baz' });

                        const secondResult = element.getWiredValue();

                        expect(secondResult.data).toStrictEqual(mockedValue);
                        expect(secondResult.error).not.toBeDefined();
                    });
            });

            it('should emit values in the correct format', () => {
                const element = createElement('example-lds', { is: Lds });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    const mockedValue = { foo: 'bar' };
                    ldsTestWireAdapter.emit(mockedValue);

                    const result = element.getWiredValue();

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
                    ldsTestWireAdapter.error();

                    const result = element.getWiredValue();

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
                    ldsTestWireAdapter.error(expectedBody);

                    const result = element.getWiredValue();

                    expect(result.data).toBeUndefined();
                    expect(result.error.body).toStrictEqual(expectedBody);
                });
            });

            it('should throw when status is invalid', () => {
                const element = createElement('example-lds', { is: Lds });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    expect(() => {
                        ldsTestWireAdapter.error(undefined, 300);
                    }).toThrow("'status' must be >= 400 or <= 599");
                });
            });

            it('should use statusText when provided', () => {
                const element = createElement('example-lds', { is: Lds });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    const expectedStatusText = "test status text";
                    ldsTestWireAdapter.error(undefined, 400, expectedStatusText);

                    const result = element.getWiredValue();

                    expect(result.data).toBeUndefined();
                    expect(result.error.statusText).toBe(expectedStatusText);
                });
            });
        });
    });
});
