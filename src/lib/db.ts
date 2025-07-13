import { openDB, IDBPDatabase } from 'idb';
import type { Flight } from '@/types/database';

interface DBSchema {
  'search-results': {
    key: string;
    value: Flight[];
  };
}

let dbPromise: Promise<IDBPDatabase<DBSchema>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<DBSchema>('flight-search-db', 1, {
      upgrade(db) {
        db.createObjectStore('search-results');
      },
    });
  }
  return dbPromise;
}

export async function cacheSearch(key: string, flights: Flight[]): Promise<void> {
  const db = await getDb();
  await db.put('search-results', flights, key);
}

export async function getCachedSearch(key: string): Promise<Flight[] | undefined> {
  const db = await getDb();
  return db.get('search-results', key);
}
