/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { generateAdapter } from "./adapter";

function buildErrorObject({ body, status, statusText }) {
    if (status && (status < 400 || status > 599)) {
        throw new Error("'status' must be >= 400 or <= 599");
    }

    body = body || {
        message: 'An internal server error has occurred',
    };

    status = status || 400;

    statusText = statusText || 'Bad Request';

    return {
        body,
        ok: false,
        status,
        statusText,
    };
}

export function buildApexTestWireAdapter() {
    return class ApexTestWireAdapter extends generateAdapter() {
        static emit(value, filterFn) {
            super.emit({ data: value, error: undefined }, filterFn);
        }

        static emitError(errorOptions, filterFn) {
            const err = buildErrorObject(errorOptions || {});

            super.emit({ data: undefined, error: err }, filterFn);
        }

        static error(body, status, statusText) {
            const err = buildErrorObject({ body, status, statusText });

            super.emit({ data: undefined, error: err });
        }

        constructor(dataCallback) {
            super(dataCallback);

            this.emit({ data: undefined, error: undefined });
        }
    };
}