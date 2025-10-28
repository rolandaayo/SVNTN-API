module.exports = function (req, res, next) {
  const token = req.get("x-admin-token") || req.query.admin_token;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected)
    return res
      .status(500)
      .json({ error: "server misconfigured: ADMIN_TOKEN missing" });
  if (!token || token !== expected)
    return res.status(401).json({ error: "unauthorized" });
  next();
};
