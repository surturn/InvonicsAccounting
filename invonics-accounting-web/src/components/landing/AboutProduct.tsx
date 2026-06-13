import React from 'react';
import { ArrowRight, User, Briefcase, Paintbrush, XCircle, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutProduct() {
  const personas = [
    {
      title: 'The freelance professional',
      icon: User,
      description: 'Perfect for developers, designers, and consultants billing clients directly. Track your varied project income and deduct your specific operating expenses accurately.'
    },
    {
      title: 'The micro-business owner',
      icon: Briefcase,
      description: 'Ideal for small retail shops, food businesses, and local service providers. Manage daily cash flow effortlessly without hiring a full-time bookkeeper.'
    },
    {
      title: 'The creative agency owner',
      icon: Paintbrush,
      description: 'Built for creatives running a small team and mixing project milestones with retainer income. Keep your agency profitable while staying fully tax compliant.'
    }
  ];

  const notFor = [
    'Not designed for VAT-registered businesses (yet)',
    'Not a replacement for a CPA on complex tax matters',
    'Not a multi-company or enterprise platform'
  ];

  return (
    <section className="py-24 bg-bg-surface border-y border-bg-border relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* 3A. EYEBROW + H2 */}
        <div className="max-w-4xl mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-sm mb-4">
            About Invonics Accounting
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.1]">
            Bridging the gap in affordable, KRA-aware financial tools for Kenyan micro-businesses.
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* 3B. PRODUCT STORY */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed">
              Most Kenyan sole proprietors run their business finances on Excel spreadsheets at best, and WhatsApp voice notes at worst. When tax season arrives, they either overpay their Turnover Tax because their records are inaccurate, or they pay an expensive accountant to reconstruct months of transactions from faded receipts in a plastic bag. This costs significant time and money that small businesses simply cannot afford to lose.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Invonics Accounting was built from first principles around how Kenyan sole proprietors actually operate—using M-Pesa as primary cash, a personal PIN for KRA filing, and Turnover Tax as the relevant obligation. It is not a bloated foreign accounting tool with Kenya bolted on as an afterthought. Every Chart of Accounts entry, export format, and tax calculation was meticulously designed for this exact context.
            </p>

            {/* 3E. BUILT BY CALLOUT */}
            <div className="mt-12 p-8 bg-bg-base border border-bg-border rounded-[2rem] flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-text-inverse flex items-center justify-center shrink-0">
                <Code className="w-8 h-8 text-bg-base" />
              </div>
              <div>
                <p className="text-text-primary font-medium leading-relaxed mb-4">
                  Built by Invonics Technologies, a Nairobi-based software development team. We are the same engineers behind the RSVP platform and custom automation tools for growing Kenyan businesses.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent-hover transition-colors">
                  Learn about Invonics Technologies <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-12">
            {/* 3C. WHO IT IS FOR */}
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-8">Who it is for</h3>
              <div className="space-y-6">
                {personas.map((persona, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                      <persona.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-text-primary mb-2">{persona.title}</h4>
                      <p className="text-text-secondary leading-relaxed">{persona.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D. WHAT IT IS NOT */}
            <div className="p-8 bg-danger-subtle/50 border border-danger/10 rounded-[2rem]">
              <h3 className="text-xl font-bold text-text-primary mb-6">What it is not</h3>
              <ul className="space-y-4">
                {notFor.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                    <span className="text-text-primary font-medium">{item}</span>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
