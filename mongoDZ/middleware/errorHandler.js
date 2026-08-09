function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      kind: e.kind,
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  if (err.name === "CastError") {
    const message =
      err.path === "_id"
        ? `Invalid id: "${err.value}" is not a valid ObjectId`
        : `Invalid value "${err.value}" for field "${err.path}"`;

    return res.status(400).json({ message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];

    return res.status(400).json({
      message: `Duplicate value for field "${field}"`,
    });
  }

  const status = err.statusCode || 500;

  if (status === 500) {
    console.error(err.stack);

    return res.status(500).json({ message: "Server error" });
  }

  res.status(status).json({ message: err.message });
}

module.exports = errorHandler;
