import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background-color: var(--dark-color);
  color: white;
  padding: 2rem 0;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--light-color);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: var(--primary-color);
      border-radius: 3px;
    }
  }
  
  p {
    margin-bottom: 0.5rem;
    color: #aaa;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  a {
    color: #aaa;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  color: #888;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--light-color);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-3px);
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>OCR System</h3>
          <p>
            Powerful text extraction with advanced AI technology.
            Efficiently process any text from images with our cutting-edge OCR solution.
          </p>
          <SocialLinks>
            <SocialIcon 
              href="#" 
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-twitter"></i>
            </SocialIcon>
            <SocialIcon 
              href="#" 
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-github"></i>
            </SocialIcon>
            <SocialIcon 
              href="#" 
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-linkedin"></i>
            </SocialIcon>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Links</h3>
          <p><a href="/">Home</a></p>
          <p><a href="/upload">Upload</a></p>
          <p><a href="/about">About</a></p>
          <p><a href="#">Documentation</a></p>
        </FooterSection>
        
        <FooterSection>
          <h3>Contact</h3>
          <p>Email: info@ocrsystem.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 AI Street, Tech City</p>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>© {currentYear} OCR System. All rights reserved. Powered by Qwen2.5-VL.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 