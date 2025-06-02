function logRequest(req) {
  console.log('Route: ', req.route.path);
}

export const validateJoi = (schema, payload) => {
  const { value, error } = schema.validate(payload);
  if (error) {
    const { message, details } = error;
    return {
      value: message,
      error: { details: details.map((item) => ({ message: item.message })) },
    };
  }
  return {
    value,
    error: null,
  }
}

export const controller = async (req, res, next, { validate, exec }) => {
  try {
    logRequest(req);

    // validate
    if (validate) {
      const validation = validate(req);

      if (validation?.error) {
        throw new Error(
          'Validation failed',
          validation.error.details.map((d) => d.message),
        );
      }
      if (validation?.value) {
        req.body = validation.value;
      }
    }

    // exec
    const response = await exec(req, res);
    const data = response?.data || null;

    res.status(200).send({ success: true, data, time: new Date() });
  } catch (err) {
    console.log('Request failed', JSON.stringify(err, null, 2));
    res.status(400).send({ success: false, error: JSON.stringify(err.message), time: new Date() });
  }
}

export const control = ({ sanitize, validate, exec }) => {
  return (req, res, next) => controller(req, res, next, { validate, exec });
}