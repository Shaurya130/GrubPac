const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
  };
};

export default validate;