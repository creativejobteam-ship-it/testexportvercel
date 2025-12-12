
import React, { useState, useEffect } from 'react';
import { Copy, Send, CheckCircle2, Link as LinkIcon, Layers, Settings, Mail, FileText, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { getDomains } from '../../services/strategyService';
import { createBriefingRecord } from '../../services/briefingService';
import { Client, ActivityDomain, Project, Platform, ProjectContextType } from '../../types';
import { useToast } from '../../src/contexts/ToastContext';
import { useProjectContext } from '../../src/contexts/ProjectContext';

const SendBriefingRequest: React.FC = () => {
    const { success, info } = useToast();
    const { clients, isLoading: isContextLoading } = useProjectContext();
    
    const [domains, setDomains] = useState<ActivityDomain[]>([]);
    
    // Selection State
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [detectedDomain, setDetectedDomain] = useState<ActivityDomain | null>(null);
    
    // Result State
    const [generatedLink, setGeneratedLink] = useState('');
    const [createdRecordId, setCreatedRecordId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        setDomains(getDomains());
    }, []);

    // Handle Client Selection
    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find(c => c.id === selectedClientId);
            setSelectedClient(client || null);
            setSelectedProjectId(''); // Reset project
            setDetectedDomain(null);
        } else {
            setSelectedClient(null);
            setSelectedProjectId('');
            setDetectedDomain(null);
        }
    }, [selectedClientId, clients]);

    // Handle Project Selection & Domain Detection
    useEffect(() => {
        if (selectedClient && selectedProjectId) {
            const proj = selectedClient.projects?.find(p => p.id === selectedProjectId);
            setSelectedProject(proj || null);
            
            if (proj && proj.activitySector) {
                // Try to find the matching domain template
                const sectorName = proj.activitySector.toLowerCase();
                const domain = domains.find(d => 
                    d.name.toLowerCase() === sectorName || 
                    d.slug.toLowerCase() === sectorName ||
                    d.name.toLowerCase().includes(sectorName) // Loose match
                );
                setDetectedDomain(domain || null);
            } else {
                setDetectedDomain(null);
            }
        } else {
            setSelectedProject(null);
            setDetectedDomain(null);
        }
    }, [selectedProjectId, selectedClient, domains]);

    // Action Handler
    const handleCreateBriefing = async (method: 'EMAIL' | 'MANUAL') => {
        if (!selectedClient || !selectedProject) return;
        setIsCreating(true);

        const domainName = detectedDomain ? detectedDomain.name : (selectedProject.activitySector || 'General Business');
        const platforms = selectedProject.platforms || [];

        // Create the record in DB
        const record = await createBriefingRecord(
            { id: selectedClient.id, name: selectedClient.companyName, email: selectedClient.email },
            { id: selectedProject.id, name: selectedProject.name },
            { domainName, context: 'MAINTENANCE', platforms }, // Defaulting context to MAINTENANCE for simplicity
            method
        );

        // UI Feedback delay
        setTimeout(() => {
            setGeneratedLink(record.generatedLink);
            setCreatedRecordId(record.id);
            setIsCreating(false);
            
            if (method === 'EMAIL') {
                success(`Email client opened for ${selectedClient.companyName}`);
                // Construct mailto link
                const subject = encodeURIComponent(`Brief projet : ${selectedProject.name}`);
                const body = encodeURIComponent(`Bonjour ${selectedClient.firstName},\n\nVoici le lien pour compléter le brief de votre projet "${selectedProject.name}" :\n\n${record.generatedLink}\n\nMerci,\nL'équipe.`);
                window.location.href = `mailto:${selectedClient.email}?subject=${subject}&body=${body}`;
            } else {
                info("Link generated. You can copy it now.");
            }
        }, 800);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        success("Link copied to clipboard!");
    };

    if (isContextLoading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-emerald-500 mb-4" />
                <p className="text-gray-500">Loading clients and projects...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-fade-in pb-12 pt-6 max-w-5xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Create New Briefing Request</h2>
                <p className="text-gray-500 dark:text-[#8b9092] mt-2">
                    Select a project to automatically generate the correct briefing form based on its activity sector.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* LEFT: Configuration */}
                <div className="bg-white dark:bg-[#232323] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm space-y-6 flex flex-col h-full">
                    <h3 className="font-bold text-gray-900 dark:text-[#ededed] flex items-center gap-2">
                        <Settings size={18} className="text-emerald-500" /> Configuration
                    </h3>
                    
                    <div className="space-y-5 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#8b9092] mb-2">1. Select Client</label>
                            <select 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" 
                                value={selectedClientId} 
                                onChange={(e) => setSelectedClientId(e.target.value)}
                            >
                                <option value="">-- Choose Client --</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.companyName} ({c.firstName} {c.lastName})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#8b9092] mb-2">2. Select Project</label>
                            <select 
                                className="w-full px-4 py-3 border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-[#ededed] rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow" 
                                value={selectedProjectId} 
                                onChange={(e) => setSelectedProjectId(e.target.value)} 
                                disabled={!selectedClient}
                            >
                                <option value="">-- Choose Project --</option>
                                {selectedClient?.projects?.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} — {p.activitySector}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Indicator Box */}
                        <div className={`p-4 rounded-lg border transition-all ${
                            detectedDomain 
                            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' 
                            : selectedProject 
                                ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
                                : 'bg-gray-50 border-gray-200 dark:bg-[#1a1a1a] dark:border-[#333]'
                        }`}>
                            <div className="flex items-start gap-3">
                                {detectedDomain ? (
                                    <Sparkles className="text-emerald-500 mt-0.5" size={18} />
                                ) : (
                                    <AlertCircle className="text-gray-400 mt-0.5" size={18} />
                                )}
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 dark:text-[#ededed]">
                                        {detectedDomain ? 'Smart Template Detected' : selectedProject ? 'Using Generic Template' : 'Waiting for selection...'}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-[#888] mt-1 block">
                                        {detectedDomain 
                                            ? `Matched sector "${detectedDomain.name}". Specific questions included.` 
                                            : selectedProject 
                                                ? `No specific template found for "${selectedProject.activitySector}". Using general business questions.` 
                                                : "Select a project to see which form template will be used."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Assembly Preview & Action */}
                <div className="space-y-6">
                    {/* Assembly Visualization */}
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-[#282828] h-fit relative overflow-hidden">
                        <h3 className="font-bold text-gray-900 dark:text-[#ededed] flex items-center gap-2 mb-4 relative z-10">
                            <Layers size={18} className="text-blue-500" /> Module Assembly Preview
                        </h3>
                        
                        {!selectedProject ? (
                            <div className="text-center py-12 text-gray-400 text-sm italic relative z-10">
                                Select a client and project to see the briefing structure.
                            </div>
                        ) : (
                            <div className="space-y-3 relative z-10">
                                {/* Connection Line */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-[#333] -z-10"></div>
                                
                                {/* Module 1: Global */}
                                <div className="bg-white dark:bg-[#232323] p-4 rounded-lg border border-gray-200 dark:border-[#333] shadow-sm flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold ring-4 ring-white dark:ring-[#1a1a1a]">1</div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Global Standard</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Agency Essentials</div>
                                    </div>
                                </div>

                                {/* Module 2: Sector Specific (Dynamic) */}
                                <div className="bg-white dark:bg-[#232323] p-4 rounded-lg border border-emerald-200 dark:border-emerald-900 shadow-sm ring-1 ring-emerald-50 dark:ring-emerald-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold ring-4 ring-white dark:ring-[#1a1a1a] mt-1">2</div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                                                {detectedDomain ? 'Sector Specific Module' : 'Generic Module'}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-[#ededed] mb-2">
                                                {detectedDomain ? detectedDomain.name : 'General Business'}
                                            </div>
                                            
                                            {/* Question List Preview */}
                                            <div className="bg-gray-50 dark:bg-[#151515] rounded border border-gray-100 dark:border-[#333] p-3">
                                                <div className="text-xs text-gray-500 dark:text-[#888] mb-2 font-medium flex items-center gap-1">
                                                    <FileText size={10} /> Included Questions:
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {detectedDomain ? (
                                                        detectedDomain.domainTemplate.map((q, i) => (
                                                            <li key={i} className="text-xs text-gray-700 dark:text-[#ccc] flex items-start gap-2">
                                                                <span className="text-emerald-400 mt-0.5">•</span> {q.label}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-xs text-gray-500 italic">Standard business model questions...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Output Actions */}
                    {selectedProject && (
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm animate-fade-in">
                            <label className="block text-xs font-bold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-3">
                                Ready to Dispatch
                            </label>
                            
                            {!generatedLink ? (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleCreateBriefing('EMAIL')} 
                                        disabled={isCreating}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        <Mail size={16} /> Send via Email
                                    </button>
                                    <button 
                                        onClick={() => handleCreateBriefing('MANUAL')} 
                                        disabled={isCreating}
                                        className="flex-1 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-[#ededed] py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition-colors shadow-sm text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        <LinkIcon size={16} /> Generate Link
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-fade-in space-y-3">
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg px-3 py-2 text-sm text-emerald-800 dark:text-emerald-400 font-mono truncate">
                                            {generatedLink}
                                        </div>
                                        <button 
                                            onClick={handleCopy} 
                                            className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                        >
                                            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#888]">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                        <span>Briefing ID: {createdRecordId} created successfully.</span>
                                    </div>
                                    <button 
                                        onClick={() => { setGeneratedLink(''); setSelectedProjectId(''); }}
                                        className="text-xs text-blue-600 hover:underline w-full text-center mt-2"
                                    >
                                        Create Another Brief
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendBriefingRequest;
