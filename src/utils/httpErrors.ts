export class CustomHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}
export class NotFoundError extends CustomHttpError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends CustomHttpError {
  constructor(message: string) {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

function formatZodError(errors: any[]): string {
  return errors.map(err => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  }).join('; ');
}

export class ValidatedBadRequestError extends CustomHttpError {
  constructor(zodErrors: any) {
    const message = formatZodError(zodErrors);
    super(400, message);
    this.name = 'ValidatedBadRequestError';
  }
}
