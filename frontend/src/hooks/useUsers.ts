import { useCallback, useEffect, useState } from "react";
import type { User } from "../types/User";
import { apiRequest } from "../lib/rest";

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);

      const data = await apiRequest<User[]>("/api/users");
      setUsers(data);
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "Unknown error");
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
