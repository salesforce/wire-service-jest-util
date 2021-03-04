/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { TestWireAdapterTemplate } from "./TestWireAdapter";

function buildErrorObject({ body, status, statusText }) {
    if (status && (status < 400 || status > 599)) {
        throw new Error("'status' must be >= 400 or <= 599");
    }

    body = body || [{
        errorCode: 'NOT_FOUND',
        message: 'The requested resource does not exist',
    }];

    status = status || 404;

    statusText = statusText || 'NOT_FOUND';

    return {
        body,
        ok: false,
        status,
        statusText,
    };
}

class LdsTestWireAdapterTemplate extends TestWireAdapterTemplate {
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

        this.emit({ data: undefined, error: undefined })
    }
}

export function buildLdsTestWireAdapter() {
    return class LdsTestWireAdapter extends LdsTestWireAdapterTemplate {
        static _lastConfig = null;
        static _wireInstances = new Set();
    }
}