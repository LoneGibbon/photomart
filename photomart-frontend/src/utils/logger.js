// Logger utility for controlled console logging
// Only logs in development environment (based on REACT_APP_ENV)

/**
 * Checks if the app is running in development mode.
 * Logging will be enabled only if this is true.
 */
const isDev = process.env.REACT_APP_ENV === "development";

/**
 * Logs general information messages to the console
 * if the application is in development mode.
 *
 * @param  {...any} args - Any number of arguments to log
 */
export const log = (...args) => {
  if (isDev) {
    console.log("[LOG]:", ...args);
  }
};

/**
 * Logs warning messages to the console
 * if the application is in development mode.
 *
 * @param  {...any} args - Any number of arguments to warn
 */
export const warn = (...args) => {
  if (isDev) {
    console.warn("[WARN]:", ...args);
  }
};

/**
 * Logs error messages to the console
 * if the application is in development mode.
 *
 * @param  {...any} args - Any number of arguments to error
 */
export const error = (...args) => {
  if (isDev) {
    console.error("[ERROR]:", ...args);
  }
};
