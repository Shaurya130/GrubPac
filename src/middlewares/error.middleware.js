const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.log(err);

  // multer file size
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,

      message: 'File size exceeds 10MB',
    });
  }

  // multer invalid file
  if (
    err.message?.includes('Only JPG')
  ) {
    return res.status(400).json({
      success: false,

      message: err.message,
    });
  }

  // zod validation
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,

      message: err.errors[0].message,
    });
  }

  res.status(500).json({
    success: false,

    message:
      err.message ||
      'Internal server error',
  });
};

export default errorMiddleware;4
