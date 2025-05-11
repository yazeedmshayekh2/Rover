import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--light-color);
  z-index: 9999;
`;

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoaderIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 2rem;
`;

const CircleWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Circle = styled(motion.div)<{ size: number; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const Text = styled(motion.div)`
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--dark-color);
  margin-top: 1rem;
  
  span {
    display: inline-block;
  }
`;

const ProgressBar = styled(motion.div)`
  width: 200px;
  height: 3px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 1rem;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background-color: var(--primary-color);
`;

const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, []);
  
  const circleAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity,
    }
  };
  
  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    }
  };
  
  const textAnimation = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  
  const text = "Loading...";
  
  return (
    <LoaderContainer>
      <LoaderContent>
        <LoaderIcon>
          <CircleWrapper animate={circleAnimation}>
            <Circle size={20} color="var(--primary-color)" />
          </CircleWrapper>
          <CircleWrapper animate={pulseAnimation}>
            <Circle size={50} color="rgba(0, 123, 255, 0.3)" />
          </CircleWrapper>
        </LoaderIcon>
        
        <Text>
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={textAnimation}
            >
              {char}
            </motion.span>
          ))}
        </Text>
        
        <ProgressBar>
          <Progress 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </ProgressBar>
      </LoaderContent>
    </LoaderContainer>
  );
};

export default Loader; 