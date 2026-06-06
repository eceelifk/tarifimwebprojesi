import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icerik">
        <div className="footer-logo">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <ChefHat size={22} style={{ color: 'var(--renk-birincil)' }} />
            tarifim<span>.</span>
          </span>
        </div>
        <p>© {new Date().getFullYear()} tarifim. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
