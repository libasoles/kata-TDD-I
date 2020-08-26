import Book from "./Book";

export default class Cart {

    private books: Book[];

    constructor() {
        this.books = [];
    }

    isEmpty() {
        return this.books.length === 0;
    }

    contains(book: Book) {
        return this.books.indexOf(book) > -1;
    }

    addBook(book: Book) {
        this.books.push(book);
    }
}

