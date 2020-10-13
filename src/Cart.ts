import { Book, ISBN } from "./Book";
import Catalog from "./Catalog";

export default class Cart {
  private books: Book[];

  static QUANTITY_MUST_BE_A_NATURAL = "Quantity must be a positive integer";
  static BOOK_MUST_BE_IN_CATALOG = "Not from this editor";

  constructor(private readonly catalog: Catalog) {
    this.books = [];
  }

  isEmpty(): boolean {
    return this.books.length === 0;
  }

  contains(aBook: Book): boolean {
    return this.books.indexOf(aBook) > -1;
  }

  add(aBook: Book, aQuantity = 1): void {
    this.assertQuantityIsANatural(aQuantity);
    this.assertBookIsInTheCatalog(aBook);
    for (let i = 0; i < aQuantity; i++) {
      this.books.push(aBook);
    }
  }

  private assertBookIsInTheCatalog(aBook: Book) {
    if (!this.catalog.includes(aBook)) {
      throw new Error(Cart.BOOK_MUST_BE_IN_CATALOG);
    }
  }

  private assertQuantityIsANatural(aQuantity: number) {
    if (Number.isInteger(aQuantity) && aQuantity > 0) return;
    throw new Error(Cart.QUANTITY_MUST_BE_A_NATURAL);
  }

  quantityOf(aBook: Book): number {
    return this.books.filter((book) => aBook === book).length;
  }

  total(): number {
    return this.books.reduce(
      (total, book) => total + this.catalog.priceOf(book),
      0
    );
  }

  entriesDo(action: (book: Book, quantity: number) => void): void {
    const summary: Record<ISBN, [Book, number]> = this.books.reduce(
      (summary, book) => ({
        ...summary,
        [book.isbn]: summary[book.isbn]
          ? [book, summary[book.isbn][1] + 1]
          : [book, 1],
      }),
      {} as Record<ISBN, [Book, number]>
    );
    Object.entries(summary).forEach(([, entry]) => action(...entry));
  }
}
