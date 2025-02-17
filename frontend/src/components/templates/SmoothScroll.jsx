
import { ReactLenis } from 'lenis/react';
import { Sparkles } from '../sparkles';
export default function index() {
  return (
    <ReactLenis root>
      <main>
        <article>
          <section className="text-white  h-screen  w-full bg-slate-950  grid place-content-center sticky top-0">
            {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div> */}

            {/* <h1 className="2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]">
              I Know What Exactly you're <br /> Looking For! Scroll Please 👇
            </h1> */}
     
<main className=" absolute bottom-0 left-0 right-0 top-0  h-screen w-full overflow-hidden bg-black text-white">
<section className="container mx-auto relative h-[90vh] mt-4 border border-white/10 w-full overflow-hidden rounded-2xl">
  <img
    src="https://res.cloudinary.com/dzl9yxixg/image/upload/bg-image_inxjdx.png"
    alt="bg-image"
    className="w-full h-full absolute top-0 left-0"
  />
  <article className="grid gap-4 text-center relative z-10 pt-10">
    <span className="inline-block xl:text-base text-sm border p-1 px-3 w-fit mx-auto rounded-full border-[#3273ff] bg-[#0f1c35]">
      Early Access
    </span>
    <h1 className="2xl:text-6xl xl:text-5xl text-5xl font-semibold bg-gradient-to-b from-[#edeffd] to-[#7b9cda] bg-clip-text text-transparent leading-[100%] tracking-tighter">
      Become an Animation Expert <br /> Easily at Our Academy
    </h1>
    <span>
      Our expert-led courses are perfect for all skill levels. Gain{' '}
      <br />
      hands-on experience and create stunning animations <br />{' '}
      effortlessly. Join us today!
    </span>
    <button className="border border-blue-400 w-fit p-2 px-4 rounded-md bg-blue-900/40 hover:bg-blue-900/60 backdrop-blur-2xl mx-auto text-white">
      Take The Course
    </button>
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
          </section>

          <section className="bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <h1 className="2xl:text-7xl text-4xl px-8 font-semibold text-center tracking-tight leading-[120%]">
              If you don't like this then I'm sorry, <br /> create your own and
              make it open source 💼
            </h1>
          </section>
          <section className="text-white  h-screen  w-full bg-slate-950  grid place-content-center sticky top-0">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <h1 className="2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]">
              Thanks To Scroll.
              <br /> Now Scroll Up Again☝️🏿
            </h1>
          </section>
        </article>
      </main>
    </ReactLenis>
  );
}
