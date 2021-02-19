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

Create a mock/stub of the `x/todoApi` module, and use `createTestWireAdapter` from `@salesforce/wire-service-jest-util` to create a test wire adapter, `getTodo`.

```js
import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

export const getTodo = createTestWireAdapter();
```

Then in your test, import the adapter to emit the data:

 ```js
import { createElement } from 'lwc';
import MyComponent from 'x/myComponent';

// adapter used by the component under test
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

This library provides three utility methods to create test wire adapters used in the tests to emit data and get the last resolved `@wire` configuration.

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

## Migrating from version 2.x to 3.x

### Mock your modules exporting wire adapters
LWC version 1.5.0 includes a [reform to the wire protocol](https://github.com/salesforce/lwc-rfcs/blob/master/text/0000-wire-reform.md). With such reform, the wire-service now requires a wire-adapter in the proper format.

In version 2.x of the library, you may be using a custom mock, for example for `lightning/uiRecordApi`:
```js
export const getRecord = jest.fn();
// ... rest of the mocked module.
```

You will need to change that module mock and use one of the new `create*TestWireAdapter` methods introduced in version 3.x. Example:

```js
import { createTestWireAdapter } from '@salesforce/wire-service-jest-utils';
export const getRecord = createLdsTestWireAdapter();
// ... rest of the mocked module
```

### Remove register*TestWireAdapter usages

With your wire adapters mocked using `create*TestWireAdapter`, you can use them directly in your test, making `register*TestWireAdapter` unnecessary.

Example:

```js
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { getRecord } from 'lightning/uiRecordApi';

const getRecordWireAdapter = registerLdsTestWireAdapter(getRecord);

// later in your test, emitting value through the wire...
    getRecordWireAdapter.emit(data);
```

can be changed to:

```js
import { getRecord } from 'lightning/uiRecordApi';

// later in your test, emitting value through the wire...
    getRecord.emit(data);
```

<details>
  <summary>Complete migration example</summary>

#### Test with v2.x of this library
```js
// productCard.test.js
import { createElement } from 'lwc';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import ProductCard from 'c/productCard';
import { getRecord } from 'lightning/uiRecordApi';

// Import mock data to send through the wire adapter.
const mockGetRecord = require('./data/getRecord.json');

// Register a test wire adapter.
const getRecordWireAdapter = registerLdsTestWireAdapter(getRecord);

describe('@wire demonstration test', () => {
   // Disconnect the component to reset the adapter. It is also
   // a best practice to clean up after each test.
   afterEach(() => {
       while (document.body.firstChild) {
           document.body.removeChild(document.body.firstChild);
       }
   });

   it('displays product name field', () => {
       const element = createElement('c-product_filter', { is: ProductCard });
       document.body.appendChild(element);
       getRecordWireAdapter.emit(mockGetRecord);

       // Resolve a promise to wait for a rerender of the new content.
       return Promise.resolve().then(() => {
           const content = element.querySelector('.content');
           const nameField = mockGetRecord.fields.Name.value;
           expect(content.textContent).toBe('Name:${nameField}')

       });
   });
});
```

#### Test migrated to v3.x
```js
// productCard.test.js
import { createElement } from 'lwc';

import ProductCard from 'c/productCard';
import { getRecord } from 'lightning/uiRecordApi';

// Import mock data to send through the wire adapter.
const mockGetRecord = require('./data/getRecord.json');

describe('@wire demonstration test', () => {
   // Disconnect the component to reset the adapter. It is also
   // a best practice to clean up after each test.
   afterEach(() => {
       while (document.body.firstChild) {
           document.body.removeChild(document.body.firstChild);
       }
   });

   it('displays product name field', () => {
       const element = createElement('c-product_filter', { is: ProductCard });
       document.body.appendChild(element);
       getRecord.emit(mockGetRecord);

       // Resolve a promise to wait for a rerender of the new content.
       return Promise.resolve().then(() => {
           const content = element.querySelector('.content');
           const nameField = mockGetRecord.fields.Name.value;
           expect(content.textContent).toBe('Name:${nameField}')

       });
   });
});
```
</details>

### FAQ

- I'm on platform (sfdx) and I don't have any custom mocks for modules exposing wire adapters, should I do anything?

No, all exposed modules in the platform are mocked for you.

- I'm on platform, and I have custom mocks for some modules exposing wire adapters, what should I do?

If you are on platform, we already provide those mocks for you, removing your custom mocks should be enough. If you want to keep your custom mocks, follow the steps in [Migrating from version 2.x to 3.x](#migrating-from-version-2x-to-3x).

- I'm off platform, what should i do?

Follow the steps in [Migrating from version 2.x to 3.x](#migrating-from-version-2x-to-3x).
