'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  currentSection?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'hero',
    title: '序章',
    subtitle: 'Asphyxiation',
    href: '#hero'
  },
  {
    id: 'chapter-1',
    title: '第一章',
    subtitle: '失踪13人',
    href: '#chapter-1'
  },
  {
    id: 'chapter-2',
    title: '第二章',
    subtitle: '掩埋',
    href: '#chapter-2'
  },
  {
    id: 'chapter-3',
    title: '第三章',
    subtitle: '70条公路的死亡档案',
    href: '#chapter-3'
  }
];

export default function Navigation({ 
  items = navigationItems, 
  currentSection = 'hero' 
}: NavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(currentSection);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map(item => document.getElementById(item.id.replace('#', '')));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
        >
          <div className="backdrop-blur-custom bg-black/20 rounded-lg p-4 border border-gray-700">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`block text-left w-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-red-500 scale-125'
                        : 'bg-gray-600'
                    }`} />
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-xs opacity-70">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
