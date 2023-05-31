let hostname = window.origin;
let siteName = "weexch666";
let isCaptcha = false;
let isPoker = false

 if (hostname.indexOf('weexch666.com') > -1) {
  siteName = 'weexch666';
  isCaptcha = false;
  isPoker = true;
}

export const environment = {
  production: true,
  baseUrl: "http://136.244.79.114:82",
  // baseUrl: "http://95.179.144.126:82", // Dev
  apisUrl: "https://access.streamingtv.fun:3446/api/all_apis",
  oddsUrl: "http://209.250.242.175:33332",
  raceUrl: "http://209.250.242.175:33333",
  scoreUrl: "https://access.streamingtv.fun:3440",
  tvUrl: "https://streamingtv.fun/live_tv/index.html",
  oddsSocketUrl: "ws://209.250.242.175",
  exchangeGamesUrl: "http://209.250.242.175:43333",
  siteName: siteName,
  isCaptcha: isCaptcha,
  isPoker:isPoker,

};
