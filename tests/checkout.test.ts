
// CHECKOUT
// 3) Registrar la venta en un "Libro de ventas"
// 4) El cliente se lleva el ticket de la "venta"
// 5) Realizar las validaciones de la tarjeta de credito (principalmente la fecha de expiracion)
// 6) 

import { newCart, validBook, invalidDate, anotherValidBook, validBookPrice, anotherValidBookPrice, nonEmptyCart, validCreditCard, expiredCreditCard, validDate } from "./testObjects";
import Cashier from "../src/Cashier";

test("Cannot check out with an empty cart", () => {
  const cart = newCart();

  expect(() => {
    new Cashier(cart, validCreditCard(), validDate())
  }).toThrowError(Cashier.CART_MUST_NOT_BE_EMPTY);
});

test("When check out, the total must be correct", () => {
  const cart = newCart();
  cart.add(validBook(), 2);
  cart.add(anotherValidBook(), 1);

  const cashier = new Cashier(cart, validCreditCard(), validDate());
  const total = cashier.checkOut();

  expect(total).toBe(2 * validBookPrice() + 1 * anotherValidBookPrice());
});

test("Cannot check out with an expired credit card", () => {
  const cart = nonEmptyCart();
  const creditCard = expiredCreditCard();

  expect(() => {
    new Cashier(cart, creditCard, validDate());
  }).toThrowError(Cashier.CERDIT_CARD_IS_EXPIRED);
});

test("Can check out with an expired credit card if the date is correct", () => {
  const cart = nonEmptyCart();
  const creditCard = expiredCreditCard();

  new Cashier(cart, creditCard, invalidDate());
});

// 1) MP caido
// 2) MP rechaza tarjeta
// 3) Pago exitoso
