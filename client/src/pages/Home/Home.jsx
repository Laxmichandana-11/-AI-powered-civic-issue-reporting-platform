import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Statistics from "../../components/Statistics/Statistics";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/HowItWorks/HowItWorks";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
    </>
  );
}

export default Home;