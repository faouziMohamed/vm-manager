/* eslint-disable max-classes-per-file */

export class AppException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppException';
  }
}

export class AppUserDoesNotExistException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'AppUserDoesNotExistException';
  }
}

export class AppUserAlreadyExistsException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'AppUserAlreadyExistsException';
  }
}
