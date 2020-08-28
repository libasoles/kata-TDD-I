import { newCart, validBook, invalidBook } from "./testObjects";
import Cart from "../src/Cart";

test("Cart should be create empty properly", () => {
  expect(newCart().isEmpty()).toBeTruthy();
});

test("Cart should allow us to add a book properly", () => {
  const cart = newCart();
  const book = validBook();
  
  cart.add(book);
  
  expect(cart.isEmpty()).toBeFalsy();
  expect(cart.contains(book)).toBeTruthy();
});

test("Cart should allow us to add more than a book properly", () => {
  const cart = newCart();
  const book = validBook();

  cart.add(book);
  cart.add(book);

  expect(cart.isEmpty()).toBeFalsy();
  expect(cart.contains(book)).toBeTruthy();
  expect(cart.quantityOf(book)).toBe(2);
});

test("Cannot add a book from another editor", () => {
  const cart = newCart();
  const book = invalidBook();

  expect(() => cart.add(book)).toThrowError(Cart.BOOK_MUST_BE_IN_CATALOG);
});

test("Cannot add a negative quantity of books", () => {
  const cart = newCart();
  const book = validBook();

  expect(() => cart.add(book, -1)).toThrowError(Cart.QUANITY_MUST_BE_A_NATURAL);
});

test("Cannot add zero books", () => {
  const cart = newCart();
  const book = validBook();

  expect(() => cart.add(book, 0)).toThrowError(Cart.QUANITY_MUST_BE_A_NATURAL);
});

// TODO
// Despues otra suite para el checkout
// Refactorizar las constantes de error
// Rename editor to publisher
// Refactorizar los asserts en Cart para quantity y editor
// 