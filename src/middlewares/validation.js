const reqMethods = ["body", "params", "headers", "file", "files"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];

    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });

        if (validationResult.error) {
          validationErrors.push(validationResult.error.details);
        }
      }
    }

    if (validationErrors.length) {
      const error = new Error("Validation error");
      error.cause = 400;
      error.details = validationErrors;
      return next(error);
    }

    next();
  };
};
