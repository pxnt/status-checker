export function isLoggedin(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({ error: 'Unauthorized', message: 'You are not authorized to perform this action' });
  }
  next();
}