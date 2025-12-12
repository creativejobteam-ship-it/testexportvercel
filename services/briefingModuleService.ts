
import { BriefingModule, QuestionDefinition, Platform, ProjectContextType, CompositeBriefingSchema } from '../types';
import { getDomains, GLOBAL_QUESTIONS } from './strategyService';

// --- BUILDER FUNCTION ---

export const generateCompositeBriefingSchema = (
    domainName: string,
    targetNetworks: Platform[],
    projectContext: ProjectContextType
): CompositeBriefingSchema => {
    
    const schema: CompositeBriefingSchema = {
        sections: []
    };

    // 1. ADD GLOBAL MODULE (STATIC)
    // This strictly enforces the "Global + Specific" polymorphism.
    // Every brief starts with these standard fields.
    schema.sections.push({
        title: 'Global Strategic Essentials',
        description: 'Standard requirements for all agency projects.',
        moduleType: 'DOMAIN', // Using DOMAIN type for base structure
        questions: GLOBAL_QUESTIONS
    });

    // 2. ADD SECTOR SPECIFIC MODULE (DYNAMIC)
    // Retrieve live domains from strategy service
    const allDomains = getDomains();
    
    // Case-insensitive match for robustness
    const domain = allDomains.find(d => 
        d.name.toLowerCase() === domainName.toLowerCase() || 
        d.slug.toLowerCase() === domainName.toLowerCase()
    );
    
    if (domain) {
        schema.sections.push({
            title: `Sector Specifics: ${domain.name}`,
            description: domain.description || `Specialized questions for the ${domain.name} industry.`,
            moduleType: 'DOMAIN',
            questions: domain.domainTemplate
        });
    } else {
        // Fallback if no specific domain found (should rarely happen if data is consistent)
        schema.sections.push({
            title: 'General Business Context',
            description: 'Additional context for your specific business case.',
            moduleType: 'DOMAIN',
            questions: [
                { id: 'business_desc_fallback', label: 'Describe your business model', type: 'textarea', required: true, order: 1, section: 'General' },
                { id: 'usp_fallback', label: 'Unique Selling Proposition', type: 'text', required: true, order: 2, section: 'General' }
            ]
        });
    }

    // NOTE: Context and Platform modules have been removed to ensure the brief
    // matches the Template definition exactly.

    return schema;
};
