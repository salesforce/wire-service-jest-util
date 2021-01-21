/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import { testAdapter } from 'example/adapters';
import Generic from 'example/generic';
import { registerTestWireAdapter } from '../../../../../src';

const testWireAdapter = registerTestWireAdapter(testAdapter);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-generic', () => {
    describe('registerTestWireAdapter', () => {
        describe('getLastConfig()', () => {
            it('should return last available config', () => {
                const element = createElement('example-generic', { is: Generic });
                document.body.appendChild(element);

                return Promise.resolve()
                    .then(() => {
                        expect(testWireAdapter.getLastConfig()).toStrictEqual({});

                        element.param = 'v1';
                    })
                    .then(() => {
                        expect(testWireAdapter.getLastConfig()).toStrictEqual({ p: "v1" });
                    });
            });
        });

        describe('emit()', () => {
            it('should not emit value when component is created but not connected', () => {
                const element = createElement('example-generic', { is: Generic });

                const result = element.getWiredValue();

                expect(result).toBeUndefined();
            });

            it('should not emit values after component was disconnected', () => {
                const element = createElement('example-generic', { is: Generic });
                document.body.appendChild(element);

                return Promise.resolve()
                    .then(() => {
                        const mockedValue = { foo: 'bar' };
                        testWireAdapter.emit(mockedValue);

                        expect(element.getWiredValue()).toStrictEqual(mockedValue);

                        document.body.removeChild(element);

                        testWireAdapter.emit({ bar: 'baz' });

                        expect(element.getWiredValue()).toStrictEqual(mockedValue);
                    });
            });

            it('should emit values in the correct format', () => {
                const element = createElement('example-generic', { is: Generic });
                document.body.appendChild(element);

                return Promise.resolve().then(() => {
                    const mockedValue = { foo: 'bar' };
                    testWireAdapter.emit(mockedValue);

                    expect(element.getWiredValue()).toStrictEqual(mockedValue);
                });
            });
        });
    });
});
