/* eslint-disable max-classes-per-file */
export class ResourceNotFoundError extends Error {
  constructor(message = 'The Resource was not found') {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}

export class CreatingResourceError extends Error {
  constructor(message = 'An error occurred while creating a resource') {
    super(message);
    this.name = 'CreatingResourceError';
  }
}

export class ManageVmError extends Error {
  constructor(message = 'An error occurred while managing a VM') {
    super(message);
    this.name = 'ManageVmError';
  }
}
