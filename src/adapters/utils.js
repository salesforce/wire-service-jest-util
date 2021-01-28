/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const wireAdaptersRegistryHack = global.wireAdaptersRegistryHack || new Map();

export function spyOnAdapter(spy, adapterId) {
    const relatedAdapter = wireAdaptersRegistryHack.get(adapterId);

    if (relatedAdapter) {
        relatedAdapter.adapter.spyAdapter(spy);
    }
}