function notFound(req, res, next) {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  err.statusCode = 404;

  next(err);
}

module.exports = notFound;
