import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text as DreiText } from '@react-three/drei';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Import 3D models
const TextScanner = React.lazy(() => import('../models/TextScanner'));
const FloatingDocument = React.lazy(() => import('../models/FloatingDocument'));
const AIBrain = React.lazy(() => import('../models/AIBrain'));

// ThreeJS Loader component (replaces HTML div)
const ThreeJSLoader = () => {
  return (
    <mesh>
      <DreiText
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
        position={[0, 0, 0]}
      >
        Loading 3D Model...
      </DreiText>
    </mesh>
  );
};

const HomeContainer = styled.div`
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: auto;
    padding: 3rem 0;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    color: var(--secondary-color);
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const HeroCanvas = styled.div`
  height: 400px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: #f9f9f9;
`;

const FeaturesSectionTitle = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--secondary-color);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  transition: transform 0.3s ease;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--secondary-color);
    line-height: 1.6;
  }
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  
  &:hover {
    background-color: #0069d9;
    box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: rgba(0, 123, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: var(--primary-color);
`;

const CtaSection = styled.section`
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
`;

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const CtaButton = styled(Button)`
  background-color: white;
  color: var(--primary-color);
  border: none;
  
  &:hover {
    background-color: var(--light-color);
    color: var(--primary-color);
  }
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroText>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Extract Text from Images with AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our advanced OCR system powered by Qwen2.5-VL uses cutting-edge AI
              to accurately extract text from any image. Try it now!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button to="/upload">Get Started</Button>
            </motion.div>
          </HeroText>
          
          <HeroCanvas>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={<ThreeJSLoader />}>
                <TextScanner position={[0, 0, 0]} color="#007bff" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
              </Suspense>
            </Canvas>
          </HeroCanvas>
        </HeroContent>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesSectionTitle>
          <h2>Powerful Features</h2>
          <p>Discover what our OCR system can do for you</p>
        </FeaturesSectionTitle>
        
        <FeaturesGrid>
          <FeatureCard
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FeatureIcon>
              <i className="fas fa-bolt"></i>
            </FeatureIcon>
            <h3>Fast Processing</h3>
            <p>Extract text from images in seconds with our optimized AI algorithm.</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FeatureIcon>
              <i className="fas fa-check-circle"></i>
            </FeatureIcon>
            <h3>High Accuracy</h3>
            <p>Powered by Qwen2.5-VL, our system achieves exceptional accuracy in text recognition.</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureIcon>
              <i className="fas fa-language"></i>
            </FeatureIcon>
            <h3>Multilingual Support</h3>
            <p>Extract text in multiple languages with our advanced language processing.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <HeroCanvas style={{ height: '500px', marginBottom: '2rem' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, -10, -10]} intensity={0.5} />
          <hemisphereLight intensity={0.5} />
          <Suspense fallback={<ThreeJSLoader />}>
            <FloatingDocument position={[-2, 0, 0]} />
            <AIBrain position={[2, 0, 0]} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </HeroCanvas>
      
      <CtaSection>
        <CtaContent>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Extract Text from Your Images?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our OCR system is ready to help you extract text from any document, receipt,
            ID card, or image. Try it now and experience the power of AI!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CtaButton to="/upload">Upload an Image</CtaButton>
          </motion.div>
        </CtaContent>
      </CtaSection>
    </HomeContainer>
  );
};

export default Home; 