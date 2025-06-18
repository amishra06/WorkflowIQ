import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="bg-primary-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to transform your workflow?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            Start automating your tasks today and see the difference.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-900 bg-white hover:bg-primary-50 transition-colors duration-150"
            >
              Get Started
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}