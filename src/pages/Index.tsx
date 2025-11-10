
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Benefits } from '@/components/landing/Benefits';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { Advantages } from '@/components/landing/Advantages';
import { BusinessTypes } from '@/components/landing/BusinessTypes';
import { DeliveryOptions } from '@/components/landing/DeliveryOptions';
import { TeamSection } from '@/components/landing/TeamSection';
import { MarketingCampaigns } from '@/components/landing/MarketingCampaigns';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Add viewport meta tag for proper mobile rendering
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
    document.head.appendChild(meta);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="relative bg-white overflow-x-hidden">
      <Header isScrolled={isScrolled} visible={true} />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <TeamSection />
        <MarketingCampaigns />
        <Testimonials />
        <DeliveryOptions />
        <BusinessTypes />
        <Advantages />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
