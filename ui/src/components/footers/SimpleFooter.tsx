import Image from "next/image";
import { useLanguage } from "@/context/Language";
import { simpleFooterTexts } from "@/text/SimpleFooter";
import "./SimpleFooter.css";

export default function SimpleFooter() {
    const { currentLanguage } = useLanguage();
    const texts = simpleFooterTexts[currentLanguage];
    return (
        <footer className="simple-footer">
            <div className="simple-footer-container">
                <div className="simple-footer-content">
                    {/* Brand */}
                    <div className="simple-footer-brand">
                        <Image
                            width={90}
                            height={30}
                            src="/web_logo.png"
                            alt="SayPlan Logo"
                            className="simple-footer-logo"
                        />
                    </div>

                    {/* Links */}
                    <div className="simple-footer-links">
                        <a href="/about" className="simple-footer-link">
                            {texts.about}
                        </a>
                        <a href="/privacy" className="simple-footer-link">
                            {texts.privacy}
                        </a>
                        <a href="/terms" className="simple-footer-link">
                            {texts.terms}
                        </a>
                        <a href="/contact" className="simple-footer-link">
                            {texts.contact}
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="simple-footer-bottom">
                    <p className="simple-footer-copyright">&copy; {texts.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
