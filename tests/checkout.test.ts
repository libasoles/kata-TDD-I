import {
  newCart,
  validBook,
  invalidDate,
  anotherValidBook,
  validBookPrice,
  anotherValidBookPrice,
  nonEmptyCart,
  unexpiredCreditCard,
  expiredCreditCard,
  validDate,
  unavailableMerchantProcessor,
  merchantProcessorThatRejectsCard,
  validMerchantProcessor,
} from "./testObjects";
import { Cashier } from "../src/Cashier";
import { MerchantProcessor } from "../src/MerchantProcessor";

describe("Checkout process", () => {
  test("Cannot check out with an empty cart", () => {
    const cart = newCart();

    expect(() => {
      new Cashier(
        cart,
        unexpiredCreditCard(),
        validDate(),
        validMerchantProcessor()
      );
    }).toThrowError(Cashier.CART_MUST_NOT_BE_EMPTY);
  });

  test("When check out, the total must be correct", () => {
    const cart = newCart();
    cart.add(validBook(), 2);
    cart.add(anotherValidBook(), 1);

    const cashier = new Cashier(
      cart,
      unexpiredCreditCard(),
      validDate(),
      validMerchantProcessor()
    );
    const receipt = cashier.checkOut();

    expect(receipt.total).toBe(
      2 * validBookPrice() + 1 * anotherValidBookPrice()
    );
  });

  test("Cannot check out with an expired credit card", () => {
    const cart = nonEmptyCart();
    const creditCard = expiredCreditCard();

    expect(() => {
      new Cashier(cart, creditCard, validDate(), validMerchantProcessor());
    }).toThrowError(Cashier.CREDIT_CARD_IS_EXPIRED);
  });

  test("Can check out with an expired credit card if the date is correct", () => {
    const cart = nonEmptyCart();
    const creditCard = expiredCreditCard();

    new Cashier(cart, creditCard, invalidDate(), validMerchantProcessor());
  });

  test("Cannot checkout when Merchant Processor is down", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = unavailableMerchantProcessor();
    const cashier = new Cashier(
      cart,
      creditCard,
      validDate(),
      merchantProcessor
    );

    expect(() => {
      cashier.checkOut();
    }).toThrowError(MerchantProcessor.MERCHANT_PROCESSOR_IS_NOT_AVAILABLE);
  });

  test("Merchant process rejects invalid credit card", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = merchantProcessorThatRejectsCard();
    const cashier = new Cashier(
      cart,
      creditCard,
      validDate(),
      merchantProcessor
    );

    expect(() => {
      cashier.checkOut();
    }).toThrowError(MerchantProcessor.CREDIT_CARD_REJECTED);
  });

  test("Payment succeeded", () => {
    const cart = nonEmptyCart();
    const creditCard = unexpiredCreditCard();
    const merchantProcessor = validMerchantProcessor();
    const cashier = new Cashier(
      cart,
      creditCard,
      validDate(),
      merchantProcessor
    );

    const receipt = cashier.checkOut();

    expect(merchantProcessor.creditCardUsed).toBe(creditCard);
    expect(merchantProcessor.totalCharged).toBe(receipt.total);
    expect(merchantProcessor.lastTransactionId).toBe(receipt.transactionId);
  });
});
