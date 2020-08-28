import Cart from "./Cart";
import CreditCard from "./CreditCard";

export default class Cashier {
  public static CART_MUST_NOT_BE_EMPTY = 'Cart must not be empty';
  public static CERDIT_CARD_IS_EXPIRED = 'Credit card is expired';

  constructor(
    private readonly cart: Cart, 
    private readonly creditCard: CreditCard,
    private readonly today: Date
  ) {
    this.assertCartIsNotEmpty();
    this.assertCreditCardIsValid();
  }

  private assertCreditCardIsValid() {
    if (this.creditCard.isExpiredAt(this.today)) {
      throw new Error(Cashier.CERDIT_CARD_IS_EXPIRED);
    }
  }

  private assertCartIsNotEmpty() {
    if (this.cart.isEmpty()) {
      throw new Error(Cashier.CART_MUST_NOT_BE_EMPTY);
    }
  }

  checkOut(): number {
    return this.cart.total();
  }
}