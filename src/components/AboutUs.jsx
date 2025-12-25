import React, { useState } from 'react';
import { Lock, Shield, Brain, MessageSquare } from 'lucide-react';
import './components.css';

const AboutUs = () => {
    const [activeCard, setActiveCard] = useState(0);

    const features = [
        {
            id: 0,
            icon: Lock,
            title: "Privacy First",
            tagline: "Zero Storage Policy",
            description: "We don't store your passwords and we won't track them. They are deleted right after you refresh the page.",
            color: "primary"
        },
        {
            id: 1,
            icon: Shield,
            title: "Entropy-Based Security",
            tagline: "Crack-Time Calculator",
            description: "We use entropy to calculate how much time it takes for someone to decode or expose your password, so you can be safe from almost all data breaches.",
            color: "secondary"
        },
        {
            id: 2,
            icon: Brain,
            title: "Memorable & Secure",
            tagline: "Smart Wordlists",
            description: "• Wordlists are random, not themed\n• Separators increase entropy\n• Memorability ≠ predictability",
            color: "accent"
        },
        {
            id: 3,
            icon: MessageSquare,
            title: "Our Promise",
            tagline: "By Design",
            description: "We don't want your data. We designed the system so we can't have it.",
            color: "pink"
        }
    ];

    return (
        <section className="why-us-section">
            <div className="why-us-header">
                <div className="header-badge">WHY US?</div>
                <h2 className="why-us-title">Security & Privacy Built In</h2>
            </div>

            <div className="features-grid">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.id}
                            className={`feature-card ${activeCard === index ? 'active' : ''}`}
                            onMouseEnter={() => setActiveCard(index)}
                            onClick={() => setActiveCard(index)}
                        >
                            <div className={`feature-icon-wrapper color-${feature.color}`}>
                                <Icon className="feature-icon" size={40} strokeWidth={2.5} />
                            </div>
                            <div className="feature-content">
                                <span className="feature-tagline">{feature.tagline}</span>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                            <div className="feature-number">0{index + 1}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default AboutUs;
