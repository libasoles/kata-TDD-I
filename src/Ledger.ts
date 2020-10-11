import Cart from "./Cart";
import { Receipt } from "./Cashier";
import { Client } from "./Client";

export class Purchase {
  constructor(
    readonly client: Client,
    readonly cart: Cart,
    readonly receipt: Receipt
  ) {}

  belongsTo(client: Client): boolean {
    return client === client;
  }
}

export class Ledger {
  static CART_ALREADY_PURCHASED = "Cart already purchased";
  static RECEIPT_ALREADY_REGISTERED = "Receipt already registered";

  private purchases: Set<Purchase> = new Set();

  regiterPurchase(client: Client, cart: Cart, receipt: Receipt): Purchase {
    this.assertNoDuplication(cart, receipt);
    const purchase = new Purchase(client, cart, receipt);
    this.purchases.add(purchase);
    return purchase;
  }

  purchasesOfClientDo(
    client: Client,
    action: (purchase: Purchase) => void
  ): void {
    for (const purchase of this.purchases) {
      if (purchase.belongsTo(client)) {
        action(purchase);
      }
    }
  }

  private assertNoDuplication(cart: Cart, receipt: Receipt) {
    for (const purchase of this.purchases) {
      if (purchase.cart === cart)
        throw new Error(Ledger.CART_ALREADY_PURCHASED);
      if (purchase.receipt === receipt)
        throw new Error(Ledger.RECEIPT_ALREADY_REGISTERED);
    }
  }
}
