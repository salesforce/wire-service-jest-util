/**
 * Returns a generic wire adapter for the given identifier. Emitted values may be of
 * any shape.
 *
 * @param {Function} This parameter might be used to implement adapters that can be invoked imperatively (like the Apex one).
 */
export function createTestWireAdapter(identifier: Function): TestWireAdapter;

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
  getLastConfig(): object;
}
/**
 * Returns a wire adapter mock that mimics Lightning Data Service (LDS) adapters behavior,
 * emitted data and error shapes. For example, the emitted shape is
 * `{ data: object|undefined, error: FetchResponse|undefined}`.
 *
 * @param {Function} This parameter might be used to implement adapters that can be invoked imperatively (like the Apex one).
 */
export function createLdsTestWireAdapter(fn: Function): LdsTestWireAdapter;

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
    errorOptions?: { body?: any; status?: number; statusText?: string },
    filterFn?: (config) => boolean
  ): void;

  /**
   * Gets the last resolved config. Useful if component @wire uses includes
   * dynamic parameters.
   */
  getLastConfig(): object;
}

interface FetchResponse {
  body: any;
  ok: false;
  status: number;
  statusText: string;
}

/**
 * Returns a wire adapter that connects to an Apex method and provides APIs
 * to emit data and errors in the expected shape. For example, the emitted shape
 * is `{ data: object|undefined, error: FetchResponse|undefined}`.
 *
 * @param {Function} fn An apex adapters are also callable, this function will be called
 *                   when the wire adapter is invoked imperatively.
 */
export function createApexTestWireAdapter(fn: Function): ApexTestWireAdapter;

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
    errorOptions?: { body?: any; status?: number; statusText?: string },
    filterFn?: (config) => boolean
  ): void;

  /**
   * Gets the last resolved config. Useful if component @wire uses includes
   * dynamic parameters.
   */
  getLastConfig(): object;
}
