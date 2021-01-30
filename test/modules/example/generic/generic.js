/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api, wire } from 'lwc';
import { testAdapter, testAdapterLegacyMock, testAdapterMock } from 'example/adapters';

export default class Generic extends LightningElement {
    @api param;

    @wire(testAdapter, { p: '$param' }) testAdapterValue;
    @wire(testAdapterLegacyMock, { p: '$param' }) testAdapterLegacyMockValue;
    @wire(testAdapterMock, { p: '$param' }) testAdapterMockValue;
    @wire(testAdapterMock, { p: '$param', p2: 'second' }) testAdapterMockSecondUsageValue;

    @api
    getWiredValue(adapter) {
        return this[`${adapter}Value`];
    }
}
