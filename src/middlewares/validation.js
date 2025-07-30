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
      return next(
        new Error(
          { message: "validation error", validationErrors },
          { cause: 400 }
        )
      );
    }

    next();
  };
};
