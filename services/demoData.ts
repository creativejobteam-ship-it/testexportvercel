
import { Client, Project, Strategy, BriefResponse, Message, Community, CalendarPost, ModerationItem, Platform, ProjectContextType, ActivityDomain, AutopilotRotationPeriod, AppNotification, WorkflowStage } from '../types';

// --- CONSTANTS ---
const CITIES = ['Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Lille', 'Nantes', 'Strasbourg', 'Toulouse', 'Nice', 'Montpellier'];

const CONTACT_NAMES = [
    { first: 'Sophie', last: 'Martin' },
    { first: 'Thomas', last: 'Dubois' },
    { first: 'Marie', last: 'Leroy' },
    { first: 'Lucas', last: 'Moreau' },
    { first: 'Camille', last: 'Simon' },
    { first: 'Nicolas', last: 'Laurent' },
    { first: 'Julie', last: 'Roux' },
    { first: 'Antoine', last: 'Girard' },
    { first: 'Léa', last: 'Bonnet' },
    { first: 'Pierre', last: 'Dupont' }
];

// --- SPECIFIC SCENARIOS FOR DEMO CONSISTENCY ---
// Flow: BRIEF_RECEIVED -> AUDIT_SEARCH -> STRATEGY_GEN -> ACTION_PLAN -> PRODUCTION

const SCENARIOS = [
    // 1. PROJECTS IN BRIEFING PHASE (Visible in Manage Briefs as Pending/Draft)
    { name: 'Le Petit Bistro', type: 'Lieu Physique', stage: 'BRIEF_RECEIVED', domain: 'Restoration / Food', briefStatus: 'not_sent' },
    { name: 'Music Fest Open', type: 'Événement', stage: 'BRIEF_RECEIVED', domain: 'Travel / Tourism', briefStatus: 'not_sent' },
    { name: 'Urban Threads', type: 'Marque', stage: 'BRIEF_RECEIVED', domain: 'Fashion / Retail', briefStatus: 'sent' },

    // 2. PROJECTS IN AUDIT PHASE (Brief Completed -> Visible in Audit Module)
    { name: 'organic-market.bio', type: 'Site E-commerce', stage: 'AUDIT_SEARCH', domain: 'Restoration / Food', briefStatus: 'completed' },
    { name: 'CrossFit Downtown', type: 'Lieu Physique', stage: 'AUDIT_SEARCH', domain: 'Health & Wellness', briefStatus: 'completed' },
    { name: 'Rebranding 2024', type: 'Entreprise / Société', stage: 'AUDIT_SEARCH', domain: 'Consulting', briefStatus: 'completed' },
    
    // 3. PROJECTS IN STRATEGY PHASE (Audit Done -> Visible in Strategies Module)
    { name: 'luxury-watches.net', type: 'Site E-commerce', stage: 'STRATEGY_GEN', domain: 'Fashion / Retail', briefStatus: 'completed' },
    { name: 'Summer Campaign', type: 'Marque', stage: 'STRATEGY_GEN', domain: 'Fashion / Retail', briefStatus: 'completed' },
    { name: 'New App Launch', type: 'Application Mobile', stage: 'STRATEGY_GEN', domain: 'Tech / SaaS', briefStatus: 'completed' },

    // 4. PROJECTS IN ACTION PLAN (Strategy Validated -> Visible in Action Plan Module)
    { name: 'Gala de Charité Hiver', type: 'Événement', stage: 'ACTION_PLAN', domain: 'Non-Profit', briefStatus: 'completed' },
    { name: 'Rapid Works', type: 'Entreprise / Société', stage: 'ACTION_PLAN', domain: 'Tech / SaaS', briefStatus: 'completed' },
    
    // 5. PRODUCTION
    { name: 'TechFlow', type: 'Entreprise / Société', stage: 'PRODUCTION', domain: 'Tech / SaaS', briefStatus: 'completed' },
];

const generateClientsAndProjects = (): { clients: Client[], projects: Project[], strategies: Strategy[], briefs: BriefResponse[] } => {
    const clients: Client[] = [];
    const allProjects: Project[] = [];
    const strategies: Strategy[] = [];
    const briefs: BriefResponse[] = [];

    const rotationPeriods: AutopilotRotationPeriod[] = ['15_days', '1_month', '3_months', '6_months'];
    
    SCENARIOS.forEach((scenario, i) => {
        const clientId = `client_${i + 1}`;
        const projectId = `proj_${clientId}_0`;
        const companyName = scenario.name;
        const contact = CONTACT_NAMES[i % CONTACT_NAMES.length];
        
        // Determine Statuses based on Stage & Config
        let briefingStatus: 'not_sent' | 'sent' | 'completed' = scenario.briefStatus as 'not_sent' | 'sent' | 'completed';
        
        let strategyStatus: 'draft' | 'active' | 'completed' | undefined = undefined;
        let briefResponseStatus: 'draft' | 'new' | 'reviewed' | 'converted' = 'new';

        // Brief Response Status Logic
        if (scenario.briefStatus === 'not_sent') {
            briefResponseStatus = 'draft'; // Draft/Pending
        } else if (scenario.briefStatus === 'sent') {
            briefResponseStatus = 'new'; // Sent but not processed
        } else if (scenario.briefStatus === 'completed') {
            // If we are past Audit, the brief is "converted" into a strategy context usually
            if (scenario.stage === 'AUDIT_SEARCH') {
                briefResponseStatus = 'reviewed';
            } else {
                briefResponseStatus = 'converted';
            }
        }

        // Strategy Status Logic
        if (scenario.stage === 'STRATEGY_GEN') {
            strategyStatus = 'draft'; // Strategy created but not validated
        } else if (scenario.stage === 'ACTION_PLAN' || scenario.stage === 'PRODUCTION') {
            strategyStatus = 'active'; // Strategy validated
        }

        // --- CREATE PROJECT ---
        const project: Project = {
            id: projectId,
            name: scenario.name,
            type: scenario.type,
            clientName: companyName,
            clientId: clientId,
            activitySector: scenario.domain,
            status: 'active',
            platformCount: 3,
            platforms: [Platform.Twitter, Platform.LinkedIn, Platform.Instagram],
            nextDeadline: new Date(Date.now() + 86400000 * 7).toISOString(),
            autopilotEnabled: scenario.stage !== 'BRIEF_RECEIVED',
            briefingStatus: briefingStatus,
            briefingContext: 'MAINTENANCE',
            autopilotSettings: {
                rotationPeriod: rotationPeriods[i % rotationPeriods.length],
                lastRotationDate: new Date().toISOString(),
                cycleStartDate: new Date().toISOString(),
                currentWorkflowStage: scenario.stage as WorkflowStage
            }
        };
        allProjects.push(project);

        // --- CREATE CLIENT ---
        const client: Client = {
            id: clientId,
            firstName: contact.first,
            lastName: contact.last,
            companyName: companyName,
            email: `${contact.first.toLowerCase()}@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            phone: `+33 6 12 34 56 ${i.toString().padStart(2, '0')}`,
            activities: scenario.domain,
            country: 'France',
            city: CITIES[i % CITIES.length],
            questionnaireStatus: briefingStatus,
            createdAt: new Date().toISOString(),
            autopilotExcluded: false,
            projects: [project]
        };
        clients.push(client);

        // --- CREATE BRIEF RESPONSE ---
        briefs.push({
            id: `brief_${clientId}`,
            clientId: clientId,
            clientName: companyName,
            projectId: projectId, 
            // @ts-ignore
            projectName: scenario.name, 
            domainId: 'dom_gen',
            domainName: scenario.domain,
            answers: { 
                business_name: companyName,
                main_goal: 'Growth & Awareness', 
                target_audience_macro: 'Professionals 25-45',
                website: `https://www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
            },
            submittedAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
            status: briefResponseStatus,
            projectContext: 'MAINTENANCE',
            targetNetworks: project.platforms || []
        });

        // --- CREATE STRATEGY ---
        if (strategyStatus) {
            strategies.push({
                id: `str_${clientId}`,
                clientId: clientId,
                clientName: companyName,
                clientAvatar: `https://ui-avatars.com/api/?name=${companyName.replace(' ', '+')}&background=random`,
                domain: scenario.domain,
                periodStart: '2023-11-01',
                periodEnd: '2023-11-30',
                performanceScore: Math.floor(Math.random() * 100),
                month: 'November',
                year: 2023,
                theme: 'Growth Campaign Q4',
                goals: ['Increase Reach by 20%', 'Boost Engagement'],
                contentPillars: ['Education', 'Social Proof', 'Product Features'],
                status: strategyStatus,
                actionPlan: [
                    { id: 't1', task: 'Review Content Calendar', status: 'completed', dueDate: '2023-11-05', priority: 'high' },
                    { id: 't2', task: 'Approve Visual Assets', status: 'in-progress', dueDate: '2023-11-10', priority: 'medium' },
                    { id: 't3', task: 'Setup Ad Campaign', status: 'pending', dueDate: '2023-11-15', priority: 'high' },
                    { id: 't4', task: 'Community Management Setup', status: 'completed', dueDate: '2023-11-02', priority: 'low' }
                ]
            });
        }
    });

    return { clients, projects: allProjects, strategies, briefs };
};

const generateInbox = (): Message[] => {
    const messages: Message[] = [];
    return messages;
};

const generateCommunities = (): Community[] => {
    const communities: Community[] = [];
    return communities;
};

const generateCalendar = (projects: Project[]): CalendarPost[] => {
    const posts: CalendarPost[] = [];
    const activeProjects = projects.filter(p => 
        p.autopilotSettings?.currentWorkflowStage === 'PRODUCTION' || 
        p.autopilotSettings?.currentWorkflowStage === 'ACTION_PLAN'
    );

    if (activeProjects.length === 0) return [];

    for (let i = 1; i <= 20; i++) {
        const day = (i % 28) + 1;
        const project = activeProjects[Math.floor(Math.random() * activeProjects.length)];
        
        posts.push({
            id: i,
            projectId: project.id,
            projectName: project.name,
            platform: Platform.Twitter,
            content: `Mock post content ${i} for ${project.name}...`,
            date: `Nov ${day}, 2023`,
            time: `10:00 AM`,
            status: 'Scheduled',
            day: day
        });
    }
    return posts.sort((a, b) => a.day - b.day);
};

const generateModeration = (): ModerationItem[] => {
    return [];
};

const generateNotifications = (projects: Project[]): AppNotification[] => {
    const notifs: AppNotification[] = [];
    projects.forEach((p, i) => {
        if (i < 3) {
            notifs.push({
                id: `nf_${i}`,
                title: `Workflow Update: ${p.name}`,
                description: `Project moved to ${p.autopilotSettings?.currentWorkflowStage}`,
                time: '2h ago',
                timestamp: new Date().toISOString(),
                type: 'workflow',
                read: false,
                projectId: p.id
            });
        }
    });
    return notifs;
};

// --- INITIALIZE ---
const { clients, projects, strategies, briefs } = generateClientsAndProjects();

export const DEMO_DATA = {
    clients,
    projects,
    strategies,
    briefs,
    inbox: generateInbox(),
    communities: generateCommunities(),
    calendar: generateCalendar(projects),
    moderation: generateModeration(),
    notifications: generateNotifications(projects)
};
