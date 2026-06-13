import React from 'react';
import Hero from '../components/landing/Hero';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import WorkflowTimeline from '../components/landing/WorkflowTimeline';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-accent/30 selection:text-text-primary">
      {/* Simple navigation bar for landing */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-base/90 backdrop-blur-sm border-b border-bg-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-accent">Invonics</div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/dashboard" className="text-sm font-bold text-bg-base bg-text-primary hover:bg-white px-4 py-2 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <FeatureShowcase />
        <WorkflowTimeline />
        
        {/* Final CTA Section */}
        <section className="py-32 bg-bg-surface text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-8">Ready to modernize your accounting?</h2>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-bg-base font-bold text-lg transition-colors border border-transparent"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-bg-border bg-bg-base text-center">
        <p className="text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} Invonics Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
