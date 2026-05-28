import { useEffect, useState, useCallback, useMemo } from "react";

import type { JSX } from "react";
import type { User } from "@mfe/shared/types";
import type { UsersAppProps } from "@/types/props";

import RemoteMfe from "@/components/RemoteMfe/RemoteMfe";
import DefaultLoading from "@/components/DefaultLoading/DefaultLoading";

import userService from "@/services/userService";

import "@/components/UsersApp/UsersApp.css";

const UsersApp = ({ callbacks }: UsersAppProps): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const handleGetUsers = async (): Promise<void> => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadModule = useCallback(() => import("users/UsersApp"), []);

  const mountData = useMemo(() => ({ users }), [users]);

  useEffect(() => {
    void handleGetUsers();
  }, []);

  if (loading) {
    return <DefaultLoading />;
  }

  if (error) {
    return (
      <div className="users-app-error" role="alert">
        <h2 className="users-app-error__title">Error loading users</h2>
        <p className="users-app-error__message">Please try again later.</p>
      </div>
    );
  }

  return <RemoteMfe loadModule={loadModule} callbacks={callbacks} mountData={mountData} />;
};

export default UsersApp;
