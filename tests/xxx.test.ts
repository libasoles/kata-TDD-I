import Cart from "../src/Cart";
import Book from "../src/Book";

test("Cart should be create empty properly", () => {
  const cart = new Cart();
  
  expect(cart.isEmpty()).toBeTruthy();
});

test("Cart should allow us to add a book properly", () => {
  const cart = new Cart();
  const book = 'valid book';
  
  cart.addBook(book);
  
  expect(cart.isEmpty()).toBeFalsy();
});

test("Cart should allow us to add more than a book properly", () => {
  const cart = new Cart();
  const book = new Book();

  cart.addBook(book);
  cart.addBook(book);

  expect(cart.isEmpty()).toBeFalsy();
});

