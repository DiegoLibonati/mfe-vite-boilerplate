import type { JSX } from "react";

import "@container/components/DefaultLoading/DefaultLoading.css";

const DefaultLoading = (): JSX.Element => {
  return (
    <div className="default-loading" aria-label="Loading remote module">
      <div className="default-loading__spinner" />
      <span className="default-loading__text">Loading...</span>
    </div>
  );
};

export default DefaultLoading;
