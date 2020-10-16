import {
  invalidDate,
  validBookPrice,
  anotherValidBookPrice,
  nonEmptyCart,
  unexpiredCreditCard,
  expiredCreditCard,
  unavailableMerchantProcessor,
  merchantProcessorThatRejectsCard,
  validMerchantProcessor,
  newCashier,
} from "./testObjects";
import { Cashier } from "../src/Cashier";
import { MerchantProcessor } from "../src/MerchantProcessor";

describe("Checkout process", () => {
  test("Cannot check out with an empty cart", () => {
    expect(() => newCashier()).toThrowError(Cashier.CART_MUST_NOT_BE_EMPTY);
  });

  test("When check out, the total must be correct", () => {
    const cart = nonEmptyCart();

    const cashier = newCashier({ cart });
    const receipt = cashier.checkOut();

    expect(receipt.total).toBe(
      2 * validBookPrice() + 1 * anotherValidBookPrice()
    );
  });

  test("Cannot check out with an expired credit card", () => {
    const cart = nonEmptyCart();
    const creditCard = expiredCreditCard();

    expect(() => newCashier({ cart, creditCard })).toThrowError(
      Cashier.CREDIT_CARD_IS_EXPIRED
    );
  });

  test("Can check out with an expired credit card if the date is correct", () => {
    const cart = nonEmptyCart();
    const creditCard = expiredCreditCard();
    const today = invalidDate();
    const merchantProcessor = validMerchantProcessor();
    const cashier = newCashier({ cart, creditCard, today, merchantProcessor });

    const receipt = cashier.checkOut();

    expect(merchantProcessor.creditCardUsed).toBe(creditCard);
    expect(merchantProcessor.totalCharged).toBe(receipt.total);
    expect(merchantProcessor.lastTransactionId).toBe(receipt.transactionId);
  });

  test("Cannot check out twice", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = validMerchantProcessor();
    const cashier = newCashier({ cart, creditCard, merchantProcessor });

    const receipt = cashier.checkOut();

    expect(merchantProcessor.creditCardUsed).toBe(creditCard);
    expect(merchantProcessor.totalCharged).toBe(receipt.total);
    expect(merchantProcessor.lastTransactionId).toBe(receipt.transactionId);

    expect(() => cashier.checkOut()).toThrowError(
      Cashier.CART_ALREADY_PROCESSED
    );
  });

  test("Cannot checkout when Merchant Processor is down", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = unavailableMerchantProcessor();
    const cashier = newCashier({
      cart,
      creditCard,
      merchantProcessor,
    });

    expect(() => cashier.checkOut()).toThrowError(
      MerchantProcessor.MERCHANT_PROCESSOR_IS_NOT_AVAILABLE
    );
  });

  test("Merchant process rejects invalid credit card", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = merchantProcessorThatRejectsCard();
    const cashier = newCashier({
      cart,
      creditCard,
      merchantProcessor,
    });

    expect(() => cashier.checkOut()).toThrowError(
      MerchantProcessor.CREDIT_CARD_REJECTED
    );
  });

  test("Payment succeeded", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = validMerchantProcessor();
    const cashier = newCashier({
      cart,
      creditCard,
      merchantProcessor,
    });

    const receipt = cashier.checkOut();

    expect(merchantProcessor.creditCardUsed).toBe(creditCard);
    expect(merchantProcessor.totalCharged).toBe(receipt.total);
    expect(merchantProcessor.lastTransactionId).toBe(receipt.transactionId);
  });
});
