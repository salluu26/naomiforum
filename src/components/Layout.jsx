import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black">
        {children}
      </main>
    </>
  );
}
