export class RedmineAuthenticationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = RedmineAuthenticationError.name;
  }
}
