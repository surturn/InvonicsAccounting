import React from 'react';
import { AlertTriangle, Smartphone, TrendingDown } from 'lucide-react';

export default function PainPoints() {
  const points = [
    {
      text: "Your KRA TOT filing is a monthly guessing game",
      icon: AlertTriangle
    },
    {
      text: "You use M-Pesa but have no real financial records",
      icon: Smartphone
    },
    {
      text: "You are working hard but unsure if you are profitable",
      icon: TrendingDown
    }
  ];

  return (
    <div className="bg-bg-surface border-b border-bg-border py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-bg-border">
          {points.map((point, idx) => (
            <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'md:pl-12 pt-6 md:pt-0' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-danger-subtle flex items-center justify-center shrink-0">
                <point.icon className="w-5 h-5 text-danger" />
              </div>
              <p className="text-text-primary font-medium max-w-[200px] leading-snug">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
