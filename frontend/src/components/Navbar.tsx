import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NavContainer = styled.nav`
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  
  span {
    color: var(--dark-color);
    font-weight: 300;
    margin-left: 0.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  position: relative;
  font-weight: 500;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--dark-color)'};
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const NavIndicator = styled(motion.div)`
  position: absolute;
  bottom: -6px;
  height: 3px;
  width: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--dark-color);

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <NavContainer style={{ 
      background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
      boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
    }}>
      <NavContent>
        <Logo to="/">
          OCR<span>System</span>
        </Logo>
        
        <NavLinks>
          <NavLink to="/" active={isActive('/')}>
            Home
            {isActive('/') && <NavIndicator layoutId="navIndicator" />}
          </NavLink>
          <NavLink to="/upload" active={isActive('/upload')}>
            Upload
            {isActive('/upload') && <NavIndicator layoutId="navIndicator" />}
          </NavLink>
          <NavLink to="/about" active={isActive('/about')}>
            About
            {isActive('/about') && <NavIndicator layoutId="navIndicator" />}
          </NavLink>
        </NavLinks>
        
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </NavContent>
      
      {mobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <MobileNavLinks>
            <NavLink to="/" active={isActive('/')} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/upload" active={isActive('/upload')} onClick={() => setMobileMenuOpen(false)}>
              Upload
            </NavLink>
            <NavLink to="/about" active={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>
              About
            </NavLink>
          </MobileNavLinks>
        </MobileMenu>
      )}
    </NavContainer>
  );
};

export default Navbar; 