/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createLdsTestWireAdapter, createTestWireAdapter } from "@salesforce/wire-service-jest-util";

export const ldsAdapterMock = createLdsTestWireAdapter();
export const testAdapterMock = createTestWireAdapter();