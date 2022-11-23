// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://exhibition-test.indihu.cz/",
      secure: false,
      changeOrigin: true,
    })
  );
};
