import Cart from "../src/Cart";
import Catalog from "../src/Catalog";
import { Book, ISBN } from "../src/Book";
import CreditCard from "../src/CreditCard";
import { MerchantProcessor, TransactionId } from "../src/MerchantProcessor";
import { CartId, ClientId, Password, TusLibros } from "../src/TusLibros";
import { Clock } from "../src/Clock";
import { Ledger } from "../src/Ledger";
import { ContactBook } from "../src/ContactBook";
import { Cashier } from "../src/Cashier";

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

export function newTusLibros(
  opts: Partial<{
    catalog: Catalog;
    clock: Clock;
    merchantProcessor: MerchantProcessor;
    ledger: Ledger;
    contactBook: ContactBook;
  }> = {}
): TusLibros {
  return new TusLibros(
    opts?.catalog ?? validCatalog(),
    opts?.clock ?? systemClock(),
    opts?.merchantProcessor ?? validMerchantProcessor(),
    opts?.ledger ?? new Ledger(),
    opts?.contactBook ?? validContactBook()
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
  return new CreditCard("cc number", "cc owner", { month: 1, year: 9999 });
}

export function expiredCreditCard(): CreditCard {
  return new CreditCard("cc number", "cc owner", { month: 1, year: 1900 });
}

export function validDate(): Date {
  return new Date(2020, 1, 1);
}

export function invalidDate(): Date {
  return new Date(1899, 1, 1);
}

export type InspectableMerchantProcessor = MerchantProcessor & {
  creditCardUsed: CreditCard | null;
  totalCharged: number | null;
  lastTransactionId: TransactionId | null;
};

export function validMerchantProcessor(): InspectableMerchantProcessor {
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

export type UnrelialableMerchantProcessor = InspectableMerchantProcessor & {
  available(): void;
};

export function unavailableMerchantProcessor(): UnrelialableMerchantProcessor {
  let isAvailable = false;
  return {
    creditCardUsed: null,
    totalCharged: null,
    lastTransactionId: null,
    available() {
      isAvailable = true;
    },
    debit(creditCard: CreditCard, total: number) {
      if (isAvailable) {
        this.creditCardUsed = creditCard;
        this.totalCharged = total;
        this.lastTransactionId = "<valid transaction id>";
        return this.lastTransactionId;
      }
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

export function newCashier(opts?: {
  cart?: Cart;
  creditCard?: CreditCard;
  today?: Date;
  merchantProcessor?: MerchantProcessor;
}): Cashier {
  return new Cashier(
    opts?.cart ?? newCart(),
    opts?.creditCard ?? unexpiredCreditCard(),
    opts?.today ?? validDate(),
    opts?.merchantProcessor ?? validMerchantProcessor()
  );
}
