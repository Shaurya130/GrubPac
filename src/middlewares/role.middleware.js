const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // role check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    next();
  };
};

export default roleMiddleware;