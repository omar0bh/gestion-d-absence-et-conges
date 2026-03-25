import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 p-6 pr-72 pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}

export default MainLayout;