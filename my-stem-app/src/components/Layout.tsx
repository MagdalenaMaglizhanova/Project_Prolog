import { type ReactNode, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children?: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = "IDEAS | STEM Education with Prolog",
  description = "Platform for schools to develop AI-powered STEM projects using logical programming"
}: LayoutProps) {

  useEffect(() => {
    document.title = title;
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content-with-header">
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  );
}