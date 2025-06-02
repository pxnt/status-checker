import { ORG_ROLES } from '../config/constants.js';

export function isAdmin(req, res, next) {
  if (req.auth?.orgRole && req.auth?.orgRole !== ORG_ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden', message: 'You are not authorized to perform this action' });
  }
  next();
}