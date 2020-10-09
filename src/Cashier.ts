import Cart from "./Cart";
import CreditCard from "./CreditCard";
import { MerchantProcessor, TransactionId } from "./MerchantProcessor";

export interface Receipt {
  transactionId: TransactionId;
  total: number;
}

export class Cashier {
  public static CART_MUST_NOT_BE_EMPTY = "Cart must not be empty";
  public static CREDIT_CARD_IS_EXPIRED = "Credit card is expired";

  constructor(
    private readonly cart: Cart,
    private readonly creditCard: CreditCard,
    private readonly today: Date,
    private readonly merchantProcessor: MerchantProcessor
  ) {
    this.assertCartIsNotEmpty();
    this.assertCreditCardIsValid();
  }

  private assertCreditCardIsValid() {
    if (this.creditCard.isExpiredAt(this.today)) {
      throw new Error(Cashier.CREDIT_CARD_IS_EXPIRED);
    }
  }

  private assertCartIsNotEmpty() {
    if (this.cart.isEmpty()) {
      throw new Error(Cashier.CART_MUST_NOT_BE_EMPTY);
    }
  }

  checkOut(): Receipt {
    const total = this.cart.total();
    const transactionId = this.merchantProcessor.debit(this.creditCard, total);
    return { transactionId, total };
  }
}
