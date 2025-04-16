import Navbar from "../../components/Navbar";
import Footer from "./_components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-[#0F172A]">
      <Navbar />
      <main className="pt-14 pb-20 bg-[#0F172A]">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
