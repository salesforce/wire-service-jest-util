/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api, wire } from 'lwc';
import { ldsAdapter, ldsAdapterLegacyMock, ldsAdapterMock } from 'example/adapters';

export default class Lds extends LightningElement {
    @api param;
    @wire(ldsAdapter, { p: '$param' }) ldsAdapterValue;
    @wire(ldsAdapterLegacyMock, { p: '$param' }) ldsAdapterLegacyMockValue;
    @wire(ldsAdapterMock, { p: '$param' }) ldsAdapterMockValue;

    @api
    getWiredValue(adapter) {
        return this[`${adapter}Value`];
    }
}
