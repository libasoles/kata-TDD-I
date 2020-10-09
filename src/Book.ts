export type ISBN = string;

export class Book {
  constructor(readonly isbn: ISBN) {}

  matchesISBN(isbn: ISBN): boolean {
    return this.isbn === isbn;
  }
}
