import React from 'react';
import { Upload, Database, CheckCircle2 } from 'lucide-react';

export default function WorkflowTimeline() {
  const steps = [
    {
      icon: Upload,
      title: 'Import Data',
      description: 'Upload statements or add records manually.'
    },
    {
      icon: Database,
      title: 'Categorize',
      description: 'System automatically maps to standard accounting ledgers.'
    },
    {
      icon: CheckCircle2,
      title: 'Generate Reports',
      description: 'Instantly view P&L and Tax liabilities.'
    }
  ];

  return (
    <section className="py-24 bg-bg-base border-b border-bg-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">How It Works</h2>
          <p className="text-text-secondary">A streamlined workflow designed to save you hours of manual data entry.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-bg-border border-dashed border-t border-bg-border z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 w-full relative z-10 text-center flex flex-col items-center group">
              <div className="w-16 h-16 bg-bg-surface border border-bg-border flex items-center justify-center mb-6 group-hover:border-accent transition-colors duration-300">
                <step.icon className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h4>
              <p className="text-text-secondary text-sm max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
