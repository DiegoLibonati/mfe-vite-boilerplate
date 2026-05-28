import { LinkModule, ActionModule } from "@mfe/shared";

import type { JSX } from "react";

import SharedMfe from "@/components/SharedMfe/SharedMfe";

import { useCounterContext } from "@/hooks/useCounterContext";

import "@/pages/ContextPage/ContextPage.css";

const ContextPage = (): JSX.Element => {
  const { counterState, addCounter, subtractCounter } = useCounterContext();

  return (
    <main className="context-page">
      <h1 className="title">Context Page</h1>

      <section className="counter" aria-label="Counter">
        <SharedMfe
          module={ActionModule}
          componentProps={{
            id: "counter-subtract",
            ariaLabel: "Subtract 1 from counter",
            className: "counter__subtract",
            onClick: () => {
              subtractCounter(1);
            },
            children: "-",
          }}
        />

        <output
          className="counter__number"
          aria-live="polite"
          aria-label={`Counter value: ${counterState.counter}`}
          htmlFor="counter-subtract counter-plus"
        >
          {counterState.counter}
        </output>

        <SharedMfe
          module={ActionModule}
          componentProps={{
            id: "counter-plus",
            ariaLabel: "Add 1 to counter",
            className: "counter__plus",
            onClick: () => {
              addCounter(1);
            },
            children: "+",
          }}
        />
      </section>

      <nav aria-label="Page navigation">
        <ul className="links">
          <li>
            <SharedMfe
              module={LinkModule}
              componentProps={{
                id: "link-not-exists",
                ariaLabel: "Go to unknown page",
                href: "/pasdasdasdasd",
                target: "_self",
                children: "Go to Not Exists Page",
              }}
            />
          </li>
        </ul>
      </nav>
    </main>
  );
};

export default ContextPage;
