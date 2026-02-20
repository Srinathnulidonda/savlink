//frontend/src/public-site/pages/Home.jsx

import PublicLayout from '../layout/PublicLayout';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home() {
    return (
        <PublicLayout>
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <CTA />
        </PublicLayout>
    );
}