const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/removebg",
    createProxyMiddleware({
      target: "https://api.remove.bg",
      changeOrigin: true,
      pathRewrite: { "^/api/removebg": "/v1.0/removebg" },
      onProxyReq: (proxyReq) => {
        const apiKey = process.env.REACT_APP_REMOVEBG_API_KEY;
        if (apiKey) {
          proxyReq.setHeader("X-Api-Key", apiKey);
        }
      },
    })
  );
};
