import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <main style={{ padding: '20px' }}>{children}</main>
            <Footer />
        </div>
    );
}
