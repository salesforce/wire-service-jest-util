/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import ApexMethod from '@salesforce/apex/FooClass.FooMethod';
import Apex from 'example/apex';
import * as target from '../../../../../index.js';

const { registerApexTestWireAdapter } = target;
const apexMethodAdapter = registerApexTestWireAdapter(ApexMethod);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-apex', () => {
    describe('importing @salesforce/apex', () => {
        it('should emit values in correct format', () => {
            const element = createElement('example-apex', { is: Apex });
            // apex methods needs to be connected
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
});
