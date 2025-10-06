// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gold-dark mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Shop Info */}
        <div className="text-center md:text-left">
          <h2 className="text-gold-dark font-bold text-lg">OmSai Jewellers</h2>
          <p className="text-gray-600 text-sm">📞 +91 99008 28269</p>
        </div>

        {/* Developer Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Developed by <span className="font-bold text-gold-dark">Praveen. V</span>
          </p>
          <p className="text-gray-500 text-xs">📧 praveenv4440@gmail.com</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 text-gold-dark">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/praveen-vishwakarma-599871190"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-light transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 
                2.24 5 5 5h14c2.76 0 5-2.24 
                5-5v-14c0-2.76-2.24-5-5-5zm-11 
                19h-3v-10h3v10zm-1.5-11.27c-.97 
                0-1.75-.79-1.75-1.76s.78-1.75 
                1.75-1.75 1.75.78 
                1.75 1.75-.78 1.76-1.75 
                1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 
                0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.37h.04c.4-.76 
                1.37-1.55 2.82-1.55 3.01 0 
                3.57 1.98 3.57 4.56v5.62z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919035884440"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-light transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48c-2.27-2.27-5.28-3.52-8.48-3.52-6.62 
                0-12 5.38-12 12 0 2.11.55 4.17 
                1.6 6l-1.69 6.16 6.3-1.65c1.7.93 
                3.63 1.42 5.59 1.42h.01c6.62 0 
                12-5.38 12-12 0-3.2-1.25-6.21-3.52-8.48zm-8.48 
                18.52h-.01c-1.74 0-3.44-.47-4.92-1.36l-.35-.21-3.74 
                .98 1-3.65-.23-.37c-1-1.6-1.53-3.44-1.53-5.32 
                0-5.52 4.48-10 10-10 2.67 0 5.18 
                1.04 7.07 2.93s2.93 4.4 2.93 
                7.07c0 5.52-4.48 10-10 10zm5.42-7.58c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 
                1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.05 1.03-1.05 2.5s1.08 2.89 
                1.23 3.09c.15.2 2.12 3.23 5.14 4.53.72.31 1.28.49 
                1.72.63.72.23 1.38.2 1.9.12.58-.09 
                1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
            </svg>
          </a>

        
          <a
            href="mailto:praveenv4440@gmail.com"
            className="hover:text-gold-light transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 
                1.1.9 2 2 2h16c1.1 0 2-.9 
                2-2V6c0-1.1-.9-2-2-2zm0 
                4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
