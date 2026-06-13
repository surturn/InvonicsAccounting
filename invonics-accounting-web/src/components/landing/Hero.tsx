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
            Guiding Your Financial Journey
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Where Expertise <br className="hidden lg:block" />
            Creates <span className="text-accent">Excellence</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-text-inverse/80 mb-12 max-w-xl leading-relaxed">
            Invonics Accounting is the precision-built system for modern businesses. Automate P&L generation, manage cash flow, and ensure tax compliance effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
            >
              Let's Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-bg-inverse" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-bg-inverse" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-bg-inverse" src="https://i.pravatar.cc/100?img=3" alt="User" />
              </div>
              <div className="text-text-inverse/80">
                Join our<br/>growing team
              </div>
            </div>
          </div>
        </div>

        {/* Hero Mockup (Floating) */}
        <div className="w-full lg:w-1/2 mt-20 lg:mt-0 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[600px]">
            {/* The actual mockup image will go here, currently using the standard dashboard mockup but making it heavily rounded to match the theme */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-text-inverse/10 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
              <img 
                src="/assets/mockups/dashboard.png" 
                alt="Invonics Accounting Dashboard" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center transform rotate-3">
              <span className="text-3xl font-extrabold">25+</span>
              <span className="text-sm font-medium opacity-90">Years Experience</span>
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
