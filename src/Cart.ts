import { Book } from "./Book";
import Catalog from "./Catalog";

export default class Cart {
    private books: Book[];

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
        if (aQuantity <= 0) {
            throw new Error('Quantity must be a positive integer');
        }
        if (!this.catalog.includes(aBook)) {
            throw new Error('Not from this editor');
        }
        for (let i = 0; i < aQuantity; i++) {
            this.books.push(aBook);
        }
    }

    quantityOf(aBook: Book): number {
        return this.books.filter(book => aBook === book).length;
    }

    total(): number {
        return this.books.reduce((total, book) => total + this.catalog.priceOf(book), 0);
    }
}

