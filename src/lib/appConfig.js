export const appConfig = {
  appName: "OmniFix Digital",
  version: import.meta.env.VITE_APP_VERSION ?? "0.1.0",
  environment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? "development",
  buildDate: import.meta.env.VITE_BUILD_DATE ?? new Date().toISOString(),
};
