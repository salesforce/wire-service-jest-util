/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { spyOnAdapter } from "./utils";

export default function createAdapter(adapterId) {
    let done = false;
    let lastConfig;
    const wiredEventTargets = new Set();
    const spy = {
        createInstance(wiredEventTarget) {
            done = false;
            wiredEventTargets.add(wiredEventTarget);
            wiredEventTarget.emit({ data: undefined, error: undefined });
        },
        connect(wiredEventTarget) {
            done = false;
            lastConfig = {};
            wiredEventTargets.add(wiredEventTarget);
        },
        update(wiredEventTarget, config) {
            lastConfig = config;
        },
        disconnect(wiredEventTarget) {
            done = true;
            lastConfig = undefined;
            wiredEventTargets.delete(wiredEventTarget);
        }
    };

    spyOnAdapter(spy, adapterId);

    return {
        emit(value) {
            if (!done) {
                wiredEventTargets.forEach(
                    wiredEventTarget => wiredEventTarget.emit({ data: value, error: undefined })
                );
            }
        },
        error(body, status, statusText) {
            if (!done) {
                done = true;

                if (status && (status < 400 || status > 599)) {
                    throw new Error("'status' must be >= 400 or <= 599");
                }

                body = body || [{
                    errorCode: 'NOT_FOUND',
                    message: 'The requested resource does not exist',
                }];

                status = status || 404;

                statusText = statusText || 'NOT_FOUND';

                const err = {
                    body,
                    ok: false,
                    status,
                    statusText,
                };

                wiredEventTargets.forEach(
                    wiredEventTarget => wiredEventTarget.emit({ data: undefined, error: err })
                );
            }
        },
        getLastConfig() {
            return lastConfig;
        }
    };
}
