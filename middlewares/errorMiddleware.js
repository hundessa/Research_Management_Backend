const errorMiddleware = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // DEVELOPMENT MODE
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // PRODUCTION MODE
  if (process.env.NODE_ENV === "production") {
    // Trusted operational error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or unknown error
    console.error("UNEXPECTED ERROR:", err);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export default errorMiddleware;