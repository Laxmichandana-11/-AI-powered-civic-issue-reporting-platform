import Navbar from "../../components/Navbar/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-blue-100 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-blue-700">
          Welcome to CiviQ 🚀
        </h1>
      </main>
    </>
  );
}

export default Home;