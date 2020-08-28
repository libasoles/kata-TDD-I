import Cart from "./Cart";
import CreditCard from "./CreditCard";

export default class Cashier {
  public static CART_MUST_NOT_BE_EMPTY = 'Cart must not be empty';
  public static CERDIT_CARD_IS_EXPIRED = 'Credit card is expired';

  constructor(private readonly cart: Cart, private readonly creditCard: CreditCard) {
    if (cart.isEmpty()) {
      throw new Error(Cashier.CART_MUST_NOT_BE_EMPTY)
    }
    if (creditCard.isExpiredAt(...)) {
      throw new Error(Cashier.CERDIT_CARD_IS_EXPIRED);
    }
  }

  checkOut() {
    return this.cart.total();
  }
}