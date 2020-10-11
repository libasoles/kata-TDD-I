import Cart from "../src/Cart";
import Catalog from "../src/Catalog";
import { Book, ISBN } from "../src/Book";
import CreditCard from "../src/CreditCard";
import { MerchantProcessor, TransactionId } from "../src/MerchantProcessor";
import { CartId, ClientId, Password, TusLibros } from "../src/TusLibros";
import { Clock } from "../src/Clock";
import { Ledger } from "../src/Ledger";
import { ContactBook } from "../src/ContactBook";

export function validISBN(): ISBN {
  return "<a valid ISBN>";
}

export function invalidISBN(): ISBN {
  return "<an invalid ISBN>";
}

export function anotherValidISBN(): ISBN {
  return "<another valid ISBN>";
}

export function validBook(): Book {
  return new Book(validISBN());
}

export function invalidBook(): Book {
  return new Book(invalidISBN());
}

export function anotherValidBook(): Book {
  return new Book(anotherValidISBN());
}

export function validCatalog(): Catalog {
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
  return new Cart(validCatalog());
}

export function newTusLibros(): TusLibros {
  return new TusLibros(
    validCatalog(),
    systemClock(),
    validMerchantProcessor(),
    new Ledger(),
    validContactBook()
  );
}

export function validContactBook(): ContactBook {
  const contactBook = new ContactBook();
  contactBook.addClient({}, validPassword());
  return contactBook;
}

export function systemClock(): Clock {
  return {
    now() {
      return new Date();
    },
  };
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

export function validMerchantProcessor(): MerchantProcessor & {
  creditCardUsed: CreditCard | null;
  totalCharged: number | null;
  lastTransactionId: TransactionId | null;
} {
  return {
    creditCardUsed: null,
    totalCharged: null,
    lastTransactionId: null,
    debit(creditCard: CreditCard, total: number) {
      this.creditCardUsed = creditCard;
      this.totalCharged = total;
      this.lastTransactionId = "<valid transaction id>";
      return this.lastTransactionId;
    },
  };
}

export function unavailableMerchantProcessor(): MerchantProcessor {
  return {
    debit(_creditCard: CreditCard, _total: number) {
      throw Error(MerchantProcessor.MERCHANT_PROCESSOR_IS_NOT_AVAILABLE);
    },
  };
}

export function merchantProcessorThatRejectsCard(): MerchantProcessor {
  return {
    debit(_creditCard: CreditCard, _total: number) {
      throw Error(MerchantProcessor.CREDIT_CARD_REJECTED);
    },
  };
}

export function invalidClientId(): ClientId {
  return "invalid client";
}

export function validClientId(): ClientId {
  return "1";
}

export function invalidPassword(): Password {
  return "invalid password";
}

export function validPassword(): Password {
  return "password";
}

export function invalidCartId(): CartId {
  return invalidClientId();
}
