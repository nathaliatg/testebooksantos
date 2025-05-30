import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Obtém o ano atual dinamicamente

  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>&copy; {currentYear} Desenvolvido por Nathalia em Curitiba, PR.</p>
      </div>
    </footer>
  );
};

export default Footer;