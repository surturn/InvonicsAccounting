import React from 'react';
import { ArrowRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-base border-b border-bg-border">
      {/* Neo-brutalist tech background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(0,200,150,0.05),_transparent_40%)]" />
        {/* Sharp geometric grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,50,80,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(46,50,80,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-none border border-accent/30 bg-accent/5 text-accent text-sm font-semibold tracking-wide uppercase">
            <BarChart2 className="w-4 h-4" />
            Accounting Built for Scale
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary tracking-tight mb-8 leading-tight">
            Financial clarity, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">engineered for growth.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            Invonics Accounting is the precision-built system for modern businesses. Automate P&L generation, manage cash flow, and ensure tax compliance with zero friction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-bg-base font-bold text-lg transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-white/20"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-bg-border text-text-primary hover:bg-bg-surface font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-accent/10 translate-y-4 translate-x-4 mix-blend-screen border border-accent/20" />
          <div className="relative border border-bg-border bg-bg-surface p-2 shadow-2xl">
            <img 
              src="/assets/mockups/dashboard.png" 
              alt="Invonics Accounting Dashboard" 
              className="w-full h-auto border border-bg-border"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
