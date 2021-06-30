# Migrating from version 2.x to 3.x

## Mock your modules exporting wire adapters
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

## Remove register*TestWireAdapter usages

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

### Test with v2.x of this library
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

### Test migrated to v3.x
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

## FAQ

**I have an SFDX project, and I don't have any custom mocks for modules exposing wire adapters, should I do anything?**

No, all exposed modules in the platform are mocked for you.

**Note:** The platform does not mock apex and apexContinuation methods, and test authors will need to keep implementing their mocks. Notice that when testing an apex method used with `@wire`, you should change your apex method mock to use `createApexTestWireAdapter`.

**I have an SFDX project, and I have custom mocks for some modules exposing wire adapters, what should I do?**

If you are on platform, we already provide those mocks for you, removing your custom mocks should be enough. If you want to keep your custom mocks, follow the steps in [Migrating from version 2.x to 3.x](#migrating-from-version-2x-to-3x).

**I have an LWC OSS project, what should I do?**

Follow the steps in [Migrating from version 2.x to 3.x](#migrating-from-version-2x-to-3x).