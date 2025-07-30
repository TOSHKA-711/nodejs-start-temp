export const errorHandler = (api) => {
  return async (req, res, next) => {
    try {
      await api(req, res, next);
    } catch (err) {
      res.status(500).json({ message: "Failed", err });
       console.error("Internal Error:", err);
    }
  };
};

export const globalError = (err, req, res, next) => {
  if (err) {
    return res.status(err.cause || 500).json({ message: err.message });
  }
};
