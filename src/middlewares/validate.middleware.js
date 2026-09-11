export default function validate(schema, target) {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.') || target}: ${issue.message}`)
        .join('; ');
      return res.status(400).json({ error: message });
    }

    req.validated = { ...req.validated, [target]: result.data };
    next();
  };
}