
import { useRef } from 'react';
import { Github } from 'lucide-react';
import { TimelineContent } from '../framer-timeline';
function Timeline() {
  const aboutRef = useRef(null);
  const heroRef = useRef(null);
  return (
    <>
      <section
        className="sm:grid grid-cols-2 gap-10 h-[650px] pt-10 px-4"
        ref={heroRef}>
        <TimelineContent animationNum={0} timelineRef={heroRef}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJUHNPvOFk1kVuhvUWZYKD0TEGXuJJMOnuoA&s"
            className="w-full h-96  object-cover rounded-md "
            alt=""
          />
        </TimelineContent>
        <div className="space-y-2">
          {' '}
          <TimelineContent animationNum={1} timelineRef={heroRef}>
            <h1 className="text-5xl leading-[110%]">
              Why you need to start it?
            </h1>
          </TimelineContent>
          <TimelineContent animationNum={2} timelineRef={heroRef}>
            <p className="text-xl leading-[110%]">
              There is no valid reason, u just need more to see on this website just apply
            </p>
          </TimelineContent>
          <TimelineContent animationNum={3} timelineRef={heroRef}>
            <a
              className="flex gap-2 w-fit bg-gray-800 rounded-md p-2"
              href="https://github.com/naymurdev"
              target="_blank">
              <Github />
              
              Start it Now
            </a>
          </TimelineContent>
        </div>
        
      </section>
      <section ref={aboutRef} className="sm:grid grid-cols-2 gap-10 pb-10 px-4">
    
        <div className="space-y-2">
          {' '}
          <TimelineContent animationNum={1} timelineRef={aboutRef}>
            <h1 className="text-5xl leading-[110%]">Follow me on X/Twitter?</h1>
          </TimelineContent>
          <TimelineContent animationNum={2} timelineRef={aboutRef}>
            <p className="text-xl leading-[110%]">
              There is no valid reason, I just need more follower, please do it
              guys😍
            </p>
          </TimelineContent>
          <TimelineContent animationNum={3} timelineRef={aboutRef}>
            <a
              className="flex gap-2 items-center w-fit bg-gray-800 rounded-md p-2"
              href="https://wu.edu.et/"
              target="_blank">
              <svg
  width="120"
  height="109"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="fill-primary w-6 h-5"
>
  <path
    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c2.21 0 4.2.9 5.66 2.34L4.34 17.66A7.93 7.93 0 0 1 4 12c0-4.42 3.58-8 8-8zm0 16c-2.21 0-4.2-.9-5.66-2.34L19.66 6.34A7.93 7.93 0 0 1 20 12c0 4.42-3.58 8-8 8z"
    fill="currentColor"
  />
</svg>

      visit
            </a>
          </TimelineContent>
        </div>
        <TimelineContent animationNum={0} timelineRef={aboutRef}>
          <img
            src="https://i.ytimg.com/vi/BIMkekEyChg/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDK4ZNutHpsz9YckyJHVg635uWhcQ"
            className="w-full h-96  object-cover rounded-md "
            alt=""
          />
        </TimelineContent>
      </section>
    </>
  );
}
export default Timeline;
