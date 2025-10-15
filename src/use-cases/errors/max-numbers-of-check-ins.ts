export class MaxNumbersOfCheckInsError extends Error {
  constructor() {
    super(
      "You have reached the maximum number of check-ins allowed for today."
    );
  }
}
