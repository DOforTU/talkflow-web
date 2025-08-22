import type { Metadata } from "next";
import HeroSection from "../../components/sections/HeroSection";
import ProblemSolutionSection from "../../components/sections/ProblemSolutionSection";
import KeyFeaturesSection from "../../components/sections/KeyFeaturesSection";
import SocialProofSection from "../../components/sections/SocialProofSection";
import PricingTeaserSection from "../../components/sections/PricingTeaserSection";
import FinalCTASection from "../../components/sections/FinalCTASection";

export default function About() {
    return (
        <div className="min-h-screen">
            {/* Page Sections */}
            <HeroSection />
            <ProblemSolutionSection />
            <KeyFeaturesSection />
            <SocialProofSection />
            <PricingTeaserSection />
            <FinalCTASection />
        </div>
    );
}
