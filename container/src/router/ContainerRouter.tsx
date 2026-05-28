import { useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import type { JSX } from "react";

import RemoteMfe from "@/components/RemoteMfe/RemoteMfe";
import UsersApp from "@/components/UsersApp/UsersApp";
import ProductApp from "@/components/ProductApp/ProductApp";
import ContextApp from "@/components/ContextApp/ContextApp";

import { PublicRoute } from "@/router/PublicRoute";

import { useMfeCallbacks } from "@/hooks/useMfeCallbacks";

import envs from "@/constants/envs";

export const ContainerRouter = (): JSX.Element => {
  const callbacks = useMfeCallbacks();

  const loadHomeModule = useCallback(() => import("home/HomeApp"), []);
  const loadAboutModule = useCallback(() => import("about/AboutApp"), []);
  const loadNotFoundModule = useCallback(() => import("notfound/NotFoundApp"), []);

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<RemoteMfe loadModule={loadHomeModule} callbacks={callbacks} />} />
        <Route
          path="/about"
          element={<RemoteMfe loadModule={loadAboutModule} callbacks={callbacks} />}
        />
        <Route path="/users" element={<UsersApp callbacks={callbacks} />} />
        <Route path="/context" element={<ContextApp callbacks={callbacks} />} />
        <Route path="/products/:productId" element={<ProductApp callbacks={callbacks} />} />
        <Route
          path="/not-found"
          element={<RemoteMfe loadModule={loadNotFoundModule} callbacks={callbacks} />}
        />
      </Route>

      <Route
        path="/*"
        element={<Navigate to={envs.redirectIfRouteNotExists ? "/" : "/not-found"}></Navigate>}
      ></Route>
    </Routes>
  );
};
