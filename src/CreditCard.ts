export type MonthYear = { month: number, year: number };

export default class CreditCard {
  
  constructor(private readonly expiration: MonthYear) {}

  isExpiredAt(aDate: Date): boolean {
    return aDate >= new Date(this.expiration.year, this.expiration.month, 1);
  }
}