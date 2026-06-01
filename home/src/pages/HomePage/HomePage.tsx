import { lazy, useState } from "react";

import type { JSX } from "react";

import SharedMfe from "@home/components/SharedMfe/SharedMfe";

import "@home/pages/HomePage/HomePage.css";

const Link = lazy(() => import("shared/sdk").then((m) => ({ default: m.Link })));
const Action = lazy(() => import("shared/sdk").then((m) => ({ default: m.Action })));

const HomePage = (): JSX.Element => {
  const [shouldThrow, setShouldThrow] = useState(false);

  const ThrowError = (): never => {
    throw new Error("Error boundary triggered manually.");
  };

  return (
    <main className="home-page">
      <h1 className="title">Home Page</h1>

      <nav aria-label="Page navigation">
        <ul className="links">
          <li>
            <SharedMfe
              component={Link}
              componentProps={{
                id: "link-about",
                ariaLabel: "Go to About Page",
                href: "/about",
                target: "_self",
                children: "Go to About Page",
              }}
            />
          </li>
          <li>
            <SharedMfe
              component={Link}
              componentProps={{
                id: "link-about-new-window",
                ariaLabel: "Go to About Page in a new window",
                href: "/about",
                children: "Go to About Page in Another Window",
              }}
            />
          </li>
          <li>
            <SharedMfe
              component={Link}
              componentProps={{
                id: "link-users",
                ariaLabel: "Go to Users Page",
                href: "/users",
                target: "_self",
                children: "Go to Users Page",
              }}
            />
          </li>
        </ul>
      </nav>

      <section className="home-page__demo" aria-label="Error boundary demo">
        <SharedMfe
          component={Action}
          componentProps={{
            id: "action-trigger-error",
            ariaLabel: "Trigger error boundary",
            className: "home-page__demo-action",
            onClick: () => {
              setShouldThrow(true);
            },
            children: "Trigger Error Boundary",
          }}
        />

        {shouldThrow ? <ThrowError /> : null}
      </section>
    </main>
  );
};

export default HomePage;
