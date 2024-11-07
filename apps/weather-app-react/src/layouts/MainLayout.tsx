import NavBar from "../components/NavBar";
import MobileNavBar from "../components/MobileNavBar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-row bg-base-300 h-screen">
      <NavBar className="hidden md:flex" />
      <MobileNavBar />
      <div className="flex-1 p-4 overflow-auto mx-2 xl:mx-12 2xl:mx-48 mt-4">{children}</div>
    </div>
  );
};

export default MainLayout;
