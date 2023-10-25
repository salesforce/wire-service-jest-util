/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { buildApexTestWireAdapter } from './adapters/ApexTestWireAdapter';
import { buildLdsTestWireAdapter } from './adapters/LdsTestWireAdapter';
import { TestWireAdapterTemplate, buildTestWireAdapter } from './adapters/TestWireAdapter';
import { deprecatedRegisterAdapter } from './utils';

const MIGRATION_LINK =
    'https://github.com/salesforce/wire-service-jest-util/blob/master/docs/migrating-from-version-2.x-to-3.x.md';
const knownAdapterMocks = new WeakSet();

function getMigrationMessageFor(registerFnName: string) {
    return `${registerFnName} is deprecated. More details: ${MIGRATION_LINK}`;
}

function validateAdapterId(adapterId: any) {
    if (!adapterId) {
        throw new Error('No adapter specified');
    }
}

function isWireAdapterMock(adapter: any) {
    return knownAdapterMocks.has(adapter);
}

/**
 * @deprecated
 */
function registerLdsTestWireAdapter(identifier: any) {
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
function registerApexTestWireAdapter(identifier: any) {
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
function registerTestWireAdapter(identifier: any) {
    validateAdapterId(identifier);

    console.warn(getMigrationMessageFor('registerTestWireAdapter'));

    if (!isWireAdapterMock(identifier)) {
        const testAdapter = buildTestWireAdapter();

        deprecatedRegisterAdapter(identifier, testAdapter);

        return testAdapter;
    }

    return identifier;
}

// found no other way to omit these private properties
function createWireAdapterMock<T extends typeof TestWireAdapterTemplate>(
    TestWireAdapter: T,
    fn?: Function
): Omit<T, '_lastConfig' | '_wireInstances' | 'new'> {
    let testAdapter = TestWireAdapter;

    if (typeof fn === 'function') {
        Object.defineProperty(fn, 'adapter', { value: TestWireAdapter });
        Object.setPrototypeOf(fn, TestWireAdapter);
        // @ts-ignore
        testAdapter = fn;
    }

    knownAdapterMocks.add(testAdapter);

    return testAdapter;
}

function createApexTestWireAdapter(fn?: Function) {
    return createWireAdapterMock(buildApexTestWireAdapter(), fn);
}

function createLdsTestWireAdapter(fn?: Function) {
    return createWireAdapterMock(buildLdsTestWireAdapter(), fn);
}

function createTestWireAdapter(fn?: Function) {
    return createWireAdapterMock(buildTestWireAdapter(), fn);
}

export {
    createApexTestWireAdapter,
    createLdsTestWireAdapter,
    createTestWireAdapter,
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter,
    registerTestWireAdapter,
};
