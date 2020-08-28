import { newCart } from "./testObjects";

class TusLibrosUseCases {
  static INVALID_CLIENT = 'Invalid client';

  createCart(clientId, password): CartId {
    if (clientId === invalidClientId() || password === invalidPassword()) {
      throw new Error(TusLibrosUseCases.INVALID_CLIENT);
    }
    return newCart();
  }

  addToCart(cartId: CartId, bookISBN, quantity);
  listCart(cartId: CartId): 
}

function invalidClientId() {
  return 'invalid client';
}

function validClientId() {
  return 'client';
}

function invalidPassword() {
  return 'invalid password';
}

describe("XXX", () => {
  test("A valid user creates an empty cart", () => {
    const clientId = validClientId();
    const password = 'password';
    const cart = XXX.createCart(clientId, password);
    
    expect(cart.isEmpty()).toBeTruthy();
  });
  test("An invalid user cannot create a cart", () => {
    const clientId = invalidClientId();
    const password = 'password';
    
    expect(() => {
      XXX.createCart(clientId, password);
    }).toThrowError(XXX.INVALID_CLIENT);
  });
  test("A user with an invalid password cannot create a cart", () => {
    const clientId = validClientId();
    const password = invalidPassword();
    
    expect(() => {
      XXX.createCart(clientId, password);
    }).toThrowError(XXX.INVALID_CLIENT);
  });
});



