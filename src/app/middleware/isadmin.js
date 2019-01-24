export default (req, res, next) => {
  if (!req.user.isadmin) {
    return res.status(401).json({
      status: 401,
      error: 'access denied, not an admin user',
    });
  }
  return next();
};
