import type { JSX } from "react";

import Link from "@shared/components/Link/Link";
import Action from "@shared/components/Action/Action";

import "@shared/App.css";

function App(): JSX.Element {
  return (
    <main className="dev-playground">
      <h1 className="dev-playground__title">Shared — Dev Playground</h1>

      <section>
        <h2 className="dev-playground__section-title">Link</h2>
        <Link id="link-example" ariaLabel="Example link" href="https://example.com">
          External Link
        </Link>
      </section>

      <section>
        <h2 className="dev-playground__section-title">Action</h2>
        <Action
          id="action-example"
          ariaLabel="Example action"
          onClick={() => {
            alert("Action clicked");
          }}
        >
          Click Me
        </Action>
      </section>
    </main>
  );
}

export default App;
