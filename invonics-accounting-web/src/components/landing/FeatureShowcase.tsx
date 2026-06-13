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
      title: 'M-Pesa Statement Integration',
      description: 'Upload your Safaricom M-Pesa PDF statements directly into the system. We parse, map, and reconcile transactions automatically so you never miss an entry.',
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
    <section className="py-24 bg-bg-surface border-b border-bg-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-6">
            Institutional-grade features, <br/>
            without the complexity.
          </h2>
          <p className="text-lg text-text-secondary">
            Every tool you need to run your finances like a tech-forward enterprise.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-16 ${feature.align === 'left' ? 'lg:flex-row-reverse' : ''}`}>
              
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-bg-elevated border border-bg-border flex items-center justify-center text-accent">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary">{feature.title}</h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="flex-1 w-full">
                <div className="relative">
                  <div className={`absolute inset-0 bg-accent/5 mix-blend-screen border border-accent/20 ${feature.align === 'left' ? '-translate-x-4 translate-y-4' : 'translate-x-4 translate-y-4'}`} />
                  <div className="relative border border-bg-border bg-bg-base p-2">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-auto border border-bg-border"
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
