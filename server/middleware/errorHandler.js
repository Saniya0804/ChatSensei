export function errorHandler(err, req, res, next) {
  const status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status === 500 ? "Server error" : err.message,
  });
}