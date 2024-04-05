import "@styles/globals.css";
import React from "react";
type layoutProps = { children: React.ReactNode };

const layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">{children}</main>
      </body>
    </html>
  );
};
export default layout;
