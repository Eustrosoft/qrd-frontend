export class UserAbortError extends Error {
  constructor(abortedAction: string = 'unknown action') {
    super(`User aborted ${abortedAction}`);
  }
}
