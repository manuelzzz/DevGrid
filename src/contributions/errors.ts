export type ContributionProvider = "github" | "gitlab";

/** Thrown when fetching contribution data from a provider fails. */
export class ContributionFetchError extends Error {
  constructor(
    public readonly provider: ContributionProvider,
    message: string,
  ) {
    super(message);
    this.name = "ContributionFetchError";
  }
}
