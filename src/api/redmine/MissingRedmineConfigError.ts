export class MissingRedmineConfigError extends Error {
  constructor(message = "Redmine URL is not configured") {
    super(message);
    this.name = MissingRedmineConfigError.name;
  }
}
