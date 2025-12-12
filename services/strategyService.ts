

import { ActivityDomain, QuestionDefinition, Strategy, BriefResponse, Client, Project, WorkflowStage, ProjectType, Message, Community, CalendarPost, ModerationItem } from '../types';
import { DEMO_DATA } from './demoData';

// --- DATA STORE ---
// Mutable in-memory store initialized from DEMO_DATA
let clients: Client[] = [...DEMO_DATA.clients];
let projects: Project[] = [...DEMO_DATA.projects];
let strategies: Strategy[] = [...DEMO_DATA.strategies];
let briefResponses: BriefResponse[] = [...DEMO_DATA.briefs];
let messages: Message[] = [...DEMO_DATA.inbox];
let communities: Community[] = [...DEMO_DATA.communities];
let calendarPosts: CalendarPost[] = [...DEMO_DATA.calendar];
let recentPublisherPosts: any[] = [];

// --- EVENT SYSTEM ---
const triggerUpdate = () => {
    window.dispatchEvent(new Event('strategy-data-change'));
};

// --- DOMAINS & TYPES (Static-ish) ---
// (Keeping existing definitions for Domains/Templates/ProjectTypes...)
// [Note: Re-declaring these for completeness of the file, assuming they are static or managed similarly]

export const GLOBAL_QUESTIONS: QuestionDefinition[] = [
  // Step 1: Identity
  { id: 'business_name', label: 'Company / Brand Name', type: 'text', required: true, order: 0, section: 'Global Identity', placeholder: 'e.g., Prestige Realty Group' },
  { id: 'website', label: 'Website URL', type: 'url', required: false, order: 1, section: 'Global Identity', placeholder: 'https://...' },
  { id: 'contact_email', label: 'Contact Email', type: 'text', required: true, order: 2, section: 'Global Identity', placeholder: 'contact@company.com' },
  { id: 'location', label: 'Headquarters / Location', type: 'text', required: false, order: 3, section: 'Global Identity', placeholder: 'e.g. Paris, France' },

  // Step 2: Visuals
  { id: 'brand_logo', label: 'Brand Logo', type: 'file', required: true, order: 4, section: 'Brand Assets', helperText: 'Upload your official logo (PNG, SVG, JPG). Used for auto-generating visuals.' },
  { id: 'brand_colors', label: 'Brand Color Palette (Primary, Secondary, Accent)', type: 'color_palette', required: true, order: 5, section: 'Brand Assets', helperText: 'Select your main brand colors.' },
  { id: 'brand_guidelines', label: 'Brand Guidelines / Charter', type: 'file', required: false, order: 6, section: 'Brand Assets', helperText: 'Upload PDF or Doc describing fonts, tone, and usage rules.' },
  
  // Step 3: Voice & Tone Cloning Section
  { id: 'training_content', label: 'YOUR BEST CONTENT EXAMPLES', type: 'multi-file', required: false, order: 7, section: 'Voice & Tone Cloning', helperText: 'Upload 3-5 of your best performing posts. The AI will analyze them to copy your writing style.' },
  { id: 'training_url', label: 'WEBSITE / BLOG URL', type: 'url', required: false, order: 8, section: 'Voice & Tone Cloning', helperText: 'We will scrape your blog to learn your vocabulary.' },
  { id: 'voice_tone', label: 'DESIRED TONE', type: 'radio', options: ['Expert', 'Friendly', 'Bold'], required: true, order: 9, section: 'Voice & Tone Cloning' },
  { id: 'emoji_usage', label: 'EMOJI USAGE', type: 'segmented', options: ['No Emojis', 'Minimal', 'Heavy'], required: true, order: 10, section: 'Voice & Tone Cloning' },

  // Step 4: Strategy (Mixed with Dynamic)
  { id: 'main_goal', label: 'Primary Strategic Objective', type: 'select', options: ['Brand Awareness & Reach', 'Lead Generation (MQL/SQL)', 'Customer Retention & LTV', 'Talent Acquisition (Employer Brand)', 'Crisis Management & Reputation'], required: true, order: 11, section: 'Global Strategy' },
  { id: 'target_audience_macro', label: 'Macro Target Audience', type: 'textarea', required: true, order: 12, section: 'Global Strategy', placeholder: 'Broad definition of your ideal customer profile (ICP).' },
  { id: 'unique_selling_prop', label: 'Unique Selling Proposition (USP)', type: 'textarea', required: true, order: 14, section: 'Global Strategy', placeholder: 'What makes you different from competitors?' }
];

let domains: ActivityDomain[] = [
    { id: 'dom_real_estate', name: 'Real Estate', slug: 'real-estate', description: 'Comprehensive template for Agencies, Developers, and Property Managers.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_restaurant', name: 'Restoration / Food', slug: 'restaurant', description: 'Template for Restaurants, Cafes, and Food Concepts.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_fashion', name: 'Fashion / Retail', slug: 'fashion-retail', description: 'Template for Clothing Brands, Accessories, and Retailers.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_tech', name: 'Tech / SaaS', slug: 'tech-saas', description: 'Template for Software, Startups, and Technology Platforms.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_travel', name: 'Travel / Tourism', slug: 'travel-tourism', description: 'Template for Hotels, Agencies, and Tourism Boards.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_health', name: 'Health & Wellness', slug: 'health-wellness', description: 'Template for Medical Practices, Clinics, and Wellness Centers.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_legal', name: 'Legal / Finance', slug: 'legal-finance', description: 'Template for Law Firms, Accountants, and Financial Advisors.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_education', name: 'Education / Coaching', slug: 'education-coaching', description: 'Template for Schools, Universities, and Online Course Creators.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'dom_nonprofit', name: 'Non-Profit & NGO', slug: 'nonprofit-ngo', description: 'For Charities, Foundations, and Social Causes.', domainTemplate: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let projectTypes: ProjectType[] = [
    { id: 'pt_company', name: 'Entreprise / Société', description: 'General corporate entity' },
    { id: 'pt_brand', name: 'Marque', description: 'Specific commercial brand' },
    { id: 'pt_ecommerce', name: 'Site E-commerce', description: 'Online store' },
    { id: 'pt_app', name: 'Application Mobile', description: 'iOS/Android App' },
    { id: 'pt_event', name: 'Événement', description: 'Festival, Conference, Launch' },
    { id: 'pt_ngo', name: 'Association / ONG', description: 'Non-profit organization' },
    { id: 'pt_place', name: 'Lieu Physique', description: 'Store, Restaurant, Venue' }
];

// --- EXPORTS & METHODS ---

// Domains
export const getDomains = (): ActivityDomain[] => domains;
export const getDomainById = (id: string): ActivityDomain | undefined => domains.find(d => d.id === id);
export const saveDomain = (domain: ActivityDomain): void => {
    const idx = domains.findIndex(d => d.id === domain.id);
    if (idx >= 0) domains[idx] = domain;
    else domains.push(domain);
    triggerUpdate();
};
export const deleteDomain = (id: string): void => {
    domains = domains.filter(d => d.id !== id);
    triggerUpdate();
};

// Project Types
export const getProjectTypes = (): ProjectType[] => projectTypes;
export const saveProjectType = (type: ProjectType): void => {
    const idx = projectTypes.findIndex(t => t.id === type.id);
    if (idx >= 0) projectTypes[idx] = type;
    else projectTypes.push(type);
    triggerUpdate();
};
export const deleteProjectType = (id: string): void => {
    projectTypes = projectTypes.filter(t => t.id !== id);
    triggerUpdate();
};

// Clients
export const getClients = (): Client[] => clients;
export const getClientById = (id: string): Client | undefined => clients.find(c => c.id === id);
export const saveClient = (client: Client): void => {
    const idx = clients.findIndex(c => c.id === client.id);
    if (idx >= 0) clients[idx] = client;
    else clients.push(client);
    triggerUpdate();
};
export const deleteClient = (id: string): void => {
    clients = clients.filter(c => c.id !== id);
    projects = projects.filter(p => p.clientId !== id);
    strategies = strategies.filter(s => s.clientId !== id);
    briefResponses = briefResponses.filter(b => b.clientId !== id);
    triggerUpdate();
};

// Projects
export const getAllProjects = (): Project[] => projects;
export const getProjectById = (id: string): Project | undefined => projects.find(p => p.id === id);
export const saveProject = (project: Project): void => {
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) projects[idx] = project;
    else projects.push(project);
    triggerUpdate();
};
export const deleteProject = (id: string): void => {
    projects = projects.filter(p => p.id !== id);
    briefResponses = briefResponses.filter(b => b.projectId !== id);
    triggerUpdate();
};
export const updateProjectStatus = (projectId: string, updates: Partial<Project>): void => {
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx >= 0) {
        projects[idx] = { ...projects[idx], ...updates };
        triggerUpdate();
    }
}
// Generic update for projects (Local Store)
export const updateProject = (projectId: string, updates: Partial<Project>): void => {
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx >= 0) {
        projects[idx] = { ...projects[idx], ...updates };
        triggerUpdate();
    }
}

// Strategies
export const getStrategies = (): Strategy[] => strategies;
export const addNewStrategy = (strategy: Strategy): void => {
    strategies.push(strategy);
    triggerUpdate();
};
export const deleteStrategy = (id: string): void => {
    strategies = strategies.filter(s => s.id !== id);
    triggerUpdate();
};
export const updateStrategy = (id: string, updates: Partial<Strategy>): void => {
    const idx = strategies.findIndex(s => s.id === id);
    if (idx >= 0) {
        strategies[idx] = { ...strategies[idx], ...updates };
        triggerUpdate();
    }
}

// Brief Responses
export const getBriefResponses = (): BriefResponse[] => briefResponses;
export const updateBriefStatus = (id: string, status: BriefResponse['status']): void => {
    const brief = briefResponses.find(b => b.id === id);
    if (brief) {
        brief.status = status;
        triggerUpdate();
    }
};

// --- NEW SERVICE METHODS FOR PERSISTENCE ---

// Inbox
export const getMessages = (): Message[] => messages;
export const updateMessage = (updatedMsg: Message): void => {
    const idx = messages.findIndex(m => m.id === updatedMsg.id);
    if (idx >= 0) messages[idx] = updatedMsg;
    triggerUpdate();
};

// Communities
export const getCommunities = (): Community[] => communities;
export const addCommunity = (community: Community): void => {
    communities.push(community);
    triggerUpdate();
};
export const removeCommunity = (id: string): void => {
    communities = communities.filter(c => c.id !== id);
    triggerUpdate();
};

// Calendar
export const getCalendarPosts = (): CalendarPost[] => calendarPosts;
export const updateCalendarPost = (post: CalendarPost): void => {
    const idx = calendarPosts.findIndex(p => p.id === post.id);
    if (idx >= 0) calendarPosts[idx] = post;
    else calendarPosts.push(post); // Handle new post
    triggerUpdate();
};

// Publisher (Recent Posts)
export const getRecentPublisherPosts = () => recentPublisherPosts;
export const addPublisherPost = (post: any) => {
    recentPublisherPosts = [post, ...recentPublisherPosts];
    triggerUpdate();
};