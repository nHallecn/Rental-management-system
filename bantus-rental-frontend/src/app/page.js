//src/app/page.js

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { featureItems } from '@/lib/features'; 
import { CheckCircle, Home, Users, Zap, Shield, BarChart, FileText } from 'lucide-react';
import Link from 'next/link';

// --- Sub-components for the main page ---

const Hero = () => (
  <section className="bg-[#FBF5EE] py-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Rental Property Management, <span className="text-orange-500">Simplified for you.</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Bantus Rental Manager gives you everything you need to run your rental properties with ease. From tracking rooms and tenants, collecting rent, managing bills, and keeping digital contracts—all your work is done in one simple platform.
        </p>
        <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
          <Link href="/register" className="rounded-md bg-orange-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-orange-600">
            Start Managing Now
          </Link>
          <Link href="#" className="rounded-md border border-gray-400 px-5 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100">
            Tenant Portal
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <img src="/bantus-logo-art.svg" alt="Bantus Rental Art" className="w-[20rem] lg:w-[24rem]" />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, slug }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
    <Icon className="h-10 w-10 mx-auto text-orange-500" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    {/* --- THIS LINK MUST BE CORRECT --- */}
    <Link href={`/features/${slug}`} className="mt-2 text-sm font-semibold text-orange-500 hover:text-orange-600">
      Learn more
    </Link>
  </div>
);

const Features = () => (
  <section id="features" 
    className="py-24"
    style={{ backgroundImage: "url('/background-pattern.png')" }}
  >
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything You Need to Manage Properties</h2>
        <p className="mt-4 text-lg leading-8 text-gray-300">
          A complete solution designed specifically for Cameroonian landlords.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
        {/* Ensure the 'slug' prop is being passed correctly here */}
        {featureItems.map(feature => (
          <FeatureCard key={feature.slug} icon={feature.icon} title={feature.title} slug={feature.slug} />
        ))}
      </div>
    </div>
  </section>
);



const WhyChooseUs = () => (
  <section id="about" className="bg-[#FBF5EE] py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
        <div className="lg:pr-8 lg:pt-4">
          <div className="lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-orange-600 sm:text-4xl">Why choose Bantus Rental</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Join hundreds of landlords who have transformed their property management experience</p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
              {[
                { title: "Reduce billing disputes by 80%", description: "Transparent and accurate billing eliminates confusion." },
                { title: "Real-time occupancy tracking", description: "Always know which units are occupied and available." },
                { title: "Automated utility calculations", description: "Save hours of manual calculations every month." },
                { title: "Digital contract storage", description: "Access all tenant documents anytime, anywhere." },
                { title: "Mobile-friendly on-the-go access", description: "Manage properties from any device, anywhere." },
              ].map(item => (
                <div key={item.title} className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900"><CheckCircle className="absolute left-1 top-1 h-5 w-5 text-orange-500" />{item.title}</dt>
                  <dd className="block">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <img src="/bantus-logo-art.svg" alt="Decorative art" className="w-[24rem] max-w-none sm:w-[32rem] md:-ml-4 lg:-ml-0 mx-auto" />
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="py-24" style={{ backgroundImage: "url('/background-pattern.png')" }}>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">We're trusted by rental owners Across Cameroon</h2>
        <p className="mt-4 text-lg leading-8 text-gray-300">
          Bantus Rental Manager is the platform landlords and tenants rely on every day.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
        <div>
          <div className="text-5xl font-bold text-white">2M+ XAF</div>
          <div className="text-base text-gray-300 mt-2">Rent Collected</div>
        </div>
        <div>
          <div className="text-5xl font-bold text-white">25,000+</div>
          <div className="text-base text-gray-300 mt-2">Properties</div>
        </div>
        <div>
          <div className="text-5xl font-bold text-white">98%</div>
          <div className="text-base text-gray-300 mt-2">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
    <div className="bg-[#FBF5EE] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Others Say About Us</h2>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {[
                    { quote: "Bantus Rental has completely changed how I manage my houses. Rent tracking, tenant records, and utility bills are all in one system.", author: "Joshua W.", location: "Yaoundé, Cameroon" },
                    { quote: "The platform is very easy to use and saves me so much time. I can now monitor all my properties without stress.", author: "Darrell P.", location: "Douala, Cameroon" },
                    { quote: "Bantus helps me stay organized and avoid tenant disputes. It's one of the best tools I've used for property management.", author: "Orlow N.", location: "Bamenda, Cameroon" },
                ].map(testimonial => (
                    <div key={testimonial.author} className="flex flex-col rounded-lg bg-white p-8 shadow-lg">
                        <div className="flex-1">
                            <p className="text-gray-600">"{testimonial.quote}"</p>
                        </div>
                        <div className="mt-6">
                            <div className="font-semibold text-gray-900">{testimonial.author}</div>
                            <div className="text-gray-600">{testimonial.location}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- The Main Exported Page ---

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <WhyChooseUs />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
