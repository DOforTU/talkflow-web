import HeroSection from "../../components/sections/HeroSection";
import KeyFeaturesSection from "../../components/sections/KeyFeaturesSection";
import PricingTeaserSection from "../../components/sections/PricingTeaserSection";
import FinalCTASection from "../../components/sections/FinalCTASection";

export default function About() {
    return (
        <div className="min-h-screen">
            {/* Page Sections */}
            <HeroSection />
            <KeyFeaturesSection />
            <PricingTeaserSection />
            <FinalCTASection />
        </div>
    );
}
