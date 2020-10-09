import CreditCard from "./CreditCard";

export type TransactionId = number;

export abstract class MerchantProcessor {
  static MERCHANT_PROCESSOR_IS_NOT_AVAILABLE =
    "MERCHANT_PROCESSOR_IS_NOT_AVAILABLE";
  static CREDIT_CARD_REJECTED = "CREDIT_CARD_REJECTED";

  abstract debit(creditCard: CreditCard, total: number): TransactionId;
}
