let hostname = window.origin;
let siteName = "weexch666";

 if (hostname.indexOf('weexch666.com') > -1) {
  siteName = 'weexch666';
}

export const environment = {
  production: true,
  siteName: siteName
};
