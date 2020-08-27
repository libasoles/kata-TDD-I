
// CHECKOUT
// 3) Registrar la venta en un "Libro de ventas"
// 4) El cliente se lleva el ticket de la "venta"
// 5) Realizar las validaciones de la tarjeta de credito (principalmente la fecha de expiracion)
// 6) 

import { newCart, validBook, anotherValidBook, validBookPrice, anotherValidBookPrice, nonEmptyCart, validCreditCard, expiredCreditCard } from "./testObjects";
import Cashier from "../src/Cashier";

test("Cannot check out with an empty cart", () => {
  const cart = newCart();

  expect(() => {
    new Cashier(cart, validCreditCard())
  }).toThrowError(Cashier.CART_MUST_NOT_BE_EMPTY);
});

test("When check out, the total must be correct", () => {
  const cart = newCart();
  cart.add(validBook(), 2);
  cart.add(anotherValidBook(), 1);

  const cashier = new Cashier(cart, validCreditCard());
  const total = cashier.checkOut();

  expect(total).toBe(2 * validBookPrice() + 1 * anotherValidBookPrice());
});

test("Cannot check out with an expired credit card", () => {
  const cart = nonEmptyCart();
  const creditCard = expiredCreditCard();

  expect(() => {
    new Cashier(cart, creditCard);
  }).toThrowError(Cashier.CERDIT_CARD_IS_EXPIRED);
});