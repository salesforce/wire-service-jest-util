/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
export class ldsAdapter {
    connect() {}
    disconnect() {}
    update() {}
}

export class testAdapter {
    connect() {}
    disconnect() {}
    update() {}
}

export * from './mocks';
export * from './legacy-mocks';