const roleMiddleware = (availableRoles) => (req, res, next) => {
  const currentUserRole = req["user"]?.role;
  if (!currentUserRole) {
    return res.status(401).json("User`s role is not defined");
  }

  if (!availableRoles.includes(currentUserRole)) {
    return res.status(403).json("Acces denied");
  }

  next();
};

module.exports = roleMiddleware;
