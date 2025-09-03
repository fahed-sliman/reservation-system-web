// src/components/Layout/Layout.tsx
import React, { type ReactNode } from 'react';
import Header from '../components/Header/header';
import Footer from '../components/Footer/Footer';


interface Props {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?:boolean;
}

const Layout: React.FC<Props> = ({ children, hideHeader = false ,hideFooter = false}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
