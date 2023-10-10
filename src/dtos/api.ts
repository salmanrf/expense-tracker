import { ErrorDetails } from 'src/types/app.config';

export class BaseError {
  code: number;
  details: ErrorDetails;
}

export class BaseAPIResponse<T> {
  data: T | null;
  errors: BaseError | null;
  message: string;
}
