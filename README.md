# @salesforce/wire-service-jest-util

A utility so Lightning Web Component unit tests can control the data provisioned with `@wire`.

## Basic Example

Assume you have a component like this.

```js
import { LightningElement, wire } from 'lwc';
import { getTodo } from 'x/todoApi';
export default class MyComponent extends LightningElement {
    @wire(getTodo, {id: 1})
    todo
}
```

You'd like to test the component's handling of `@wire` data and errors. This test utility makes it trivial.

Create a mock/stub of the `x/todoApi` module, and use `createTestWireAdapter` from `@salesforce/wire-service-jest-util` to create a test wire adapter, `getTodo`. Note: to create a module mock/stub in Jest, check the documentation for [Manual mocks](https://jestjs.io/docs/en/manual-mocks), [ES6 class mocks](https://jestjs.io/docs/en/es6-class-mocks) and [moduleNameMapper](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring) configuration.  

```js
import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

export const getTodo = createTestWireAdapter();
```

Then in your test, import the adapter to emit the data:

 ```js
import { createElement } from 'lwc';
import MyComponent from 'x/myComponent';

// Import the adapter used by the component under test.
// This will be TestWireAdapter defined in the mocked module. 
import { getTodo } from 'x/todoApi';

describe('@wire demonstration test', () => {

    // disconnect the component to reset the adapter. it is also
    // a best practice to cleanup after each test.
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('handles receiving data', () => {
        // arrange: insert component, with @wire(getTodo), into DOM
        const LightningElement = createElement('x-my-component', { is: MyComponent });
        document.body.appendChild(LightningElement);

        // act: have @wire(getTodo) provision a value
        const data = { 'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': false };
        getTodo.emit(data);

        // assert: verify component behavior having received @wire(getTodo)
    });
});
```

## Overview

This library provides three utility methods to create test wire adapters used in the tests to emit data and get the last resolved `@wire` configuration. This library doesn’t inject wire adapters for you, and your test configuration has to reroute all the wire adapters imports to resolve a mocked implementation.

### Adapter Types

There are three flavors of test adapters: Lightning Data Service (LDS), Apex, and generic. All allow test authors to emit data through the wire. The main difference is that the LDS and Apex wire adapters follow certain patterns that are automatically handled by the test adapters. These patterns include the shape in which data and errors are emitted, and an initial object emitted during registration. The generic test adapter directly emits any data passed to it. See the API section below for more details.

### [Migrating from version 2.x to 3.x](https://github.com/salesforce/wire-service-jest-util/blob/master/docs/migrating-from-version-2.x-to-3.x.md)

## API

### createTestWireAdapter

```js
/**
 * Returns a generic wire adapter for the given identifier. Emitted values may be of
 * any shape.
 *
 * @param {Function} This parameter might be used to implement adapters that can be invoked imperatively (like the Apex one).
 */
createTestWireAdapter(identifier: Function): TestWireAdapter;

interface TestWireAdapter {
    /**
     * Emits any value of any shape.
     * @param value The value to emit to the component
     * @param filterFn When provided, it will be invoked for every adapter instance on the
     *                 component with its associated config; if it returns true, the value will be
     *                 emitted to that particular instance.
     */
    emit(value: object, filterFn?: (config) => boolean): void;

    /**
     * Gets the last resolved config. Useful if component @wire uses includes
     * dynamic parameters.
     */
    getLastConfig(): object
}
```

### createLdsTestWireAdapter

```js
/**
 * Returns a wire adapter mock that mimics Lightning Data Service (LDS) adapters behavior,
 * emitted data and error shapes. For example, the emitted shape is
 * `{ data: object|undefined, error: FetchResponse|undefined}`.
 *
 * @param {Function} This parameter might be used to implement adapters that can be invoked imperatively (like the Apex one).
 */
createLdsTestWireAdapter(fn: Function): LdsTestWireAdapter;

interface LdsTestWireAdapter {
    /**
     * Emits data.
     * @param value The data to emit to the component
     * @param filterFn When provided, it will be invoked for every adapter instance on the
     *                 component with its associated config; if it returns true, the data will be
     *                 emitted to that particular instance.
     */
    emit(value: object, filterFn?: (config) => boolean): void;

    /**
     * Emits an error. By default this will emit a resource not found error.
     *
     * `{
     *       ok: false,
     *       status: 404,
     *       statusText: "NOT_FOUND",
     *       body: [{
     *           errorCode: "NOT_FOUND",
     *           message: "The requested resource does not exist",
     *       }]
     *  }`
     */
    error(body?: any, status?: number, statusText?: string): void;

    /**
     * Emits an error. By default this will emit a resource not found error.
     *
     * @param errorOptions
     * @param filterFn     When provided, it will be invoked for every adapter instance on the
     *                     component with its associated config; if it returns true, the error will be
     *                     emitted to that particular instance.
     */
    emitError(
        errorOptions?: { body?: any, status?: number, statusText?: string },
        filterFn?: (config) => boolean
    ): void;

    /**
     * Gets the last resolved config. Useful if component @wire uses includes
     * dynamic parameters.
     */
    getLastConfig(): object;
}

interface FetchResponse {
    body: any,
    ok: false,
    status: number,
    statusText: string,
}
```

### createApexTestWireAdapter

```js
/**
 * Returns a wire adapter that connects to an Apex method and provides APIs
 * to emit data and errors in the expected shape. For example, the emitted shape
 * is `{ data: object|undefined, error: FetchResponse|undefined}`.
 *
 * @param {Function} An apex adapters are also callable, this function will be called
 *                   when the wire adapter is invoked imperatively.
 */
createApexTestWireAdapter(fn: Function): ApexTestWireAdapter;

interface ApexTestWireAdapter {
    /**
     * Emits data.
     * @param value The data to emit to the component
     * @param filterFn When provided, it will be invoked for every adapter instance on the
     *                 component with its associated config; if it returns true, the data will be
     *                 emitted to that particular instance.
     */
    emit(value: object, filterFn?: (config) => boolean): void;

    /**
     * Emits an error. By default this will emit a resource not found error.
     *
     * `{
     *       ok: false,
     *       status: 400,
     *       statusText: "Bad Request",
     *       body: {
     *           message: "An internal server error has occurred",
     *       }
     *  }`
     */
    error(body?: any, status?: number, statusText?: string): void;

    /**
     * Emits an error. By default this will emit a resource not found error.
     *
     * @param errorOptions
     * @param filterFn     When provided, it will be invoked for every adapter instance on the
     *                     component with its associated config; if it returns true, the error will be
     *                     emitted to that particular instance.
     */
    emitError(
        errorOptions?: { body?: any, status?: number, statusText?: string },
        filterFn?: (config) => boolean
    ): void;

    /**
     * Gets the last resolved config. Useful if component @wire uses includes
     * dynamic parameters.
     */
    getLastConfig(): object;
}

interface FetchResponse {
    body: any,
    ok: false,
    status: number,
    statusText: string,
}
```

