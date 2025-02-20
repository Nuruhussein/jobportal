import about from "../assets/About.png";


const JobPortalAbout = () => {
  // Data for the features
  const features = [
    {
      icon: about, // Replace with actual image path
      title: "About KIOT Job Portal",
      description:
        "Explore a wide range of job opportunities tailored for students and alumni. Welcome to KIOT Job Portal, your trusted partner in connecting talent with opportunity...",
      linkText: "Explore Jobs",
      link: "#",
    },
    {
      icon: about, // Replace with actual image path
      title: "Who We Are",
      description:
        "KIOT Job Portal is a cutting-edge online platform designed to empower job seekers and employers alike...",
      linkText: "Learn More",
      link: "#",
    },
    {
      icon: about, // Replace with actual image path
      title: "What We Offer",
      description:
        "Access to thousands of job listings across various industries and experience levels...",
      linkText: "Get Started",
      link: "#",
    },
  ];

  return (
    <section id="about" className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        {/* Image Section */}
        <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg  overflow-hidden">
          <img
            alt="Job Portal"
            className="object-cover object-center h-full w-full"
            src="https://www.tilahunabebegc.com/wp-content/uploads/2022/10/photo_2022-09-14_19-16-01-2.jpg" // Replace with your image URL
          />
        </div>

        {/* Text Content Section */}
        <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <img src={feature.icon} alt={feature.title} className="w-12 rounded-full h-12" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  {feature.title}
                </h2>
                <p className="leading-relaxed text-base">{feature.description}</p>
                <a href={feature.link} className="mt-3 text-indigo-500 inline-flex items-center">
                  {feature.linkText}
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobPortalAbout;
