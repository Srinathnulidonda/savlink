//frontend/src/public-site/layout/PublicLayout.jsx

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main className="overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}