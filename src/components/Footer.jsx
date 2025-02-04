import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto py-8">
      <div className="container mx-auto flex flex-col items-center md:flex-row md:justify-between px-6">
        <div className="flex items-center gap-4">
          <img
            className="w-20 h-20 rounded-lg shadow-lg"
            src="Listopia_Icon_v2_big.png"
            alt="Listopia Logo"
          />
          <p className="max-w-md text-sm leading-relaxed font-mono">
            Listopia is a social platform for gamers to share lists of their favorite games.
          </p>
        </div>

        <p className="mt-6 md:mt-0 text-xs text-center md:text-right font-mono border-t md:border-t-0 border-gray-700 pt-4 md:pt-0">
          Copyright &copy; {new Date().getFullYear()}. All rights reserved. Made By ListopiaTeam and RAWG API.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
