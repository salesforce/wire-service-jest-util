/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import * as target from '../index';

describe('registerLdsTestWireAdapter', () => {
    it('returns a test wire adapter', () => {
        const testWireAdapter = target.registerLdsTestWireAdapter(() => {});
        expect(testWireAdapter).toHaveProperty('emit');
        expect(testWireAdapter).toHaveProperty('error');
        expect(testWireAdapter).toHaveProperty('getLastConfig');
    });

    it('throws error when no adapter id', () => {
        expect(() => {
            // @ts-ignore because we aren't passing any argument here and TS fails
            // but in JS, since there's no check, this test is necessary
            target.registerTestWireAdapter();
        }).toThrow('No adapter specified');
    });
});

describe('registerTestWireAdapter', () => {
    it('returns a test wire adapter', () => {
        const testWireAdapter = target.registerTestWireAdapter(() => {});
        expect(testWireAdapter).toHaveProperty('emit');
        expect(testWireAdapter).not.toHaveProperty('error');
        expect(testWireAdapter).toHaveProperty('getLastConfig');
    });

    it('throws error when no adapter id', () => {
        expect(() => {
            // @ts-ignore same reason as above
            target.registerTestWireAdapter();
        }).toThrow('No adapter specified');
    });
});
