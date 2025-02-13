import Navbar from "../../components/Navbar";
import Footer from "./_components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-slate-100 dark:bg-background">
      <Navbar />
      <main className="pt-14 pb-20 bg-slate-100 dark:bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
