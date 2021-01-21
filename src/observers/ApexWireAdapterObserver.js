/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { TestWireAdapterObserver } from "./TestWireAdapterObserver";

export class ApexWireAdapterObserver extends TestWireAdapterObserver {
    onCreate(instance) {
        instance.emit({ data: undefined, error: undefined });
    }

    emit(value) {
        super.emit({ data: value, error: undefined });
    }

    error(body, status, statusText) {
        if (status && (status < 400 || status > 599)) {
            throw new Error("'status' must be >= 400 or <= 599");
        }

        body = body || {
            message: 'An internal server error has occurred',
        };

        status = status || 400;

        statusText = statusText || 'Bad Request';

        const err = {
            body,
            ok: false,
            status,
            statusText,
        };

        super.emit({ data: undefined, error: err });
    }
}