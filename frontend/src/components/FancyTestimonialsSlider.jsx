import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";

const FancyTestimonialsSlider = ({ testimonials }) => {
  const testimonialsRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutorotateEnabled, setIsAutorotateEnabled] = useState(true);
  const autorotateInterval = 3000; // 3 seconds

  // Handle auto-rotation of testimonials
  useEffect(() => {
    let interval;

    if (isAutorotateEnabled) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, autorotateInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutorotateEnabled, testimonials.length, activeIndex]);

  // Adjust the height of the parent container to match the current testimonial's height
  const adjustHeight = () => {
    if (testimonialsRef.current && testimonialsRef.current.parentElement) {
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
    }
  };

  // Adjust height on component mount and when the active testimonial changes
  useEffect(() => {
    adjustHeight();
  }, [activeIndex]);

  // Pause auto-rotation when the user interacts with the slider
  const handleButtonClick = (index) => {
    setActiveIndex(index);
    setIsAutorotateEnabled(false); // Disable auto-rotation on user interaction
  };

  return (
    <div className="mx-auto w-full max-w-4xl text-center">
      {/* Testimonial image */}
      <div className="relative h-48">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-blue-500/25 before:via-blue-500/10 before:via-25% before:to-blue-500/0 before:to-75%">
          <div className="h-48 [mask-image:_linear-gradient(0deg,transparent,theme(colors.white)_20%,theme(colors.white))]">
            {testimonials.map((testimonial, index) => (
              <Transition
                as="div"
                key={index}
                show={activeIndex === index}
                className="absolute inset-0 -z-10 h-full"
                enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                enterFrom="opacity-0 -rotate-[60deg]"
                enterTo="opacity-100 rotate-0"
                leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                leaveFrom="opacity-100 rotate-0"
                leaveTo="opacity-0 rotate-[60deg]"
                beforeEnter={adjustHeight}
              >
                <img
                  className="relative left-1/2 top-16 -translate-x-1/2 rounded-full"
                  src={testimonial.img}
                  width={96} // Larger image size
                  height={96} // Larger image size
                  alt={testimonial.name}
                />
              </Transition>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial text */}
      <div className="mb-12 transition-all delay-300 duration-150 ease-in-out">
        <div className="relative flex flex-col" ref={testimonialsRef}>
          {testimonials.map((testimonial, index) => (
            <Transition
              key={index}
              show={activeIndex === index}
              enter="transition ease-in-out duration-500 delay-200 order-first"
              enterFrom="opacity-0 -translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-out duration-300 delay-300 absolute"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-4"
              beforeEnter={adjustHeight}
            >
              <div className="text-3xl font-bold text-blue-900 before:content-['\201C'] after:content-['\201D']">
                {testimonial.quote}
              </div>
            </Transition>
          ))}
        </div>
      </div>

      {/* Buttons to switch testimonials */}
      <div className="-m-2 flex flex-wrap justify-center">
        {testimonials.map((testimonial, index) => (
          <button
            key={index}
            className={`m-2 inline-flex justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300 dark:focus-visible:ring-blue-600 ${
              activeIndex === index
                ? "bg-blue-500 text-white shadow-blue-950/10"
                : "bg-white text-blue-900 hover:bg-blue-100"
            }`}
            onClick={() => handleButtonClick(index)}
          >
            <span>{testimonial.name}</span>{" "}
            <span
              className={`${activeIndex === index ? "text-blue-200" : "text-blue-300"}`}
            >
              -
            </span>{" "}
            <span>{testimonial.role}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FancyTestimonialsSlider;