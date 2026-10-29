import { useCallback, useEffect, useState } from "react";
import type { User } from "../types/User";

const host = import.meta.env.VITE_API_URL || "http://localhost:3000";

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);

      const response = await fetch(`${host}/api/users`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users (${response.status})`);
      }

      const data = (await response.json()) as User[];
      setUsers(data);
    } catch (error) {
      setUsersError(
        error instanceof Error ? error.message : "Unknown error",
      );
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { users, loadingUsers, usersError, fetchAll };
}

export default useUsers;