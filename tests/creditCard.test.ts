import CreditCard from "../src/CreditCard";

describe("Credit card", () => {
  describe("number", () => {
    test("must not be blank", () => {
      expect(
        () => new CreditCard("", "owner", { month: 3, year: 99 })
      ).toThrowError(CreditCard.NUMBER_MUST_NOT_BE_BLANK);
    });
  });
  describe("owner", () => {
    test("must not be blank", () => {
      expect(
        () => new CreditCard("number", "", { month: 3, year: 99 })
      ).toThrowError(CreditCard.OWNER_MUST_NOT_BE_BLANK);
    });
    test("must have at most 30 characters", () => {
      expect(
        new CreditCard("number", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", {
          month: 3,
          year: 99,
        })
      ).toBeDefined();
      expect(
        () =>
          new CreditCard("number", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", {
            month: 3,
            year: 99,
          })
      ).toThrowError(CreditCard.OWNER_MUST_HAVE_AT_MOST_30_CHARS);
    });
  });
  describe("exporation", () => {
    test("month must be valid", () => {
      expect(
        () => new CreditCard("number", "owner", { month: 0, year: 1 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        () => new CreditCard("number", "owner", { month: -1, year: 1 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        () => new CreditCard("number", "owner", { month: 13, year: 1 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        () => new CreditCard("number", "owner", { month: 1 / 2, year: 1 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        new CreditCard("number", "owner", { month: 1, year: 1 })
      ).toBeDefined();
    });
    test("year must be valid", () => {
      expect(
        () => new CreditCard("number", "owner", { month: 1, year: -1 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        () => new CreditCard("number", "owner", { month: 1, year: 0 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        () => new CreditCard("number", "owner", { month: 1, year: 1 / 2 })
      ).toThrowError(CreditCard.INVALID_EXPIRATION);
      expect(
        new CreditCard("number", "owner", { month: 1, year: 1 })
      ).toBeDefined();
    });
  });
});
