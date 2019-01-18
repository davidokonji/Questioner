export default (req, res, next) => {
  if (!req.user.isadmin) {
    return res.status(403).json({
      status: 403,
      error: 'access denied, not an admin user',
    });
  }
  return next();
};
