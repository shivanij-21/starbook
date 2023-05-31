// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let hostname = window.origin;
let siteName = "weexch666";
let isCaptcha = true;
let isPoker = true

export const environment = {
  production: false,
  currency: 'INR',
  baseUrl: "http://136.244.79.114:82",
  // baseUrl: 'http://136.244.79.114:81', // Test
  apisUrl: "https://streamingtv.fun:3458/api/all_apis",
  // baseUrl: "http://95.179.144.126:82", // Dev
  oddsUrl: "http://209.250.242.175:33332",
  raceUrl: "http://209.250.242.175:33333",
  scoreUrl: "https://access.streamingtv.fun:3440",
  tvUrl: "https:/streamingtv.fun/live_tv0test/index.html",
  oddsSocketUrl: "ws://209.250.242.175",
  exchangeGamesUrl: "http://209.250.242.175:43333",
  siteName: siteName,
  isCaptcha: isCaptcha,
  isPoker:isPoker,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
