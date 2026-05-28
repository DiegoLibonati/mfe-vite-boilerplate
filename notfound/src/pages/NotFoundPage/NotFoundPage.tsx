import type { JSX } from "react";

import "@/pages/NotFoundPage/NotFoundPage.css";

const NotFoundPage = (): JSX.Element => {
  return (
    <main className="not-found-page">
      <h1 className="title">Page Not Found</h1>
      <p className="description">The page you're looking for doesn't exist or has been moved.</p>
    </main>
  );
};

export default NotFoundPage;
