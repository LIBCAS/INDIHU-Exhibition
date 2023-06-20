// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      //target: "https://indihu.inqool.cz/", // DEV server
      target: "https://exhibition-test.indihu.cz/", // TEST server
      secure: false,
      changeOrigin: true,
    })
  );
};
