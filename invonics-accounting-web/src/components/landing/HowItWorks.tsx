import React from 'react';
import { Smartphone, PieChart, FileCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Smartphone,
      number: 'Step 1',
      title: 'Log transactions instantly',
      description: 'Recording income, expenses, or drawings takes under thirty seconds on any mobile device. You do not need a background in accounting to keep your books perfectly balanced.'
    },
    {
      icon: PieChart,
      number: 'Step 2',
      title: 'See your finances in real time',
      description: 'Monitor your exact cash position across M-Pesa and bank accounts from a clean dashboard. Track your actual net profit instantly without waiting for end-of-month spreadsheet reconciliation.'
    },
    {
      icon: FileCheck,
      number: 'Step 3',
      title: 'Export and file with KRA',
      description: 'Your monthly Turnover Tax is auto-calculated at exactly 1.5% of gross sales. Generate CSV exports instantly for iTax filing or hand them directly to your accountant.'
    }
  ];

  return (
    <section className="py-24 bg-bg-surface border-y border-bg-border">
      <div className="container mx-auto px-6">
        
        {/* Workflow Section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-sm mb-4">
            How It Works
          </div>
          <h2 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">Financial clarity in three simple steps</h2>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-12 md:gap-8 relative max-w-6xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-bg-border border-dashed border-t border-bg-border z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 w-full relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-bg-border flex items-center justify-center mb-6 group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {idx + 1}
                </span>
                <step.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-accent font-bold text-sm tracking-widest uppercase mb-2">{step.number}</h3>
              <h4 className="text-xl font-bold text-text-primary mb-4">{step.title}</h4>
              <p className="text-text-secondary leading-relaxed max-w-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
