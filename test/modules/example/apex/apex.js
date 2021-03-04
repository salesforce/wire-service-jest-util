/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api, wire } from 'lwc';
import ApexMethod from '@salesforce/apex/Apex.ApexMethod';
import LegacyApexMethod from '@salesforce/apex/Apex.LegacyApexMethod';

export default class Apex extends LightningElement {
    @api param;
    @wire(ApexMethod, { p: '$param' }) ApexMethodValue;
    @wire(ApexMethod, { p: '$param', p2: 'second' }) ApexMethodSecondUsageValue;
    @wire(LegacyApexMethod, { p: '$param' }) LegacyApexMethodValue;

    @api
    getWiredValue(adapter) {
        return this[`${adapter}Value`];
    }
}
