/**
 * A promise-based, SSR-safe singleton wrapper for the IndexedDB API.
 * This ensures the database is initialized only once and provides
 * a clean, async/await-friendly API for database operations.
 */
export class IndexDB {
  private static instance: IndexDB;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private static readonly DB_NAME = "client_db";
  private static readonly DB_VERSION = 1;

  private constructor() {
    if (typeof window === "undefined" || !window.indexedDB) {
      return;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(IndexDB.DB_NAME, IndexDB.DB_VERSION);

      request.onerror = () => {
        console.error(
          `IndexedDB error: ${request.error?.message ?? "Unknown error"}`
        );
        reject(request.error);
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onerror = (event) => {
          console.error(
            `Database error: ${(event.target as IDBRequest).error}`
          );
        };
        resolve(db);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("admins")) {
          db.createObjectStore("admins", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains("condominiums")) {
          db.createObjectStore("condominiums", { keyPath: "id" });
        }
      };
    });
  }

  public static getInstance(): IndexDB {
    if (!IndexDB.instance) {
      IndexDB.instance = new IndexDB();
    }
    return IndexDB.instance;
  }

  private perform<T>(
    storeName: string,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.dbPromise) {
      return Promise.reject(
        new Error("IndexedDB not available on the server.")
      );
    }

    return this.dbPromise.then((db) => {
      return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = action(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  }

  public get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    if (!this.dbPromise) return Promise.resolve(undefined);
    return this.perform<T>(storeName, "readonly", (store) => store.get(key));
  }

  public getAll<T>(storeName: string): Promise<T[]> {
    if (!this.dbPromise) return Promise.resolve([]);
    return this.perform<T[]>(storeName, "readonly", (store) => store.getAll());
  }

  public add<T>(storeName: string, value: T): Promise<IDBValidKey | undefined> {
    if (!this.dbPromise) return Promise.resolve(undefined);
    return this.perform<IDBValidKey>(storeName, "readwrite", (store) =>
      store.add(value)
    );
  }

  public put<T>(storeName: string, value: T): Promise<IDBValidKey | undefined> {
    if (!this.dbPromise) return Promise.resolve(undefined);
    return this.perform<IDBValidKey>(storeName, "readwrite", (store) =>
      store.put(value)
    );
  }

  public delete(storeName: string, key: IDBValidKey): Promise<void> {
    if (!this.dbPromise) return Promise.resolve();
    return this.perform<void>(storeName, "readwrite", (store) =>
      store.delete(key)
    );
  }
}
