import React from 'react';
import { ArrowRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-bg-inverse text-text-inverse">
      {/* Soft glowing organic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 text-left pr-0 lg:pr-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-text-inverse/20 bg-text-inverse/5 text-accent text-sm font-bold tracking-wide">
            <BarChart2 className="w-4 h-4" />
            Crafted for Kenyan freelancers & micro-businesses · KRA-compliant
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Stop stressing over tax season and finally understand your business numbers.
          </h1>
          
          <p className="text-lg lg:text-xl text-text-inverse/80 mb-12 max-w-xl leading-relaxed">
            Log income, track expenses, and auto-calculate your Turnover Tax from one simple dashboard. Built exclusively for Kenyan sole proprietors ready to ditch messy spreadsheets and WhatsApp notebooks forever.
          </p>
          
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
              >
                Start your free trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-text-inverse/30 hover:border-text-inverse text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
                See how it works
              </button>
            </div>
            <div className="text-sm font-medium text-text-inverse/70 mt-2 pl-2">
              100% free to start · No accountant required
            </div>
          </div>
        </div>

        {/* Hero Mockup (Floating) */}
        <div className="w-full lg:w-1/2 mt-20 lg:mt-0 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[600px] flex justify-center">
            {/* Using the beautiful 3D isometric mobile mockup */}
            <div className="relative w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500">
              <img 
                src="/assets/mockups/hero-mobile.png" 
                alt="Invonics Mobile App Experience" 
                className="w-full h-auto object-contain"
              />
            </div>
            

          </div>
        </div>
      </div>
      
      {/* Bottom curve transitioning to white */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 translate-y-[2px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] lg:h-[120px]">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-bg-base"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-23.6V0Z" opacity=".5" className="fill-bg-base"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-bg-base"></path>
        </svg>
      </div>
    </section>
  );
}
