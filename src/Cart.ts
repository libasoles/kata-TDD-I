import { Book } from "./Book";
import Catalog from "./Catalog";

export default class Cart {
    private books: Book[];

    static QUANITY_MUST_BE_A_NATURAL = 'Quantity must be a positive integer';
    static BOOK_MUST_BE_IN_CATALOG = 'Not from this editor';

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

    private assertBookIsInTheCatalog(aBook: string) {
        if (!this.catalog.includes(aBook)) {
            throw new Error(Cart.BOOK_MUST_BE_IN_CATALOG);
        }
    }

    private assertQuantityIsANatural(aQuantity: number) {
        if (aQuantity <= 0) {
            throw new Error(Cart.QUANITY_MUST_BE_A_NATURAL);
        }
    }

    quantityOf(aBook: Book): number {
        return this.books.filter(book => aBook === book).length;
    }

    total(): number {
        return this.books.reduce((total, book) => total + this.catalog.priceOf(book), 0);
    }
}

