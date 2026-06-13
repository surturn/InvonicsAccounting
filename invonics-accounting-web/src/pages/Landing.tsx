import React from 'react';
import Hero from '../components/landing/Hero';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import WorkflowTimeline from '../components/landing/WorkflowTimeline';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-accent/30 selection:text-text-primary">
      {/* Simple navigation bar for landing */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
              I
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">Invonics</div>
          </div>
          <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md rounded-full px-8 py-3 border border-white/10 text-white/80 font-medium">
             <span className="cursor-pointer hover:text-white transition-colors">Home</span>
             <span className="cursor-pointer hover:text-white transition-colors">About Us</span>
             <span className="cursor-pointer hover:text-white transition-colors">Services</span>
             <span className="cursor-pointer hover:text-white transition-colors">Contact</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-bold text-bg-inverse bg-white hover:bg-bg-base px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-white/10">
              Get A Quote
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <FeatureShowcase />
        <WorkflowTimeline />
        
        {/* Final CTA Section */}
        <section className="py-32 bg-bg-inverse text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,89,52,0.15),_transparent_60%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to modernize<br/>your accounting?</h2>
            <p className="text-white/80 mb-12 max-w-xl mx-auto text-lg">Join us to achieve sustainable growth and reach your financial goals with the right strategies.</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-10 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-accent/20"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-bg-border bg-bg-base text-center">
        <p className="text-text-secondary text-sm font-medium">
          &copy; {new Date().getFullYear()} Invonics Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
