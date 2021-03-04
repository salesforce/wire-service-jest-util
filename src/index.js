/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { buildApexTestWireAdapter } from "./adapters/ApexTestWireAdapter";
import { buildLdsTestWireAdapter } from "./adapters/LdsTestWireAdapter";
import { buildTestWireAdapter } from "./adapters/TestWireAdapter";
import { deprecatedRegisterAdapter } from "./utils";

const MIGRATION_LINK = 'https://github.com/salesforce/wire-service-jest-util/blob/master/docs/migrating-from-version-2.x-to-3.x.md';
const knownAdapterMocks = new WeakSet();

function getMigrationMessageFor(registerFnName) {
    return `${registerFnName} is deprecated. More details: ${MIGRATION_LINK}`;
}

function validateAdapterId(adapterId) {
    if (!adapterId) {
        throw new Error('No adapter specified');
    }
}

function isWireAdapterMock(adapter) {
    return knownAdapterMocks.has(adapter);
}

/**
 * @deprecated
 */
function registerLdsTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerLdsTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const spy = buildLdsTestWireAdapter();

        deprecatedRegisterAdapter(identifier, spy);

        return spy;
    }

    return identifier;
}

/**
 * @deprecated
 */
function registerApexTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerApexTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const spy = buildApexTestWireAdapter();

        deprecatedRegisterAdapter(identifier, spy);

        return spy;
    }

    return identifier;
}

/**
 * @deprecated
 */
function registerTestWireAdapter(identifier) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const testAdapter = buildTestWireAdapter();

        deprecatedRegisterAdapter(identifier, testAdapter);

        return testAdapter;
    }

    return identifier;
}

function createWireAdapterMock(fn, TestWireAdapter) {
    let testAdapter = TestWireAdapter;

    if (typeof fn === "function") {
        testAdapter = fn;
        Object.defineProperty(fn, 'adapter', { value: TestWireAdapter });

        Object.setPrototypeOf(fn, TestWireAdapter);
    }

    knownAdapterMocks.add(testAdapter);

    return testAdapter;
}

function createApexTestWireAdapter(fn) {
    return createWireAdapterMock(fn, buildApexTestWireAdapter());
}

function createLdsTestWireAdapter(fn) {
    return createWireAdapterMock(fn, buildLdsTestWireAdapter());
}

function createTestWireAdapter(fn) {
    return createWireAdapterMock(fn, buildTestWireAdapter());
}

export {
    createApexTestWireAdapter,
    createLdsTestWireAdapter,
    createTestWireAdapter,

    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
};
