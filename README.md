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

Mock the `getTodo` wire adapter.

```js
import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

export const getTodo = createTestWireAdapter();
```

 ```js
import { createElement } from 'lwc';
import MyComponent from 'x/myComponent';

// adapter identifier used by the component under test
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

The utility works by allowing component unit tests to register a wire adapter for an arbitrary identifier. Registration returns a test adapter which has the ability to emit data and get the last resolved `@wire` configuration.

### Adapter Types

There are three flavors of test adapters: Lightning Data Service (LDS), Apex, and generic. All allow test authors to emit data through the wire. The main difference is that the LDS and Apex wire adapters follow certain patterns that are automatically handled by the test adapters. These patterns include the shape in which data and errors are emitted, and an initial object emitted during registration. The generic test adapter directly emits any data passed to it. See the API section below for more details.

## API

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
    /** Emits data. */
    emit(value: object): void;

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
    /** Emits data. */
    emit(value: object): void;

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

/**
 * Returns a generic wire adapter for the given identifier. Emitted values may be of
 * any shape.
 *
 * @param {Function} This parameter might be used to implement adapters that can be invoked imperatively (like the Apex one).
 */
createTestWireAdapter(identifier: Function): TestWireAdapter;

interface TestWireAdapter {
    /** Emits any value of any shape. */
    emit(value: any): void;

    /**
     * Gets the last resolved config. Useful if component @wire uses includes
     * dynamic parameters.
     */
    getLastConfig(): object
}
```

## Migrating from version 2.x to 3.x

LWC version 1.5.0 includes a [reform to the wire protocol](https://github.com/salesforce/lwc-rfcs/blob/master/text/0000-wire-reform.md). With such reform, the wire-service now requires a wire-adapter in the proper format.

In version 2.x of the library, you may be using a custom mock, for example for `lightning/navigation`:
```js
export const CurrentPageReference = jest.fn();
// ... rest of the mocked module.
```

You will need to change that module mock and use one of the new `create*TestWireAdapter` methods introduced in version 3.x. Example:

```js
import { createTestWireAdapter } from '@salesforce/wire-service-jest-utils';
export const CurrentPageReference = createTestWireAdapter();
// ... rest of the mocked module
```

### FAQ

- I'm on platform (sfdx) and I don't have any custom mocks for modules exposing wire adapters, should I do anything?

No, all exposed modules in the platform are mocked for you.

- I'm on platform, and I have custom mocks for some modules exposing wire adapters, what should I do?

If you are on platform, we already provide those mocks for you, removing your custom mocks should be enough. If you want to keep your custom mocks, follow the steps in [Migrating from version 2.x to 3.x](#migrating-from-version-2x-to-3x).

- I'm off platform, what should i do?

Follow the steps in [Migrating from version 2.x to 3.x](#migrating-from-version-2x-to-3x).
