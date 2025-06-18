import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Operations Manager",
    company: "TechFlow Solutions",
    content: "This platform has transformed how we handle our daily operations. The automated workflows have saved us countless hours, and the pattern detection feature helps us continuously improve our processes.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Digital Transformation",
    company: "InnovateNow",
    content: "The ROI we've seen since implementing this solution has been remarkable. Our team is more productive, and we've eliminated many repetitive tasks through intelligent automation.",
    rating: 5
  },
  {
    name: "Emily Thompson",
    role: "Project Lead",
    company: "Agile Dynamics",
    content: "What impressed me most was how quickly we could set up complex workflows. The intuitive interface and powerful integration capabilities make it a standout solution in the market.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how organizations are transforming their operations with our automation platform
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 transform transition-all hover:scale-105"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="border-t pt-4">
                <p className="font-medium text-gray-900">{testimonial.name}</p>
                <p className="text-gray-600">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}