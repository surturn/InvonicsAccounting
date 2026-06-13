import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import PainPoints from '../components/landing/PainPoints';
import HowItWorks from '../components/landing/HowItWorks';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import AboutProduct from '../components/landing/AboutProduct';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-accent/30 selection:text-text-primary">
      {/* Navigation Bar (1A) */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-accent">Invonics</span>
              <span className="text-white/80 font-medium ml-1.5">Accounting</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md rounded-full px-8 py-3 border border-white/10 text-white/80 font-medium">
             <span className="cursor-pointer hover:text-white transition-colors">Home</span>
             <span className="cursor-pointer hover:text-white transition-colors">Features</span>
             <span className="cursor-pointer hover:text-white transition-colors">About</span>
             <span className="cursor-pointer hover:text-white transition-colors">Contact</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-white/90 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/signup" className="text-sm font-bold text-bg-inverse bg-accent hover:bg-accent-hover px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-accent/20">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <PainPoints />
        <HowItWorks />
        <FeatureShowcase />
        <AboutProduct />
        
        {/* 4A. CLOSING CTA SECTION */}
        <section className="pt-32 pb-16 bg-bg-inverse text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,89,52,0.15),_transparent_60%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight max-w-3xl mx-auto">
              Stop dreading tax season and take control today.
            </h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              Gain immediate access to a pre-seeded Chart of Accounts and start logging transactions without needing an accountant.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-10 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-accent/20"
              >
                Start tracking now
              </Link>
              <p className="text-sm text-white/60 font-medium">
                No credit card required · Free to start
              </p>
            </div>
          </div>
        </section>

        {/* 4B. CONTACT SECTION */}
        <section className="py-20 bg-bg-base border-t border-bg-border">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl font-bold text-text-primary mb-4 tracking-tight">Questions about your specific business?</h3>
              <p className="text-text-secondary leading-relaxed">
                Reach out to our local team for feature inquiries, KRA compliance questions, or custom software requirements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 bg-bg-surface rounded-2xl border border-bg-border">
                <p className="font-bold text-text-primary mb-2">Email</p>
                <a href="mailto:accounting@invonicstechnologies.com" className="text-accent hover:underline text-sm font-medium">accounting@invonicstechnologies.com</a>
              </div>
              <div className="p-6 bg-bg-surface rounded-2xl border border-bg-border">
                <p className="font-bold text-text-primary mb-2">WhatsApp</p>
                <p className="text-text-secondary text-sm font-medium">Fastest response channel for Kenyan users</p>
              </div>
              <div className="p-6 bg-bg-surface rounded-2xl border border-bg-border">
                <p className="font-bold text-text-primary mb-2">Built by</p>
                <a href="https://invonicstechnologies.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm font-medium">Invonics Technologies, Nairobi Kenya</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4C. FOOTER */}
      <footer className="py-16 border-t border-bg-border bg-bg-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
            
            {/* Left */}
            <div className="max-w-xs">
              <div className="text-xl font-extrabold tracking-tight mb-4">
                <span className="text-accent">Invonics</span>
                <span className="text-text-primary font-medium ml-1.5">Accounting</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-medium">
                Financial clarity for the modern Kenyan sole proprietor.
              </p>
            </div>

            {/* Center */}
            <div className="flex gap-16 lg:gap-24">
              <div className="flex flex-col gap-4">
                <a href="#" className="text-text-secondary hover:text-accent font-medium transition-colors">Home</a>
                <a href="#" className="text-text-secondary hover:text-accent font-medium transition-colors">Features</a>
                <a href="#" className="text-text-secondary hover:text-accent font-medium transition-colors">About</a>
                <a href="#" className="text-text-secondary hover:text-accent font-medium transition-colors">Contact</a>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-text-secondary hover:text-accent font-medium transition-colors">Privacy Policy</a>
                <a href="#" className="text-text-secondary hover:text-accent font-medium transition-colors">Terms of Use</a>
                <a href="https://invonicstechnologies.com" target="_blank" rel="noopener noreferrer" className="text-accent font-bold flex items-center gap-1 hover:text-accent-hover transition-colors">
                  Invonics Technologies <span className="text-lg leading-none">↗</span>
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="max-w-xs">
              <p className="text-sm text-text-secondary leading-relaxed bg-bg-base p-4 rounded-xl border border-bg-border">
                Designed exclusively for KRA Turnover Tax compliance by sole proprietors, and does not substitute professional tax advice.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-bg-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-text-muted">
            <p>&copy; 2026 Invonics Technologies. All rights reserved.</p>
            <p className="flex items-center gap-2">Built in Nairobi, Kenya <span className="text-accent">🇰🇪</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
