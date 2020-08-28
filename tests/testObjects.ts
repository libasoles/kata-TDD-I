import Cart from "../src/Cart";
import Catalog from "../src/Catalog";
import { Book } from "../src/Book";
import CreditCard from "../src/CreditCard";

export function validBook(): Book {
  return 'valid book';
}

export function invalidBook(): Book {
  return 'invalid book';
}

export function anotherValidBook(): Book {
  return 'another valid book';
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

export function validCreditCard(): CreditCard {
  return new CreditCard();
}

export function expiredCreditCard(): CreditCard {
  return new CreditCard();
}