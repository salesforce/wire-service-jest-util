/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { HttpFetchResponse, TestWireAdapterTemplate } from './TestWireAdapter';

function buildErrorObject({ body, status, statusText }: HttpFetchResponse) {
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

class ApexTestWireAdapterTemplate extends TestWireAdapterTemplate {
    static emit(value: any, filterFn?: (config: Record<string, any>) => boolean) {
        super.emit({ data: value, error: undefined }, filterFn);
    }

    static emitError(
        errorOptions: HttpFetchResponse,
        filterFn: (config: Record<string, any>) => boolean
    ) {
        const err = buildErrorObject(errorOptions || {});

        super.emit({ data: undefined, error: err }, filterFn);
    }

    static error(body: any, status: number, statusText: string) {
        const err = buildErrorObject({ body, status, statusText });

        super.emit({ data: undefined, error: err });
    }

    constructor(dataCallback: (value: any) => void) {
        super(dataCallback);

        this.emit({ data: undefined, error: undefined });
    }
}

export function buildApexTestWireAdapter() {
    return class ApexTestWireAdapter extends ApexTestWireAdapterTemplate {
        static _lastConfig = null;
        static _wireInstances = new Set<ApexTestWireAdapter>();
    };
}
