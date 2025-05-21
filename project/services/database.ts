import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Type definitions
interface SQLiteResultSet {
  insertId?: number;
  rows: {
    _array: any[];
    length: number;
    item: (index: number) => any;
  };
  rowsAffected: number;
}

interface SQLiteTransaction {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
    errorCallback?: (transaction: SQLiteTransaction, error: Error) => boolean
  ) => void;
}

// Database connection
const DATABASE_NAME = 'stockmarket.db';
const db = (SQLite as any).openDatabase
  ? (SQLite as any).openDatabase(DATABASE_NAME)
  : (SQLite as any).openDatabaseSync(DATABASE_NAME);

// Helper to wrap db.transaction/tx.executeSql in a Promise
function execAsync(sql: string, args: any[] = []): Promise<SQLiteResultSet> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(
        sql,
        args,
        (_: SQLiteTransaction, result: SQLiteResultSet) => resolve(result),
        (_: SQLiteTransaction, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Initialize database tables
export const initDatabase = async () => {
  try {
    await execAsync(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      balance REAL DEFAULT 10000.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
    await execAsync(`CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      shares INTEGER NOT NULL,
      average_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, symbol)
    );`);
    await execAsync(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL,
      shares INTEGER NOT NULL,
      price REAL NOT NULL,
      total_amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );`);
    await execAsync(`CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, symbol)
    );`);
    return true;
  } catch (err) {
    throw err;
  }
};

// User operations
export const createUser = async (email: string, password: string, name: string) => {
  const result = await execAsync(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, password, name]
  );
  if (result.insertId) {
    return { id: result.insertId, email, name };
  } else {
    throw new Error('Failed to create user');
  }
};

export const getUserByEmail = async (email: string) => {
  const result = await execAsync(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  if (result.rows.length > 0) {
    return result.rows.item(0);
  } else {
    return null;
  }
};

// Portfolio operations
export const getPortfolio = async (userId: number) => {
  const result = await execAsync(
    'SELECT * FROM portfolio WHERE user_id = ?',
    [userId]
  );
  return result.rows._array;
};

export const updatePortfolio = async (
  userId: number,
  symbol: string,
  companyName: string,
  quantity: number,
  averagePrice: number,
  totalCost: number,
  currentPrice: number
) => {
  // Upsert logic: try update, if no rows affected, insert
  const updateResult = await execAsync(
    `UPDATE portfolio SET shares = ?, average_price = ? WHERE user_id = ? AND symbol = ?`,
    [quantity, averagePrice, userId, symbol]
  );
  if (updateResult.rowsAffected === 0) {
    await execAsync(
      `INSERT INTO portfolio (user_id, symbol, shares, average_price, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, symbol, quantity, averagePrice]
    );
  }
  return true;
};

// Transaction operations
export const addTransaction = async (
  userId: number,
  symbol: string,
  companyName: string,
  quantity: number,
  price: number,
  total: number,
  type: 'buy' | 'sell'
) => {
  return execAsync(
    `INSERT INTO transactions (user_id, symbol, type, shares, price, total_amount, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [userId, symbol, type, quantity, price, total]
  );
};

export const getTransactions = async (userId: number) => {
  const result = await execAsync(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return result.rows._array;
};

// Watchlist operations
export const getWatchlist = async (userId: number) => {
  const result = await execAsync(
    'SELECT symbol FROM watchlist WHERE user_id = ?',
    [userId]
  );
  return result.rows._array.map((item: { symbol: string }) => item.symbol);
};

export const addToWatchlist = async (userId: number, symbol: string) => {
  return execAsync(
    'INSERT OR IGNORE INTO watchlist (user_id, symbol, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [userId, symbol]
  );
};

export const removeFromWatchlist = async (userId: number, symbol: string) => {
  return execAsync(
    'DELETE FROM watchlist WHERE user_id = ? AND symbol = ?',
    [userId, symbol]
  );
};

// Balance operations
export const updateBalance = async (userId: number, newBalance: number) => {
  return execAsync(
    'UPDATE users SET balance = ? WHERE id = ?',
    [newBalance, userId]
  );
};

export const getBalance = async (userId: number) => {
  const result = await execAsync(
    'SELECT balance FROM users WHERE id = ?',
    [userId]
  );
  return result.rows._array[0]?.balance;
}; 