import { motion, useInView } from 'framer-motion';
export const TimelineContent = ({ children, animationNum, timelineRef }) => {
  const sequenceVariants = {
    visible: (i) => ({
      filter: 'blur(0px)',
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: 'blur(20px)',
      y: 0,
      opacity: 0,
    },
  };
  const isInView = useInView(timelineRef, {
    once: false,
  });
  return (
    <>
      <>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={animationNum}
          variants={sequenceVariants}
        >
          {children}
        </motion.div>
      </>
    </>
  );
};
