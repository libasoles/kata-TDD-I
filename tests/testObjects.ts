import Cart from "../src/Cart";
import Catalog from "../src/Catalog";
import { Book } from "../src/Book";
import CreditCard from "../src/CreditCard";
import MerchantProcessor from "../src/MerchantProcessor";

export function validBook(): Book {
  return "valid book";
}

export function invalidBook(): Book {
  return "invalid book";
}

export function anotherValidBook(): Book {
  return "another valid book";
}

function catalog() {
  return new Catalog([
    { book: validBook(), price: validBookPrice() },
    { book: anotherValidBook(), price: anotherValidBookPrice() },
  ]);
}

export function anotherValidBookPrice(): number {
  return 4;
}

export function validBookPrice(): number {
  return 5.5;
}

export function newCart(): Cart {
  return new Cart(catalog());
}

export function nonEmptyCart(): Cart {
  const cart = newCart();
  cart.add(validBook(), 2);
  cart.add(anotherValidBook(), 1);

  return cart;
}

export function unexpiredCreditCard(): CreditCard {
  return new CreditCard({ month: 1, year: 9999 });
}

export function expiredCreditCard(): CreditCard {
  return new CreditCard({ month: 1, year: 1900 });
}

export function validDate(): Date {
  return new Date(2020, 1, 1);
}

export function invalidDate(): Date {
  return new Date(1899, 1, 1);
}

export function validMerchantProcessor() {
  return {
    creditCardUsed: null,
    totalCharged: null,
    debit(creditCard: CreditCard, total: number) {
      this.creditCardUsed = creditCard;
      this.totalCharged = total;
      return;
    },
  };
}

export function unavailableMerchantProcessor(): MerchantProcessor {
  return {
    debit(creditCard: CreditCard, total: number) {
      throw Error(MerchantProcessor.MERCHANT_PROCESSOR_IS_NOT_AVAILABLE);
    },
  };
}

export function merchantProcessorThatRejectsCard(): MerchantProcessor {
  return {
    debit(creditCard: CreditCard, total: number) {
      throw Error(MerchantProcessor.CREDIT_CARD_REJECTED);
    },
  };
}
