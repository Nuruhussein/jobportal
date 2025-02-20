import { Sparkles } from "../sparkles";

function SparkleDemo() {
    return (
      <>
<main className="h-screen pt-36 w-full overflow-hidden bg-black text-white">
  <section className="container mx-auto relative h-[90vh] mt-4 border border-white/10 w-full overflow-hidden rounded-2xl">
    <img
      src="https://wu.edu.et/icbsem2023/img/logo.png"
      alt="Wollo University Logo"
      className="w-40 h-40 mx-auto mt-4"
    />
    <article className="grid gap-4 text-center relative z-10 pt-10">
      <h1 className="2xl:text-6xl xl:text-5xl text-5xl font-semibold bg-gradient-to-b from-[#edeffd] to-[#7b9cda] bg-clip-text text-transparent leading-[100%] tracking-tighter">
        Find Your Dream Job <br /> with Wollo University Job Portal
      </h1>
      <span>
        Explore exclusive job opportunities tailored for students and graduates.<br />
        Connect with top employers and kickstart your career today!
      </span>
      <a  href='/jobs'> <button className="border border-blue-400 w-fit p-2 px-4 rounded-md bg-blue-900/40 hover:bg-blue-900/60 backdrop-blur-2xl mx-auto text-white">
        Explore Jobs
      </button></a>
     
    </article>

    <div className="absolute bottom-0 z-[2] h-[400px] w-screen overflow-hidden [mask-image:radial-gradient(100%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] before:opacity-40 after:absolute">
      <Sparkles
        density={1800}
        speed={1.2}
        color="#48b6ff"
        direction="top"
        className="absolute inset-x-0 bottom-0 h-full w-full"
      />
    </div>
  </section>
</main>
</>
  );
}
export default SparkleDemo;
