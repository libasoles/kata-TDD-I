import { ISBN } from "../src/Book";
import { Purchase } from "../src/Ledger";
import { TusLibros } from "../src/TusLibros";
import {
  anotherValidISBN,
  expiredCreditCard,
  invalidCartId,
  invalidClientId,
  invalidISBN,
  invalidPassword,
  newTusLibros,
  unavailableMerchantProcessor,
  unexpiredCreditCard,
  validBookPrice,
  validClientId,
  validISBN,
  validMerchantProcessor,
  validPassword,
} from "./testObjects";

describe("TusLibros", () => {
  test("A valid client obtains a empty cart", () => {
    const clientId = validClientId();
    const password = validPassword();
    const store = newTusLibros();
    const cartId = store.createCart(clientId, password);

    expect(store.isCartEmpty(cartId)).toBeTruthy();
  });
  test("A valid client cannot creates several carts", () => {
    const clientId = validClientId();
    const password = validPassword();
    const store = newTusLibros();

    store.createCart(clientId, password);

    expect(() => store.createCart(clientId, password)).toThrowError(
      TusLibros.USER_ALREADY_HAS_A_CART
    );
  });
  test("An invalid user cannot create a cart", () => {
    const clientId = invalidClientId();
    const password = validPassword();

    expect(() => {
      newTusLibros().createCart(clientId, password);
    }).toThrowError(TusLibros.INVALID_CLIENT);
  });
  test("A user with an invalid password cannot create a cart", () => {
    const clientId = validClientId();
    const password = invalidPassword();

    expect(() => {
      newTusLibros().createCart(clientId, password);
    }).toThrowError(TusLibros.INVALID_CLIENT);
  });
  test("A user can add a book in catalog to his cart", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, isbn, 1);

    expect(store.isCartEmpty(cartId)).toBeFalsy();
  });
  test("A user cannot add a book that is not in the catalog to his cart", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const isbn = invalidISBN();
    const cartId = store.createCart(clientId, password);

    expect(() => store.addToCart(cartId, isbn, 1)).toThrowError(
      TusLibros.BOOK_NOT_IN_CATALOG
    );
  });
  test("A user cannot add a negative quantity of a book to his cart", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);

    expect(() => store.addToCart(cartId, isbn, -1)).toThrowError(
      TusLibros.QUANTITY_MUST_BE_A_NATURAL
    );
  });
  test("A user cannot add a zero quantity of a book to his cart", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);

    expect(() => store.addToCart(cartId, isbn, 0)).toThrowError(
      TusLibros.QUANTITY_MUST_BE_A_NATURAL
    );
  });
  test("A user cannot add a non natural quantity of a book to his cart", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);

    expect(() => store.addToCart(cartId, isbn, 1 / 2)).toThrowError(
      TusLibros.QUANTITY_MUST_BE_A_NATURAL
    );
  });
  test("A user cannot add to an invalid cart", () => {
    const store = newTusLibros();
    const isbn = validISBN();

    expect(() => store.addToCart(invalidCartId(), isbn, 1)).toThrowError(
      TusLibros.CART_DOES_NOT_EXIST
    );
  });
  test("A user cannot add a book to an expired cart", () => {
    const now = new Date();
    const clock = {
      now() {
        return now;
      },
    };
    const store = newTusLibros({ clock });
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);

    clock.now = () => new Date(+now + 30 * 1000 * 60 + 1);

    expect(() => store.addToCart(cartId, isbn, 1)).toThrowError(
      TusLibros.EXPIRED_CART
    );
  });
  test("A user can list his cart's content", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const aISBN = validISBN();
    const anotherISBN = anotherValidISBN();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, aISBN, 2);
    store.addToCart(cartId, anotherISBN, 1);

    const cart: Record<ISBN, number> = {};
    store.cartEntriesDo(cartId, (book, quantity) => {
      cart[book.isbn] = quantity;
    });

    expect(Object.entries(cart)).toHaveLength(2);
    expect(cart[aISBN]).toBe(2);
    expect(cart[anotherISBN]).toBe(1);
  });
  test("A user can list his empty cart's content", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const cartId = store.createCart(clientId, password);

    let numberOfItems = 0;
    store.cartEntriesDo(cartId, () => {
      numberOfItems++;
    });

    expect(numberOfItems).toBe(0);
  });
  test("A user cannot list an invalid cart", () => {
    const store = newTusLibros();

    expect(() =>
      store.cartEntriesDo(invalidCartId(), () => {
        throw new Error("This is an error!");
      })
    ).toThrowError(TusLibros.CART_DOES_NOT_EXIST);
  });
  test("A user cannot list an expired cart", () => {
    const now = new Date();
    const clock = {
      now() {
        return now;
      },
    };
    const store = newTusLibros({ clock });
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, isbn, 1);

    clock.now = () => new Date(+now + 30 * 1000 * 60 + 1);

    expect(() =>
      store.cartEntriesDo(cartId, () => {
        throw new Error("This is an error!");
      })
    ).toThrowError(TusLibros.EXPIRED_CART);
  });
  test("A user cannot checkout an empty cart", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const creditCard = unexpiredCreditCard();
    const cartId = store.createCart(clientId, password);

    expect(() => store.checkOutCart(cartId, creditCard)).toThrowError(
      TusLibros.CANNOT_CHECKOUT_EMPTY_CART
    );
  });
  test("A user cannot checkout an invalid cart", () => {
    const store = newTusLibros();
    const creditCard = unexpiredCreditCard();

    expect(() => store.checkOutCart(invalidCartId(), creditCard)).toThrowError(
      TusLibros.CART_DOES_NOT_EXIST
    );
  });
  test("A user cannot checkout with an expired credit card", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const creditCard = expiredCreditCard();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, validISBN(), 1);
    store.addToCart(cartId, anotherValidISBN(), 2);

    expect(() => store.checkOutCart(cartId, creditCard)).toThrowError(
      TusLibros.CREDIT_CARD_IS_EXPIRED
    );
  });
  test("A user can checkout his cart", () => {
    const merchantProcessor = validMerchantProcessor();
    const store = newTusLibros({ merchantProcessor });
    const clientId = validClientId();
    const password = validPassword();
    const creditCard = unexpiredCreditCard();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, validISBN(), 1);
    store.addToCart(cartId, anotherValidISBN(), 2);

    expect(store.checkOutCart(cartId, creditCard)).toBe(
      merchantProcessor.lastTransactionId
    );
  });
  test("A user cannot checkout an expired cart", () => {
    const now = new Date();
    const clock = {
      now() {
        return now;
      },
    };
    const store = newTusLibros({ clock });
    const clientId = validClientId();
    const password = validPassword();
    const isbn = validISBN();
    const cartId = store.createCart(clientId, password);
    const creditCard = unexpiredCreditCard();

    store.addToCart(cartId, isbn, 1);

    clock.now = () => new Date(+now + 30 * 1000 * 60 + 1);

    expect(() => store.checkOutCart(cartId, creditCard)).toThrowError(
      TusLibros.EXPIRED_CART
    );
  });
  test("An invalid client cannot list purchases", () => {
    const store = newTusLibros();
    expect(() =>
      store.purchasesDo(invalidClientId(), invalidPassword(), () => {
        throw new Error("this is an error!");
      })
    ).toThrowError(TusLibros.INVALID_CLIENT);
  });
  test("An client with invalid password cannot list purchases", () => {
    const store = newTusLibros();
    expect(() =>
      store.purchasesDo(validClientId(), invalidPassword(), () => {
        throw new Error("this is an error!");
      })
    ).toThrowError(TusLibros.INVALID_CLIENT);
  });
  test("A client without purchases lists no purchases", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();

    const purchases: Purchase[] = [];
    store.purchasesDo(clientId, password, (purchase) => {
      purchases.push(purchase);
    });

    expect(purchases).toHaveLength(0);
  });
  test("A client with purchases should list them", () => {
    const store = newTusLibros();
    const clientId = validClientId();
    const password = validPassword();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, validISBN(), 2);
    store.checkOutCart(cartId, unexpiredCreditCard());

    const anotherCartId = store.createCart(clientId, password);

    store.addToCart(anotherCartId, anotherValidISBN(), 1);
    store.checkOutCart(anotherCartId, unexpiredCreditCard());

    const purchases: Purchase[] = [];
    store.purchasesDo(clientId, password, (purchase) => {
      purchases.push(purchase);
    });

    expect(purchases).toHaveLength(2);
  });
  test("If a purchase fails because of the merchant processor it should be processed later", () => {
    const merchantProcessor = unavailableMerchantProcessor();
    const store = newTusLibros({ merchantProcessor });
    const clientId = validClientId();
    const password = validPassword();
    const cartId = store.createCart(clientId, password);

    store.addToCart(cartId, validISBN(), 2);

    expect(() =>
      store.checkOutCart(cartId, unexpiredCreditCard())
    ).toThrowError(TusLibros.PAYMENT_PENDING);

    const purchases: Purchase[] = [];
    store.purchasesDo(clientId, password, (purchase) => {
      purchases.push(purchase);
    });

    expect(purchases).toHaveLength(0);

    merchantProcessor.available();
    store.processPendingPayments();

    store.purchasesDo(clientId, password, (purchase) => {
      purchases.push(purchase);
    });

    expect(purchases).toHaveLength(1);

    const purchase = purchases[0];
    expect(purchase.receipt.total).toEqual(validBookPrice() * 2);
  });
});
