import { SQLiteProvider } from 'expo-sqlite';
import { migrateDatabase } from './migrations';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SQLiteProvider
      databaseName="vitolyx.db"
      onInit={migrateDatabase}
      useSuspense
    >
      {children}
    </SQLiteProvider>
  );
}
