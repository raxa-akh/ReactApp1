import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import cls from "@/styles/Layout.module.css"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={cls.container}>
            <div className={cls.inner}>
                <Header />
                <main style={{ padding: '20px' }}>{children}</main>
                <Footer />
            </div>
        </div>
    );
}
