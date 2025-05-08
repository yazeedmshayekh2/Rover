import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutContainer = styled.div`
  max-width: 1000px;
  margin: 3rem auto;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  text-align: center;
`;

const PageDescription = styled.p`
  text-align: center;
  margin-bottom: 3rem;
  color: var(--secondary-color);
  font-size: 1.1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled(motion.section)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #f0f0f0;
`;

const SectionContent = styled.div`
  color: var(--secondary-color);
  line-height: 1.7;
  
  p {
    margin-bottom: 1.2rem;
  }
  
  ul {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  li {
    margin-bottom: 0.8rem;
  }
  
  strong {
    color: var(--dark-color);
  }
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const TechItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TechIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.8rem;
  color: var(--primary-color);
`;

const TechName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  color: var(--dark-color);
`;

const CtaSection = styled(motion.div)`
  text-align: center;
  margin-top: 3rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  padding: 2.5rem;
  border-radius: 10px;
  color: white;
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const CtaButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: var(--primary-color);
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-color);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <PageTitle>About OCR System</PageTitle>
      <PageDescription>
        Learn about our advanced OCR system powered by cutting-edge AI technology
      </PageDescription>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle>Our Mission</SectionTitle>
        <SectionContent>
          <p>
            Our OCR (Optical Character Recognition) system is designed to make text extraction from images
            simple, accurate, and efficient. We believe that powerful AI technology should be accessible
            to everyone, which is why we've created this tool to help individuals and businesses
            quickly digitize text from various types of documents.
          </p>
          <p>
            Whether you're working with receipts, ID cards, business cards, or any other document containing text,
            our system can help you extract the information you need in seconds, saving you valuable time
            and reducing manual data entry errors.
          </p>
        </SectionContent>
      </Section>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionTitle>How It Works</SectionTitle>
        <SectionContent>
          <p>
            Our OCR system is powered by Qwen2.5-VL, a state-of-the-art vision-language model that combines
            computer vision and natural language processing to understand the content of images and extract
            text with high accuracy.
          </p>
          <p>
            The process works in three simple steps:
          </p>
          <ul>
            <li>
              <strong>Upload:</strong> Simply upload an image containing text through our user-friendly interface.
            </li>
            <li>
              <strong>Process:</strong> Our AI analyzes the image, detects text regions, and extracts the content
              using advanced neural networks specifically trained for this task.
            </li>
            <li>
              <strong>Results:</strong> The extracted text is presented in a clean, formatted manner, ready for
              copying, saving, or further processing.
            </li>
          </ul>
          <p>
            You can also customize the extraction process by providing specific prompts to guide the AI
            in understanding what type of information you're looking for.
          </p>
        </SectionContent>
      </Section>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionTitle>Technology Stack</SectionTitle>
        <SectionContent>
          <p>
            Our OCR system is built with a modern technology stack, combining powerful backend processing
            with a responsive and intuitive frontend interface:
          </p>
          
          <TechStackGrid>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fab fa-python"></i></TechIcon>
              <TechName>Python</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fab fa-react"></i></TechIcon>
              <TechName>React</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fas fa-brain"></i></TechIcon>
              <TechName>Qwen2.5-VL</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fab fa-js"></i></TechIcon>
              <TechName>TypeScript</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fas fa-flask"></i></TechIcon>
              <TechName>Flask</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fas fa-cubes"></i></TechIcon>
              <TechName>Three.js</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fas fa-paint-brush"></i></TechIcon>
              <TechName>Styled Components</TechName>
            </TechItem>
            <TechItem whileHover={{ scale: 1.05 }}>
              <TechIcon><i className="fas fa-bolt"></i></TechIcon>
              <TechName>Framer Motion</TechName>
            </TechItem>
          </TechStackGrid>
        </SectionContent>
      </Section>
      
      <CtaSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>Ready to Try It Out?</h3>
        <p>
          Experience the power of our OCR system by uploading an image and seeing how accurately
          and quickly it can extract text. Whether it's a document, receipt, or any other image with text,
          our system is ready to help.
        </p>
        <CtaButton to="/upload">Upload an Image</CtaButton>
      </CtaSection>
    </AboutContainer>
  );
};

export default About; 