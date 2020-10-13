import { Book, ISBN } from "./Book";
import Cart from "./Cart";
import { Cashier } from "./Cashier";
import Catalog from "./Catalog";
import { Client } from "./Client";
import { Clock } from "./Clock";
import { ContactBook } from "./ContactBook";
import CreditCard from "./CreditCard";
import { Ledger, Purchase } from "./Ledger";
import { MerchantProcessor, TransactionId } from "./MerchantProcessor";

export type CartId = string;
export type ClientId = string;
export type Password = string;

export class TusLibros {
  static INVALID_CLIENT = ContactBook.INVALID_CLIENT;
  static BOOK_NOT_IN_CATALOG = Catalog.BOOK_NOT_IN_CATALOG;
  static QUANTITY_MUST_BE_A_NATURAL = Cart.QUANTITY_MUST_BE_A_NATURAL;
  static CREDIT_CARD_IS_EXPIRED = Cashier.CREDIT_CARD_IS_EXPIRED;
  static USER_ALREADY_HAS_A_CART = "User already has a cart";
  static CART_DOES_NOT_EXIST = "Cart does not exist";
  static CANNOT_CHECKOUT_EMPTY_CART = "Cannot checkout empty cart";
  static EXPIRED_CART = "Cart expired";

  private readonly carts: Map<CartId, [Client, Cart, Date]> = new Map();

  constructor(
    private readonly catalog: Catalog,
    private readonly clock: Clock,
    private readonly merchantProcessor: MerchantProcessor,
    private readonly ledger: Ledger,
    private readonly contactBook: ContactBook
  ) {}

  createCart(clientId: ClientId, password: Password): CartId {
    this.assertClient(clientId, password);
    if (this.carts.has(clientId)) {
      throw new Error(TusLibros.USER_ALREADY_HAS_A_CART);
    }
    const client = this.contactBook.findClientWithId(clientId);
    const cartId = clientId;
    this.carts.set(cartId, [client, new Cart(this.catalog), this.clock.now()]);
    return clientId;
  }

  isCartEmpty(cartId: CartId): boolean {
    this.assertCartExists(cartId);
    return this.findCart(cartId)[1].isEmpty();
  }

  addToCart(cartId: CartId, isbn: ISBN, quantity: number): void {
    this.assertCartExists(cartId);
    const book = this.catalog.findByISBN(isbn);
    this.findCart(cartId)[1].add(book, quantity);
  }

  cartEntriesDo(
    cartId: CartId,
    action: (book: Book, quantity: number) => void
  ): void {
    this.assertCartExists(cartId);
    this.findCart(cartId)[1].entriesDo(action);
  }

  checkOutCart(cartId: CartId, creditCard: CreditCard): TransactionId {
    if (this.isCartEmpty(cartId)) {
      throw new Error(TusLibros.CANNOT_CHECKOUT_EMPTY_CART);
    }
    const [client, cart] = this.findCart(cartId);
    const cashier = new Cashier(
      cart,
      creditCard,
      this.clock.now(),
      this.merchantProcessor
    );
    const receipt = cashier.checkOut();
    this.ledger.regiterPurchase(client, cart, receipt);
    this.carts.delete(cartId);
    return receipt.transactionId;
  }

  purchasesDo(
    clientId: ClientId,
    password: Password,
    action: (purchase: Purchase) => void
  ): void {
    this.assertClient(clientId, password);
    const client = this.findClientWithId(clientId);
    this.ledger.purchasesOfClientDo(client, action);
  }

  private findClientWithId(clientId: ClientId) {
    return this.contactBook.findClientWithId(clientId);
  }

  private findCart(cartId: CartId) {
    const cart = this.carts.get(cartId);
    if (!cart) throw new Error(TusLibros.CART_DOES_NOT_EXIST);
    if (+cart[2] + 30 * 1000 * 60 < +this.clock.now())
      throw new Error(TusLibros.EXPIRED_CART);
    cart[2] = this.clock.now();
    return cart;
  }

  private assertCartExists(cartId: CartId) {
    if (!this.carts.has(cartId)) throw new Error(TusLibros.CART_DOES_NOT_EXIST);
  }

  private assertClient(clientId: ClientId, password: Password) {
    this.contactBook.verifyClientCredentials(clientId, password);
  }
}
