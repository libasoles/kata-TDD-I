import { Book, ISBN } from "./Book";

export default class Catalog {
  public static BOOK_NOT_IN_CATALOG = "Book is not part of the catalog";

  constructor(private readonly books: Array<{ book: Book; price: number }>) {}

  includes(aBook: Book): boolean {
    return this.find(aBook) !== undefined;
  }

  priceOf(aBook: Book): number {
    this.assertBookIsIncluded(aBook);
    return this.find(aBook).price;
  }

  findByISBN(isbn: ISBN): Book {
    const catalogEntry = this.books.find(({ book }) => book.matchesISBN(isbn));
    if (catalogEntry) {
      return catalogEntry.book;
    }
    throw new Error(Catalog.BOOK_NOT_IN_CATALOG);
  }

  private assertBookIsIncluded(aBook: Book) {
    if (!this.includes(aBook)) {
      throw new Error(Catalog.BOOK_NOT_IN_CATALOG);
    }
  }

  private find(aBook: Book) {
    return this.books.find(({ book }) => book.matchesISBN(aBook.isbn));
  }
}
