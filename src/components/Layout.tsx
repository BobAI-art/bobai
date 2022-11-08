import SiteHeader from "./SiteHeader";
import { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
};
