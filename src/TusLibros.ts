import { invalidClientId, invalidPassword } from "../tests/testObjects";
import { Book, ISBN } from "./Book";
import Cart from "./Cart";
import { Cashier } from "./Cashier";
import Catalog from "./Catalog";
import { Clock } from "./Clock";
import CreditCard from "./CreditCard";
import { MerchantProcessor, TransactionId } from "./MerchantProcessor";

export type CartId = string;

export class TusLibros {
  static INVALID_CLIENT = "Invalid client";
  static USER_ALREADY_HAS_A_CART = "User already has a cart";
  static CART_DOES_NOT_EXIST = "Cart does not exist";
  static CANNOT_CHECKOUT_EMPTY_CART = "Cannot checkout empty cart";

  private readonly carts: Map<CartId, Cart> = new Map();

  constructor(
    private readonly catalog: Catalog,
    private readonly clock: Clock,
    private readonly merchantProcessor: MerchantProcessor
  ) {}

  createCart(clientId: string, password: string): CartId {
    if (clientId === invalidClientId() || password === invalidPassword()) {
      throw new Error(TusLibros.INVALID_CLIENT);
    }
    if (this.carts.has(clientId)) {
      throw new Error(TusLibros.USER_ALREADY_HAS_A_CART);
    }
    this.carts.set(clientId, new Cart(this.catalog));
    return clientId;
  }

  isCartEmpty(cartId: CartId): boolean {
    this.assertCartExists(cartId);
    return this.findCart(cartId).isEmpty();
  }

  addToCart(cartId: CartId, isbn: ISBN, quantity: number): void {
    this.assertCartExists(cartId);
    const book = this.catalog.findByISBN(isbn);
    this.findCart(cartId).add(book, quantity);
  }

  cartEntriesDo(
    cartId: CartId,
    action: (book: Book, quantity: number) => void
  ): void {
    this.assertCartExists(cartId);
    this.findCart(cartId).entriesDo(action);
  }

  checkOutCart(cartId: CartId, creditCard: CreditCard): TransactionId {
    if (this.isCartEmpty(cartId)) {
      throw new Error(TusLibros.CANNOT_CHECKOUT_EMPTY_CART);
    }
    const cashier = new Cashier(
      this.findCart(cartId),
      creditCard,
      this.clock.now(),
      this.merchantProcessor
    );
    return cashier.checkOut().transactionId;
  }

  private findCart(cartId: CartId) {
    return this.carts.get(cartId);
  }

  private assertCartExists(cartId: CartId) {
    if (!this.carts.has(cartId)) throw new Error(TusLibros.CART_DOES_NOT_EXIST);
  }
}
