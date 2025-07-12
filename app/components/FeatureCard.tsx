'use client';

import Link from 'next/link';
import { Users, Search, Navigation, DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  href: string;
  iconName: 'Users' | 'Search' | 'Navigation';
  tag: string;
  tagColor: 'cyan' | 'green';
}

const iconMap = {
  Users,
  Search,
  Navigation
};
export default function FeatureCard({
  title,
  description,
  features,
  buttonText,
  href,
  iconName,
  tag,
  tagColor
}: FeatureCardProps) {
  const Icon = iconMap[iconName];

  const tagStyles = {
    cyan: 'bg-[#04b7cf]/10 text-[#04b7cf] border-[#04b7cf]/20',
    green: 'bg-[#04cf84]/10 text-[#04cf84] border-[#04cf84]/20'
  };

  const buttonStyles = {
    cyan: 'bg-gradient-to-r from-[#04b7cf] to-[#04cf84] hover:from-[#0396b3] hover:to-[#04b7cf]',
    green: 'bg-gradient-to-r from-[#04cf84] to-[#04b7cf] hover:from-[#04b7cf] hover:to-[#0396b3]'
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          tagColor === 'cyan' ? 'bg-[#04b7cf]' : 'bg-[#04cf84]'
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${tagStyles[tagColor]}`}>
          {tag}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
              tagColor === 'cyan' ? 'bg-[#04b7cf]' : 'bg-[#04cf84]'
            }`} />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href={href}
        className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium text-sm transition-all duration-200 ${buttonStyles[tagColor]} shadow-sm hover:shadow-md`}
      >
        {buttonText}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}