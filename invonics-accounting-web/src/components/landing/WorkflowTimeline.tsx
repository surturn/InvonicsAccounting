import React from 'react';
import { Upload, Database, CheckCircle2 } from 'lucide-react';

export default function WorkflowTimeline() {
  const steps = [
    {
      icon: Upload,
      title: 'Import Data',
      description: 'Upload statements or add records manually with precision.'
    },
    {
      icon: Database,
      title: 'Categorize',
      description: 'System automatically maps to standard accounting ledgers.'
    },
    {
      icon: CheckCircle2,
      title: 'Generate Reports',
      description: 'Instantly view your Profit & Loss and Tax liabilities.'
    }
  ];

  const stats = [
    { value: '25+', label: 'A legacy of expertise spanning 24+ years.' },
    { value: '150K+', label: 'Where ideas flourish and projects thrive.' },
    { value: '98%', label: 'Striving for customer satisfaction is top priority.' },
    { value: '$40M+', label: 'This is our pure benefit to our clients.' }
  ];

  return (
    <section className="py-24 bg-bg-surface border-y border-bg-border">
      <div className="container mx-auto px-6">
        
        {/* Stats Section (Based on Screenshot 1) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-b border-bg-border pb-24">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-left">
              <div className="text-4xl lg:text-5xl font-extrabold text-bg-inverse tracking-tight mb-4 flex items-center">
                {stat.value}
                <span className="text-accent ml-1">+</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed max-w-[200px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-sm mb-4">
            Our Services
          </div>
          <h2 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">Financial Services To Grow And Secure Your Wealth</h2>
          <p className="text-text-secondary">A streamlined workflow designed to save you hours of manual data entry.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-bg-border border-dashed border-t border-bg-border z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 w-full relative z-10 text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-bg-border flex items-center justify-center mb-6 group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
                <step.icon className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold text-text-primary mb-3">{step.title}</h4>
              <p className="text-text-secondary text-sm max-w-[250px] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
