import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-6">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;