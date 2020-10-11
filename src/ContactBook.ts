import { Client } from "./Client";
import { ClientId, Password } from "./TusLibros";

export class ContactBook {
  static CLIENT_ALREADY_EXISTS = "Client already exists";
  static INVALID_CLIENT = "Invalid client";

  private readonly clients: Map<[ClientId, Password], Client> = new Map();

  addClient(client: Client, password: Password): ClientId {
    this.assertClient(client);
    const clientId = this.newId();
    this.clients.set([clientId, password], client);
    return clientId;
  }

  findClientWithId(clientId: ClientId): Client {
    for (const key of this.clients.keys()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (key[0] === clientId) return this.clients.get(key)!;
    }
    throw new Error(ContactBook.INVALID_CLIENT);
  }

  verifyClientCredentials(clientId: string, password: string): void {
    for (const key of this.clients.keys()) {
      if (key[0] === clientId && key[1] === password) return;
    }
    throw new Error(ContactBook.INVALID_CLIENT);
  }

  private newId() {
    return `${this.clients.size + 1}`;
  }

  private assertClient(client: Client) {
    for (const existingClient of this.clients.values()) {
      if (existingClient === client)
        throw new Error(ContactBook.CLIENT_ALREADY_EXISTS);
    }
  }
}
