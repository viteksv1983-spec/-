import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SEOHead from './SEOHead';

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-sans text-gray-900">
            <SEOHead />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
