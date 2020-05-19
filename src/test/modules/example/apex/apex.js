/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api, wire } from 'lwc';
import ApexMethod from '@salesforce/apex/FooClass.FooMethod';

export default class Apex extends LightningElement {
    @wire(ApexMethod) wiredValue;

    @api
    getWiredValue() {
        return this.wiredValue;
    }
}
