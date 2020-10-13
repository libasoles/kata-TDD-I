export type MonthYear = { month: number; year: number };

export default class CreditCard {
  static NUMBER_MUST_NOT_BE_BLANK = "Number must not be blank";
  static OWNER_MUST_NOT_BE_BLANK = "Owner must not be blank";
  static OWNER_MUST_HAVE_AT_MOST_30_CHARS =
    "Owner must have at most 30 characters";
  static INVALID_EXPIRATION = "Invalid expiration";

  constructor(
    readonly number: string,
    readonly owner: string,
    readonly expiration: Readonly<MonthYear>
  ) {
    if (!number) throw new Error(CreditCard.NUMBER_MUST_NOT_BE_BLANK);
    if (!owner) throw new Error(CreditCard.OWNER_MUST_NOT_BE_BLANK);
    if (owner.length > 30)
      throw new Error(CreditCard.OWNER_MUST_HAVE_AT_MOST_30_CHARS);
    if (
      !Number.isInteger(expiration.month) ||
      expiration.month <= 0 ||
      expiration.month > 12
    )
      throw new Error(CreditCard.INVALID_EXPIRATION);
    if (!Number.isInteger(expiration.year) || expiration.year <= 0)
      throw new Error(CreditCard.INVALID_EXPIRATION);
  }

  isExpiredAt(aDate: Date): boolean {
    return (
      aDate >= new Date(this.expiration.year, this.expiration.month + 1, 1)
    );
  }
}
