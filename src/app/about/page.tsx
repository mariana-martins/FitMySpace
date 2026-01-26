import { Home, Search, Sparkles, Zap, Heart, ShoppingBag } from 'lucide-react';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { PageLayout } from '@/components/templates/PageLayout';

export const metadata = {
  title: 'About FitMySpace - Our Story',
  description:
    'Learn about FitMySpace, a modern search engine for finding home organization products.',
};

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find organizers across multiple stores in one unified search experience.',
  },
  {
    icon: Home,
    title: 'Room-Based Filtering',
    description: 'Tailored results for Kitchen, Pantry, Bathroom, Closet, and more.',
  },
  {
    icon: Heart,
    title: 'Accessible by Design',
    description: 'Built with Radix UI Primitives to meet WCAG accessibility standards.',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Aesthetic',
    description: 'A clean, clutter-free UI with a modern, premium feel.',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Powered by Next.js and React Query for a seamless browsing experience.',
  },
  {
    icon: ShoppingBag,
    title: 'Multi-Store Support',
    description: 'Compare products from your favorite home organization stores.',
  },
];

const techStack = [
  { name: 'Next.js 16', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'TailwindCSS 4', category: 'Styling' },
  { name: 'Radix UI', category: 'Components' },
  { name: 'TanStack Query', category: 'Data Fetching' },
  { name: 'Jest & MSW', category: 'Testing' },
];

export default function AboutPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/', icon: Home }, { label: 'About' }];

  return (
    <PageLayout>
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} className="max-w-3xl mx-auto mb-8" />

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
            About FitMySpace
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            A modern, high-performance search engine designed to help you discover the perfect home
            organization products across multiple stores.
          </p>
        </section>

        {/* Mission Section */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We believe that an organized home leads to an organized mind. FitMySpace makes it
              effortless to find the right storage solutions, combining a minimalist design with
              powerful filtering capabilities so you can organize your home room by room with ease.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold text-slate-900 text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 text-center mb-10">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200"
              >
                <p className="font-medium text-slate-900">{tech.name}</p>
                <p className="text-sm text-slate-500">{tech.category}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
