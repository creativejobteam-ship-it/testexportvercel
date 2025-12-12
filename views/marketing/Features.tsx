
import React from 'react';
import MarketingLayout from './MarketingLayout';

interface FeaturesProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const Features: React.FC<FeaturesProps> = ({ onStart, onNavigate, toggleTheme }) => {
  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
        <div className="section-container">
            <h1>Fonctionnalités</h1>
            <p>Page des fonctionnalités convertie (Placeholder).</p>
            
            <section className="features-detail-section">
                <div className="features-detail-container">
                    <div className="feature-detail-item">
                        <div className="feature-detail-content">
                            <span className="feature-detail-badge">Autonomie</span>
                            <h2>Pilote Automatique IA</h2>
                            <p>Laissez l'IA prendre les commandes. Notre système analyse votre marque, génère du contenu pertinent et le publie aux moments optimaux sans intervention humaine.</p>
                            <ul className="feature-detail-list">
                                <li>Génération de posts multilingues</li>
                                <li>Création d'images contextuelles avec DALL-E 3</li>
                                <li>Optimisation des horaires de publication par plateforme</li>
                            </ul>
                        </div>
                        <div className="feature-detail-visual">
                            <div className="feature-visual-placeholder">
                                [Visuel Pilote Automatique]
                            </div>
                        </div>
                    </div>

                    <div className="feature-detail-item feature-detail-reverse">
                        <div className="feature-detail-content">
                            <span className="feature-detail-badge">Engagement</span>
                            <h2>Reply-Bot Intelligent</h2>
                            <p>Ne laissez jamais un commentaire sans réponse. Notre Reply-Bot analyse le sentiment et répond de manière appropriée et humaine, augmentant ainsi l'engagement de votre communauté.</p>
                            <ul className="feature-detail-list">
                                <li>Analyse de sentiment en temps réel</li>
                                <li>Réponses personnalisées selon le ton de la marque</li>
                                <li>Escalade automatique des cas sensibles vers un humain</li>
                            </ul>
                        </div>
                        <div className="feature-detail-visual">
                            <div className="feature-visual-placeholder">
                                [Visuel Reply-Bot]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="integration-section">
                <div className="integration-container">
                    <h2>Intégrations Natives</h2>
                    <p className="integration-subtitle">Connectez vos outils préférés en quelques clics.</p>
                    <div className="integration-grid">
                        <div className="integration-card">
                            <h4>Slack</h4>
                            <p>Notifications d'équipe</p>
                        </div>
                        <div className="integration-card">
                            <h4>Discord</h4>
                            <p>Modération communautaire</p>
                        </div>
                        <div className="integration-card">
                            <h4>Zapier</h4>
                            <p>Automatisation de workflows</p>
                        </div>
                        <div className="integration-card">
                            <h4>OpenAI</h4>
                            <p>Moteur d'intelligence</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </MarketingLayout>
  );
};

export default Features;
