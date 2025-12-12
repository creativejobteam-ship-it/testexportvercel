
import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../src/contexts/ProjectContext';
import { Client, Project, ActivityDomain, Platform, ProjectType } from '../types';
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    FolderOpen, 
    Plus, 
    Edit2,
    Trash2,
    Loader2,
    X,
    Save,
    Check,
    Twitter, Facebook, Linkedin, Instagram, Youtube, MessageSquare, Globe,
    ArrowRight
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../src/contexts/ToastContext';
import { deleteClient as deleteLocalClient, saveClient as saveLocalClient, saveProject as saveLocalProject, getDomains, getProjectTypes } from '../services/strategyService';
import { getEnabledPlatforms } from '../services/platformService';
import * as dbService from '../src/services/dbService';
import { useAuth } from '../src/contexts/AuthProvider';
import { PlatformIcon } from '../components/PlatformIcon';

interface ClientOverviewProps {
    clientId: string | null;
    onNavigate: (view: string, id: string | null) => void;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ clientId, onNavigate }) => {
    const { clients, isLoading: isContextLoading, refreshData } = useProjectContext();
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    
    const [client, setClient] = useState<Client | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Modals State
    const [isEditClientOpen, setIsEditClientOpen] = useState(false);
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Forms State
    const [editForm, setEditForm] = useState<Partial<Client>>({});
    const [projectForm, setProjectForm] = useState<Partial<Project>>({});
    
    // Config Data
    const [availableDomains, setAvailableDomains] = useState<ActivityDomain[]>([]);
    const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);

    useEffect(() => {
        setAvailableDomains(getDomains());
        setAvailablePlatforms(getEnabledPlatforms());
        setProjectTypes(getProjectTypes());
    }, []);

    useEffect(() => {
        if (clientId && !isContextLoading) {
            const found = clients.find(c => c.id === clientId);
            setClient(found || null);
        }
    }, [clientId, clients, isContextLoading]);

    const handleDeleteClient = async () => {
        if (!client) return;
        try {
            if (user && user.uid !== 'demo-user-123') {
                await dbService.deleteClient(user.uid, client.id);
            } else {
                deleteLocalClient(client.id);
            }
            await refreshData();
            success("Client deleted successfully.");
            onNavigate('clients', null);
        } catch (e) {
            console.error(e);
            showError("Failed to delete client.");
        }
    };

    // Edit Client Handlers
    const handleEditClientClick = () => {
        if (client) {
            setEditForm({ ...client });
            setIsEditClientOpen(true);
        }
    };

    const handleSaveClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.id || !client) return;
        setIsSaving(true);
        try {
            const updatedClient = { ...client, ...editForm };
            if (user && user.uid !== 'demo-user-123') {
                await dbService.updateClient(user.uid, client.id, editForm);
            } else {
                saveLocalClient(updatedClient as Client);
            }
            await refreshData();
            setIsEditClientOpen(false);
            success("Client updated successfully.");
        } catch(e) {
            console.error(e);
            showError("Failed to update client.");
        } finally {
            setIsSaving(false);
        }
    };

    // New Project Handlers
    const handleNewProjectClick = () => {
        setProjectForm({
            name: '',
            type: 'Entreprise / Société',
            activitySector: client?.activities || availableDomains[0]?.name || '',
            platforms: [],
            status: 'active'
        });
        setIsNewProjectOpen(true);
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectForm.name || !client) return;
        setIsSaving(true);
        
        const newProject: Project = {
            id: `proj_${Date.now()}`,
            name: projectForm.name!,
            type: projectForm.type || 'General',
            clientId: client.id,
            clientName: client.companyName,
            status: 'active',
            platformCount: projectForm.platforms?.length || 0,
            platforms: projectForm.platforms || [],
            activitySector: projectForm.activitySector || 'General',
            nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            autopilotEnabled: false,
            briefingStatus: 'not_sent'
        };

        try {
            if (user && user.uid !== 'demo-user-123') {
                const currentProjects = client.projects || [];
                const updatedProjects = [...currentProjects, newProject];
                await dbService.updateClient(user.uid, client.id, { projects: updatedProjects });
            } else {
                saveLocalProject(newProject);
                const updatedClient = { ...client, projects: [...(client.projects || []), newProject] };
                saveLocalClient(updatedClient);
            }
            await refreshData();
            setIsNewProjectOpen(false);
            success("Project created successfully.");
        } catch(e) {
            console.error(e);
            showError("Failed to create project.");
        } finally {
            setIsSaving(false);
        }
    };

    const togglePlatform = (p: Platform) => {
        const current = projectForm.platforms || [];
        if (current.includes(p)) {
            setProjectForm({ ...projectForm, platforms: current.filter(x => x !== p) });
        } else {
            setProjectForm({ ...projectForm, platforms: [...current, p] });
        }
    };

    if (isContextLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212]">
                <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                <p className="text-gray-500 dark:text-[#888] text-sm">Loading client...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212]">
                <p className="text-gray-500">Client not found.</p>
                <button 
                    onClick={() => onNavigate('clients', null)}
                    className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                    Back to Clients
                </button>
            </div>
        );
    }

    const activeProjects = client.projects?.filter(p => p.status === 'active').length || 0;

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#121212] pb-12 animate-fade-in relative">
            <ConfirmationModal 
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteClient}
                title="Delete Client?"
                message="This will remove the client and all associated projects. This action cannot be undone."
                confirmLabel="Delete Client"
                isDestructive={true}
            />

            {/* Edit Client Modal */}
            {isEditClientOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                        <div className="p-6 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">Edit Client Details</h3>
                            <button onClick={() => setIsEditClientOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveClient} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">First Name</label>
                                    <input type="text" value={editForm.firstName || ''} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Last Name</label>
                                    <input type="text" value={editForm.lastName || ''} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Company Name</label>
                                <input type="text" value={editForm.companyName || ''} onChange={e => setEditForm({...editForm, companyName: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Email</label>
                                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Phone</label>
                                    <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Language</label>
                                    <select 
                                        value={editForm.language || ''} 
                                        onChange={e => setEditForm({...editForm, language: e.target.value})} 
                                        className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"
                                    >
                                        <option value="">Select Language</option>
                                        <option value="English">English</option>
                                        <option value="French">French</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="German">German</option>
                                        <option value="Italian">Italian</option>
                                        <option value="Portuguese">Portuguese</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Country</label>
                                    <select 
                                        value={editForm.country || ''} 
                                        onChange={(e) => setEditForm({...editForm, country: e.target.value})} 
                                        className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]"
                                    >
                                        <option value="">Select Country</option>
                                        <option value="France">France</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="Germany">Germany</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">City</label>
                                    <input type="text" value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditClientOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]">Cancel</button>
                                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-70 flex items-center gap-2">
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Project Modal */}
            {isNewProjectOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828]">
                        <div className="p-6 border-b border-gray-100 dark:border-[#2e2e2e] flex justify-between items-center bg-gray-50 dark:bg-[#1c1c1c]">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">New Project for {client.companyName}</h3>
                            <button onClick={() => setIsNewProjectOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Project Name</label>
                                <input type="text" required value={projectForm.name || ''} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" placeholder="e.g. Q4 Marketing Campaign" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Type</label>
                                    <select value={projectForm.type} onChange={e => setProjectForm({...projectForm, type: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]">
                                        {projectTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Activity Sector</label>
                                    <select value={projectForm.activitySector} onChange={e => setProjectForm({...projectForm, activitySector: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]">
                                        {availableDomains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-2">Active Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {availablePlatforms.map(p => {
                                        const isSelected = projectForm.platforms?.includes(p);
                                        return (
                                            <button 
                                                key={p} 
                                                type="button"
                                                onClick={() => togglePlatform(p)} 
                                                className={`p-2 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-500' : 'bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-[#383838] hover:border-gray-300 dark:hover:border-[#444]'}`}
                                                title={p}
                                            >
                                                <PlatformIcon 
                                                    platform={p} 
                                                    size={20} 
                                                    grayscale={!isSelected}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsNewProjectOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed]">Cancel</button>
                                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-70 flex items-center gap-2">
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] px-8 py-8 w-full">
                <div className="w-full">
                    <button 
                        onClick={() => onNavigate('clients', null)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-[#ededed] mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Clients
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-[#ededed] mb-2">{client.companyName}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-[#888]">
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={14} /> {client.email}
                                    </div>
                                    {client.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={14} /> {client.phone}
                                        </div>
                                    )}
                                    {client.city && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} /> {client.city}, {client.country}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={handleEditClientClick}
                                className="px-4 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-lg text-sm font-medium text-gray-700 dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={16} /> Edit Details
                            </button>
                            <button 
                                onClick={() => setDeleteModalOpen(true)}
                                className="px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-8 py-8 space-y-8">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-[#ededed]">{client.projects?.length || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Campaigns</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{activeProjects}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-xl border border-gray-200 dark:border-[#282828] shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sector</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-[#ededed] truncate">{client.activities || 'General'}</p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-[#ededed]">Projects</h2>
                        <button 
                            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            onClick={handleNewProjectClick}
                        >
                            <Plus size={16} /> New Project
                        </button>
                    </div>

                    {(!client.projects || client.projects.length === 0) ? (
                        <div className="text-center py-16 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-dashed border-gray-300 dark:border-[#333]">
                            <FolderOpen size={32} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 dark:text-[#888]">No projects yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {client.projects.map((project) => (
                                <div 
                                    key={project.id}
                                    onClick={() => onNavigate('project-details', project.id)}
                                    className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            <FolderOpen size={24} />
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-[#333] dark:text-[#ccc]'}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededed] mb-1">{project.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-[#888] mb-4">{project.activitySector || 'General'}</p>
                                    
                                    <div className="pt-4 border-t border-gray-100 dark:border-[#333] flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            Stage: <span className="font-medium text-gray-700 dark:text-[#ccc]">{project.autopilotSettings?.currentWorkflowStage?.replace('_', ' ') || 'Planning'}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ClientOverview;