import React from 'react';
import { FileText, Smartphone, TrendingUp } from 'lucide-react';

export default function FeatureShowcase() {
  const features = [
    {
      title: 'Automated P&L Generation',
      description: 'Stop wrestling with spreadsheets. Our system maps your income and expenses into compliant Profit & Loss statements instantly, giving you real-time visibility into your margins.',
      icon: TrendingUp,
      image: '/assets/mockups/reports.png',
      align: 'right'
    },
    {
      title: 'Mobile Wallet Integration',
      description: 'Upload your mobile money PDF statements directly into the system. We parse, map, and reconcile transactions automatically so you never miss an entry.',
      icon: Smartphone,
      image: '/assets/mockups/dashboard.png', // Using dashboard as a placeholder for the flow
      align: 'left'
    },
    {
      title: 'Built-in Tax Compliance',
      description: 'Kenya Revenue Authority TOT (Turnover Tax) is calculated automatically at 1.5%. Always know exactly what you owe and file on time with our dedicated reporting views.',
      icon: FileText,
      image: '/assets/mockups/reports.png',
      align: 'right'
    }
  ];

  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-sm mb-4">
            About Us
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-text-primary mb-6 tracking-tight">
            The Best Finance <br className="hidden sm:block" /> Consultant In Town
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Every tool you need to run your finances like a tech-forward enterprise, seamlessly blending tradition with innovation.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-16 ${feature.align === 'left' ? 'lg:flex-row-reverse' : ''}`}>
              
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-text-primary tracking-tight">{feature.title}</h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
                <button className="px-6 py-3 rounded-full bg-bg-inverse text-white font-bold hover:bg-bg-inverse/90 transition-colors flex items-center gap-2 mt-4">
                  Learn More <span className="text-accent">→</span>
                </button>
              </div>

              <div className="flex-1 w-full">
                <div className="relative p-4">
                  {/* Soft background shape */}
                  <div className={`absolute inset-0 bg-accent/5 rounded-[3rem] ${feature.align === 'left' ? '-translate-x-8 translate-y-8' : 'translate-x-8 translate-y-8'}`} />
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-bg-border bg-white">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
