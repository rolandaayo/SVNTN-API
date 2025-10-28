module.exports = function (req, res, next) {
  const token = req.get("x-admin-token") || req.query.admin_token;
  const expected = process.env.ADMIN_TOKEN;
  // If ADMIN_TOKEN is not set or is the default placeholder, allow admin routes
  if (!expected || expected === "change-me-to-a-secure-token") {
    console.warn(
      "ADMIN_TOKEN not set or using default placeholder — admin routes are open"
    );
    return next();
  }
  if (!token || token !== expected)
    return res.status(401).json({ error: "unauthorized" });
  next();
};
