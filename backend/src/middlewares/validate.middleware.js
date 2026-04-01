import { ApiError } from '../utils/ApiError.js';

const formatIssueMessage = (issue) => {
  const path = issue.path?.join('.') || 'request';
  const lastPathPart = issue.path?.[issue.path.length - 1];
  const fieldName = typeof lastPathPart === 'string' ? lastPathPart : path;

  if (issue.code === 'invalid_type') {
    if (issue.received === 'undefined') {
      return `${fieldName} is required`;
    }

    if (issue.expected) {
      return `${fieldName} must be ${issue.expected}`;
    }
  }

  if (issue.code === 'too_small' && issue.minimum !== undefined) {
    if (issue.type === 'string') {
      return `${fieldName} must be at least ${issue.minimum} characters`;
    }

    return `${fieldName} must be at least ${issue.minimum}`;
  }

  if (issue.code === 'too_big' && issue.maximum !== undefined) {
    if (issue.type === 'string') {
      return `${fieldName} must be at most ${issue.maximum} characters`;
    }

    return `${fieldName} must be at most ${issue.maximum}`;
  }

  if (issue.code === 'invalid_string') {
    if (issue.validation === 'email') {
      return `${fieldName} must be a valid email address`;
    }

    return `${fieldName} has invalid format`;
  }

  return issue.message || `${fieldName} is invalid`;
};

const buildValidationDetails = (zodError) => {
  const errors = zodError.issues.map((issue) => {
    const path = issue.path?.join('.') || 'request';
    return {
      path,
      message: formatIssueMessage(issue),
      code: issue.code,
    };
  });

  const fieldErrors = errors.reduce((acc, error) => {
    if (!acc[error.path]) {
      acc[error.path] = [];
    }
    acc[error.path].push(error.message);
    return acc;
  }, {});

  return {
    formErrors: [],
    fieldErrors,
    errors,
  };
};

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const details = buildValidationDetails(result.error);
    const firstErrorMessage = details.errors[0]?.message || 'Validation failed';
    return next(new ApiError(400, firstErrorMessage, details));
  }

  req.validated = result.data;
  return next();
};
