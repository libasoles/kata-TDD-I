import { Book } from "./Book";

export default class Catalog {
  public static BOOK_NOT_IN_CATALOG = 'Book is not part of the catalog';

  constructor(private readonly books: Array<{ book: Book, price: number }>) {}

  includes(aBook: Book) {
    return this.find(aBook) !== undefined;
  }

  priceOf(aBook: Book): number {
    if (!this.includes(aBook)) {
      throw new Error(Catalog.BOOK_NOT_IN_CATALOG)
    }
    return this.find(aBook).price;
  }

  private find(aBook: Book) {
    return this.books.find(({book}) => book === aBook);
  }
}