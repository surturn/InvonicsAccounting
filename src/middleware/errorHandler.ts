import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  const message = err.message || 'Internal Server Error';

  if (message === 'Period is locked') {
    statusCode = 423;
  } else if (message === 'Journal entry does not balance') {
    statusCode = 422;
  } else if (message.toLowerCase().includes('not found')) {
    statusCode = 404;
  }

  const response: any = {
    error: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : message
  };

  if (process.env.NODE_ENV !== 'production') {
    response.details = err.stack;
  } else if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json(response);
};
