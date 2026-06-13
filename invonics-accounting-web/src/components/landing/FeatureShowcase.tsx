import React from 'react';
import { FileText, Calculator, Wallet, UploadCloud, FileSpreadsheet, Lock } from 'lucide-react';

export default function FeatureShowcase() {
  const features = [
    {
      title: 'Double-entry ledger',
      icon: FileText,
      description: 'Professional-grade accounting runs quietly in the background while you use a simple, plain-English interface. You never see debits or credits, just money in and money out.',
      highlight: 'Every single entry is completely audit-ready.',
    },
    {
      title: 'TOT Auto-Calculation',
      icon: Calculator,
      description: 'Turnover Tax is calculated automatically at 1.5% from your gross revenue so you never have to guess. Stay compliant and never miss the 20th of the month iTax deadline again.',
      highlight: 'Know exactly the KES amount you owe.',
    },
    {
      title: 'Income, Expense & Drawings',
      icon: Wallet,
      description: "Track the only three transaction types that matter for a sole proprietor's financial health. We keep your personal owner withdrawals completely separate from deductible business expenses.",
      highlight: 'Stop ruining your P&L by recording drawings as expenses.',
    },
    {
      title: 'Mobile Wallet Statement Importer',
      icon: UploadCloud,
      description: 'Upload your mobile money PDF statement and our system intelligently parses and categorizes the data. Review and import hundreds of business transactions into your ledger with a single click.',
      highlight: 'Save hours of manual data entry every month.',
    },
    {
      title: 'Accountant-Ready Exports',
      icon: FileSpreadsheet,
      description: 'Download your Profit & Loss summaries and full transaction histories as clean CSV or Excel files. The data is structured exactly how financial professionals need it at year-end.',
      highlight: 'Drastically reduce your annual iTax return prep time.',
    },
    {
      title: 'Period Locking',
      icon: Lock,
      description: 'Lock a specific month immediately after filing your TOT to prevent any accidental edits. Historical corrections can only be made via reversing entries to maintain a perfectly clean audit trail.',
      highlight: 'Absolute legal protection for your historical financial records.',
    }
  ];

  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-sm mb-4">
            Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-text-primary mb-6 tracking-tight">
            Everything you need. <br className="hidden sm:block" /> Nothing you don't.
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Every tool you need to run your finances like a tech-forward enterprise, built specifically for the Kenyan context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-bg-surface border border-bg-border rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-shadow flex flex-col group">
              <div className="w-14 h-14 rounded-2xl bg-bg-base border border-bg-border flex items-center justify-center text-text-primary mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-text-primary mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed mb-6 flex-1">
                {feature.description}
              </p>
              <div className="mt-auto pt-6 border-t border-bg-border">
                <p className="text-sm font-bold text-accent">
                  {feature.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
