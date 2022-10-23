import { Header } from "./Header";
import { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <Header />
      <main>{children}</main>
    </div>
  );
};
