
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getClients as getLocalClients, saveClient as saveLocalClient, deleteClient as deleteLocalClient, getProjectTypes, getDomains, saveProject } from '../services/strategyService';
import { getEnabledPlatforms } from '../services/platformService';
import { createBriefingRecord } from '../services/briefingService';
import * as dbService from '../src/services/dbService';
import { useAuth } from '../src/contexts/AuthProvider';
import { useToast } from '../src/contexts/ToastContext';
import { Client, Project, ProjectType, Platform, ActivityDomain } from '../types';
import { 
    Search, Plus, MoreHorizontal, Edit2, Send, Trash2, 
    X, Sparkles, Phone, Mail, 
    FolderOpen, Briefcase, ChevronRight, Check,
    Grid, List, ChevronDown, Loader2,
    Eye, MapPin, PenLine, Save
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { PlatformIcon } from '../components/PlatformIcon';

// Phone Input Library
import PhoneInput from 'react-phone-number-input';

// International Data Libraries
import { Country, City } from 'country-state-city';
import ISO6391 from 'iso-639-1';

// --- Components ---

interface SearchableSelectProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder = "Select...", disabled = false, icon, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    // Handle Click Outside (Trigger + Portal Content)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
        if (!isOpen) {
            setSearch('');
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
    }, [options, search]);

    const selectedLabel = options.find(opt => opt.value === value)?.label || value;

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div 
                className={`w-full h-[42px] flex items-center justify-between border rounded-lg px-3 text-sm bg-white dark:bg-[#1c1c1c] dark:text-[#ededed] transition-all cursor-pointer ${disabled ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-400 cursor-not-allowed border-gray-200 dark:border-[#383838]' : isOpen ? 'ring-1 ring-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-[#383838] hover:border-gray-400'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
                    <span className={`truncate ${!value ? 'text-gray-400' : ''}`}>
                        {value ? selectedLabel : placeholder}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Portal to Body to avoid clipping */}
            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    className="fixed z-[9999] mt-1 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-lg shadow-xl overflow-hidden animate-fade-in"
                    style={{
                        top: coords.top + 4,
                        left: coords.left,
                        width: coords.width
                    }}
                >
                    <div className="p-2 border-b border-gray-100 dark:border-[#2e2e2e]">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#2a2a2a] px-2 py-1.5 rounded-md">
                            <Search size={14} className="text-gray-400" />
                            <input 
                                ref={inputRef}
                                type="text" 
                                className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-[#ededed] placeholder-gray-400"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div 
                                    key={opt.value}
                                    className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center justify-between ${opt.value === value ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-[#ededed] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'}`}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {opt.label}
                                    {opt.value === value && <Check size={14} />}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-gray-400">
                                No results found
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const FilterPill = ({ label, value, options, onSelect, active }: { label: string, value: string, options: {label: string, value: string}[], onSelect: (val: string) => void, active: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${active ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-white dark:bg-[#232323] text-gray-600 dark:text-[#999] border-gray-200 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
            >
                <span>{label}:</span>
                <span className="font-semibold">{options.find(o => o.value === value)?.label || value}</span>
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-lg shadow-lg z-50 py-1 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onSelect(opt.value); setIsOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-between ${value === opt.value ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-[#ededed]'}`}
                        >
                            {opt.label}
                            {value === opt.value && <Check size={12} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Clients: React.FC<any> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, error: showError, info } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState(false);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingClient, setEditingClient] = useState<Partial<Client>>({});
  
  // Project Form State
  const [tempProjects, setTempProjects] = useState<Partial<Project>[]>([]);
  const [newProjectForm, setNewProjectForm] = useState({
      name: '',
      type: 'Entreprise / Société',
      sector: '',
      platforms: [] as Platform[]
  });
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);

  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [availableDomains, setAvailableDomains] = useState<ActivityDomain[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // --- Phone Input State ---
  const [phoneCountry, setPhoneCountry] = useState<any | undefined>();
  const [hasManualPhoneCountry, setHasManualPhoneCountry] = useState(false);

  // --- Data Options ---
  const countryOptions = useMemo(() => Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode })), []);
  
  const cityOptions = useMemo(() => {
      if (!editingClient.country) return [];
      // editingClient.country stores the ISO Code (e.g., 'FR')
      return City.getCitiesOfCountry(editingClient.country).map(c => ({ label: c.name, value: c.name }));
  }, [editingClient.country]);

  const languageOptions = useMemo(() => {
      return ISO6391.getAllCodes().map(code => ({
          label: ISO6391.getNativeName(code),
          value: ISO6391.getName(code) // Storing English name for consistency with existing data, or use 'code' if preferred
      })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // --- Auto-Sync Logic: Country -> Phone Country ---
  useEffect(() => {
      // Sync phone country only if user hasn't manually changed it
      if (!hasManualPhoneCountry && editingClient.country) {
          // editingClient.country is already ISO code (e.g. 'FR') which PhoneInput expects as defaultCountry
          setPhoneCountry(editingClient.country);
      }
  }, [editingClient.country, hasManualPhoneCountry]);

  const fetchClients = async () => {
      setIsLoading(true);
      try {
          if (user && user.uid !== 'demo-user-123') {
              const dbClients = await dbService.getClients(user.uid);
              setClients(dbClients);
          } else {
              setClients(getLocalClients());
          }
      } catch (error) {
          console.error("Failed to fetch clients", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchClients();
    const types = getProjectTypes();
    setProjectTypes(types);
    const domains = getDomains();
    setAvailableDomains(domains);
    if (domains.length > 0) {
        setNewProjectForm(prev => ({ ...prev, sector: domains[0].name }));
    }
    setAvailablePlatforms(getEnabledPlatforms());
  }, [user]);

  useEffect(() => {
      const handleClick = () => setActionMenuOpen(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleOpenModal = (client?: Client) => {
      // Reset manual phone override when opening modal
      setHasManualPhoneCountry(false);
      setPhoneCountry(undefined);
      
      // Reset Project Form State
      setIsProjectFormOpen(false);
      setEditingProjectIndex(null);

      if (client) {
          // Fix E.164 error: Sanitize phone number by removing spaces
          // Use String() to be safe if phone comes in as number or undefined
          const sanitizedPhone = client.phone ? String(client.phone).replace(/\s/g, '') : '';
          
          setEditingClient({ ...client, phone: sanitizedPhone });
          
          // If the existing client has a country name stored instead of ISO (legacy data), try to find its ISO
          if (client.country && client.country.length > 2) {
              const found = countryOptions.find(c => c.label === client.country);
              if (found) {
                  setEditingClient(prev => ({ ...prev, country: found.value }));
              }
          }
          setTempProjects(client.projects || []);
      } else {
          setEditingClient({
              firstName: '',
              lastName: '',
              companyName: '',
              email: '',
              phone: '',
              city: '',
              country: '', // Will store ISO code
              language: '',
              activities: '',
              questionnaireStatus: 'not_sent', 
              autopilotExcluded: false
          });
          setTempProjects([]);
      }
      setNewProjectForm({
          name: '',
          type: projectTypes[0]?.name || 'Entreprise / Société',
          sector: availableDomains[0]?.name || 'General',
          platforms: []
      });
      setCurrentStep(1);
      setIsModalOpen(true);
      setActionMenuOpen(null);
  };

  const handleSendBulkBriefs = async (client: Client, e: React.MouseEvent) => {
      e.stopPropagation();
      setActionMenuOpen(null);

      if (!client.projects || client.projects.length === 0) {
          info("No projects found for this client. Create a project first.");
          return;
      }

      setIsGeneratingLinks(true);
      success("Generating secure brief links for " + client.companyName + "...", "Please wait.");

      try {
          const projectLinks: { name: string; url: string; sector: string }[] = [];

          // 1. Loop through all active projects for the client
          for (const project of client.projects) {
              if (project.status === 'active') {
                  const sector = project.activitySector || 'General';
                  
                  // 2. Generate/Get Briefing Record
                  const record = await createBriefingRecord(
                      { id: client.id, name: client.companyName, email: client.email },
                      { id: project.id, name: project.name },
                      { domainName: sector, context: 'MAINTENANCE', platforms: project.platforms || [] },
                      'EMAIL' // This marks the brief as 'SENT'
                  );

                  projectLinks.push({
                      name: project.name,
                      url: record.generatedLink,
                      sector: sector
                  });
              }
          }

          if (projectLinks.length === 0) {
              info("No active projects found.");
              setIsGeneratingLinks(false);
              return;
          }

          // 3. Construct Email Body
          const subject = encodeURIComponent(`Brief pour votre projet - ${client.companyName}`);
          
          let bodyText = `Bonjour ${client.firstName},\n\n`;
          bodyText += `Afin de lancer la production pour vos projets en cours, nous avons besoin de quelques informations stratégiques.\n\n`;
          bodyText += `Veuillez compléter le brief pour votre/vos projet(s) via les liens sécurisés ci-dessous :\n\n`;

          projectLinks.forEach(link => {
              bodyText += `- ${link.name} (${link.sector}) :\n${link.url}\n\n`;
          });

          bodyText += `Ces liens sont uniques et sécurisés. Une fois validés, ils seront verrouillés pour analyse.\n\n`;
          bodyText += `Cordialement,\nL'équipe Auto-CM`;

          // 4. Open Mail Client
          window.location.href = `mailto:${client.email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
          
          // Update local state to reflect 'SENT' status
          setTimeout(() => {
              success("Email client opened!", "Briefs marked as sent.");
              fetchClients(); // Refresh list to update status badges
          }, 1000);

      } catch (err) {
          console.error(err);
          showError("Failed to generate brief links.");
      } finally {
          setIsGeneratingLinks(false);
      }
  };

  const handleToggleAutopilot = async (client: Client, e: React.MouseEvent) => {
      e.stopPropagation();
      const updatedClient: Client = { ...client, autopilotExcluded: !client.autopilotExcluded };
      
      if (user && user.uid !== 'demo-user-123') {
          await dbService.updateClient(user.uid, client.id, { autopilotExcluded: updatedClient.autopilotExcluded });
      } else {
          saveLocalClient(updatedClient); 
      }
      
      fetchClients();
      setActionMenuOpen(null);
      success(`Autopilot ${updatedClient.autopilotExcluded ? 'disabled' : 'enabled'} for ${client.companyName}`);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setClientToDelete(id);
      setDeleteModalOpen(true);
      setActionMenuOpen(null);
  };

  const handleConfirmDelete = async () => {
      if (!clientToDelete) return;
      
      if (user && user.uid !== 'demo-user-123') {
          try {
              await dbService.deleteClient(user.uid, clientToDelete);
              fetchClients();
              success("Client deleted successfully.");
          } catch (err) {
              showError("Failed to delete client. Check your permissions or network connection.");
          }
      } else {
          deleteLocalClient(clientToDelete);
          fetchClients();
          success("Client deleted (Demo).");
      }
      
      setClientToDelete(null);
  };

  const handleOpenProjectForm = () => {
      setNewProjectForm({
          name: '',
          type: projectTypes[0]?.name || 'Entreprise / Société',
          sector: availableDomains[0]?.name || 'General',
          platforms: []
      });
      setEditingProjectIndex(null);
      setIsProjectFormOpen(true);
  };

  const handleEditTempProject = (idx: number) => {
      const projectToEdit = tempProjects[idx];
      setNewProjectForm({
          name: projectToEdit.name || '',
          type: projectToEdit.type || 'Entreprise / Société',
          sector: projectToEdit.activitySector || availableDomains[0]?.name || '',
          platforms: projectToEdit.platforms || []
      });
      setEditingProjectIndex(idx);
      setIsProjectFormOpen(true);
  };

  const handleSaveTempProject = () => {
      if (!newProjectForm.name) return;
      
      const newProj: Partial<Project> = {
          id: editingProjectIndex !== null && tempProjects[editingProjectIndex].id ? tempProjects[editingProjectIndex].id : `temp_${Date.now()}`,
          name: newProjectForm.name,
          type: newProjectForm.type,
          activitySector: newProjectForm.sector,
          platforms: newProjectForm.platforms,
          status: 'active',
          platformCount: newProjectForm.platforms.length,
          autopilotEnabled: true,
          briefingStatus: 'not_sent'
      };

      if (editingProjectIndex !== null) {
          // Update existing
          const updated = [...tempProjects];
          updated[editingProjectIndex] = { ...updated[editingProjectIndex], ...newProj };
          setTempProjects(updated);
      } else {
          // Add new
          setTempProjects([...tempProjects, newProj]);
      }

      // Reset
      setIsProjectFormOpen(false);
      setEditingProjectIndex(null);
      setNewProjectForm({
          name: '',
          type: projectTypes[0]?.name || 'Entreprise / Société',
          sector: availableDomains[0]?.name || 'General',
          platforms: []
      });
  };

  const handleCancelProjectForm = () => {
      setIsProjectFormOpen(false);
      setEditingProjectIndex(null);
      setNewProjectForm({
          name: '',
          type: projectTypes[0]?.name || 'Entreprise / Société',
          sector: availableDomains[0]?.name || 'General',
          platforms: []
      });
  };

  const handleRemoveTempProject = (idx: number) => {
      const updated = [...tempProjects];
      updated.splice(idx, 1);
      setTempProjects(updated);
      // If we were editing the deleted item, cancel edit
      if (editingProjectIndex === idx) {
          handleCancelProjectForm();
      }
  };

  const togglePlatform = (p: Platform) => {
      if (newProjectForm.platforms.includes(p)) {
          setNewProjectForm({ ...newProjectForm, platforms: newProjectForm.platforms.filter(pl => pl !== p) });
      } else {
          setNewProjectForm({ ...newProjectForm, platforms: [...newProjectForm.platforms, p] });
      }
  };

  const handleSaveClient = async () => {
      if (!editingClient.companyName) return;
      setIsSaving(true);

      try {
        const clientId = editingClient.id || `client_${Date.now()}`;
        
        // Use tempProjects directly. If form is open but not saved, we ignore it to prevent accidental saves.
        // User must click "Save/Update" inside the overlay first.
        let finalTempProjects = [...tempProjects];

        const finalProjects: Project[] = finalTempProjects.map(p => ({
            ...p,
            id: p.id?.startsWith('temp_') ? `proj_${clientId}_${Math.random().toString(36).substr(2, 5)}` : p.id!,
            clientId: clientId,
            clientName: editingClient.companyName,
            nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        } as Project));

        let status = editingClient.questionnaireStatus || 'not_sent';
        if (!editingClient.id && finalProjects.length > 0) {
            status = 'not_sent'; 
        }

        const clientToSave: Client = {
            id: clientId,
            firstName: editingClient.firstName || '',
            lastName: editingClient.lastName || '',
            companyName: editingClient.companyName || '',
            email: editingClient.email || '',
            phone: editingClient.phone || '',
            language: editingClient.language || '',
            activities: editingClient.activities || finalProjects[0]?.activitySector || '',
            country: editingClient.country || '', // Saving ISO Code or Name
            city: editingClient.city || '',
            questionnaireStatus: status as any,
            createdAt: editingClient.createdAt || new Date().toISOString(),
            autopilotExcluded: editingClient.autopilotExcluded || false,
            projects: finalProjects
        };

        if (user && user.uid !== 'demo-user-123') {
            if (editingClient.id) {
                await dbService.updateClient(user.uid, editingClient.id, clientToSave);
            } else {
                await dbService.createClient(user.uid, clientToSave);
            }
        } else {
            saveLocalClient(clientToSave);
            if (finalProjects.length > 0) {
                finalProjects.forEach(p => saveProject(p));
            }
        }

        fetchClients();
        setIsModalOpen(false);
        success(editingClient.id ? "Client updated successfully." : "New client created.");
      } catch (error) {
          console.error("Error saving client", error);
          showError("Error saving client details.");
      } finally {
          setIsSaving(false);
      }
  };

  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Ready</span>;
          case 'sent': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Pending Brief</span>;
          case 'not_sent': default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">New</span>;
      }
  };

  const filteredClients = clients.filter(c => {
      const matchesSearch = c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = filterDomain === 'all' || c.activities === filterDomain || c.projects?.some(p => p.activitySector === filterDomain);
      const matchesStatus = filterStatus === 'all' || c.questionnaireStatus === filterStatus;
      return matchesSearch && matchesDomain && matchesStatus;
  });

  const uniqueDomains = Array.from(new Set(clients.map(c => c.activities || c.projects?.[0]?.activitySector || 'General').filter((d): d is string => !!d)));

  const renderActionMenu = (client: Client, openUpwards: boolean) => (
      <div 
          className={`absolute right-0 ${openUpwards ? 'bottom-full mb-1' : 'top-full mt-1'} w-48 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#383838] rounded-md shadow-lg z-50 overflow-hidden animate-fade-in`}
          onClick={(e) => e.stopPropagation()}
      >
          <button onClick={() => onNavigate('client-details', client.id)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
              <Eye size={14} /> View Dashboard
          </button>
          <button onClick={() => { handleOpenModal(client); setActionMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]">
              <Edit2 size={14} /> Edit Details
          </button>
          <button 
            onClick={(e) => handleToggleAutopilot(client, e)}
            className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-gray-700 dark:text-[#ededed]"
          >
              <Sparkles size={14} className={!client.autopilotExcluded ? "text-emerald-500" : "text-gray-400"} /> 
              {!client.autopilotExcluded ? 'Disable Autopilot' : 'Enable Autopilot'}
          </button>
          {(client.projects && client.projects.length > 0) && (
              <button 
                  onClick={(e) => handleSendBulkBriefs(client, e)} 
                  disabled={isGeneratingLinks}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
              >
                  {isGeneratingLinks ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} 
                  {isGeneratingLinks ? 'Generating...' : 'Envoyer les brief'}
              </button>
          )}
          <div className="border-t border-gray-100 dark:border-[#333] my-1"></div>
          <button onClick={(e) => handleDeleteClick(client.id, e)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
              <Trash2 size={14} /> Supprimer
          </button>
      </div>
  );

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 relative">
      <style>{`
        /* Essential react-phone-number-input styles - Custom Overrides */
        .PhoneInput {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        .PhoneInputInput {
            flex: 1;
            min-width: 0;
            background-color: transparent !important;
            border: none !important;
            outline: none !important;
            color: inherit;
            height: 100%;
            padding: 0;
        }
        .PhoneInputInput:focus {
            box-shadow: none !important;
            outline: none !important;
        }
        .PhoneInputCountry {
            position: relative;
            align-self: stretch;
            display: flex;
            align-items: center;
            margin-right: 0.5em;
        }
        .PhoneInputCountryIcon {
            width: calc(1em * 1.5);
            height: 1em;
        }
        .PhoneInputCountryIcon--border {
            background-color: rgba(0,0,0,0.1);
            box-shadow: 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.5);
        }
        .PhoneInputCountryIconImg {
            display: block;
            width: 100%;
            height: 100%;
        }
        .PhoneInputCountrySelect {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
            border: 0;
            opacity: 0;
            cursor: pointer;
        }
        .PhoneInputCountrySelectArrow {
            display: block;
            content: '';
            width: 0.3em;
            height: 0.3em;
            margin-left: 0.3em;
            border-right: 1px solid currentColor;
            border-bottom: 1px solid currentColor;
            transform: rotate(45deg);
            opacity: 0.45;
            margin-top: -0.15em;
        }
        
        .dark .PhoneInputInput {
            color: #ededed;
        }
      `}</style>

      <ConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client?"
        message="This will permanently delete the client and all associated projects. This action cannot be undone."
        confirmLabel="Delete Client"
        isDestructive={true}
      />
      
      <div className="border-b border-gray-200 dark:border-[#282828] pb-6 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight">Clients</h2>
            <p className="text-gray-500 dark:text-[#8b9092] mt-2">Manage your client portfolio and strategies.</p>
        </div>
        {user && user.uid !== 'demo-user-123' ? (
            <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Live Mode
            </span>
        ) : (
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                Demo Mode
            </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative group w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-[#ccc]" size={14} />
                  <input 
                      className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#383838] rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-[#ededed] w-full transition-all" 
                      placeholder="Search clients..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="hidden md:flex items-center gap-2">
                  <FilterPill label="Domain" value={filterDomain} options={[{label: 'All Domains', value: 'all'}, ...uniqueDomains.map((d: string) => ({label: d, value: d}))]} onSelect={setFilterDomain} active={filterDomain !== 'all'} />
                  <FilterPill label="Status" value={filterStatus} options={[{label: 'All Status', value: 'all'}, {label: 'New', value: 'not_sent'}, {label: 'Pending Brief', value: 'sent'}, {label: 'Ready', value: 'completed'}]} onSelect={setFilterStatus} active={filterStatus !== 'all'} />
              </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-gray-100 dark:bg-[#1c1c1c] rounded-md p-0.5 border border-gray-200 dark:border-[#383838]">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><Grid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-[#ccc]'}`}><List size={14} /></button>
              </div>
              <button onClick={() => handleOpenModal()} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"><Plus size={16} /> New Client</button>
          </div>
      </div>

      {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>
      ) : (
          <>
            {viewMode === 'list' ? (
                <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm overflow-visible">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828]">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Client Name</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Company</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">ACTIVITY SECTORS</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Projects</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-[#8b9092] uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                            {filteredClients.map((client, index) => {
                                const isLastItems = index >= filteredClients.length - 2 && filteredClients.length > 3;
                                return (
                                <tr key={client.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors group cursor-pointer"
                                    onClick={() => onNavigate('client-details', client.id)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-[#ededed]">{client.firstName} {client.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">{client.companyName}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {client.projects && client.projects.length > 0 ? (
                                                client.projects.slice(0, 2).map(p => (
                                                    <span key={p.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-[#ccc] border border-gray-200 dark:border-[#444]">{p.activitySector || 'General'}</span>
                                                ))
                                            ) : <span className="text-gray-400 text-xs italic">No projects</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-[#ccc]">{client.projects?.length || 0} Assets</td>
                                    <td className="px-6 py-4">{getStatusBadge(client.questionnaireStatus)}</td>
                                    <td className="px-6 py-4 text-right relative">
                                        <div className="relative inline-block text-left">
                                            <button onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === client.id ? null : client.id); }} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><MoreHorizontal size={18} /></button>
                                            {actionMenuOpen === client.id && renderActionMenu(client, isLastItems)}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                        <div key={client.id} 
                             className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 relative group flex flex-col cursor-pointer"
                             onClick={() => onNavigate('client-details', client.id)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm border border-emerald-200 dark:border-emerald-800">
                                        {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-[#ededed]">{client.firstName} {client.lastName}</h3>
                                        <p className="text-xs text-gray-500 dark:text-[#888]">{client.companyName}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === client.id ? null : client.id); }} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"><MoreHorizontal size={18} /></button>
                                    {actionMenuOpen === client.id && renderActionMenu(client, false)}
                                </div>
                            </div>
                            <div className="mb-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#888]"><Mail size={12} /> {client.email}</div>
                                {client.phone && <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#888]"><Phone size={12} /> {client.phone}</div>}
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#333] flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {client.projects && client.projects.length > 0 ? (client.projects.slice(0, 2).map(p => <span key={p.id} className="text-[10px] bg-gray-50 dark:bg-[#2a2a2a] text-gray-600 dark:text-[#ccc] px-2 py-1 rounded border border-gray-100 dark:border-[#333]">{p.activitySector || 'General'}</span>)) : <span className="text-[10px] text-gray-400">No projects</span>}
                                </div>
                                <div className="flex items-center gap-2">{getStatusBadge(client.questionnaireStatus)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </>
      )}

      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up border border-gray-200 dark:border-[#282828] flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-gray-200 dark:border-[#282828] bg-gray-50 dark:bg-[#1c1c1c]">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-gray-900 dark:text-[#ededed] text-lg">{editingClient.id ? 'Edit Client' : 'New Client Wizard'}</h3>
                          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed]"><X size={20}/></button>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 1 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-200 dark:bg-[#333]'}`}>1</div>
                              <span className="text-sm font-medium">Contact Information</span>
                          </div>
                          <div className="w-12 h-px bg-gray-300 dark:bg-[#444]"></div>
                          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 2 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-200 dark:bg-[#333]'}`}>2</div>
                              <span className="text-sm font-medium">Initial Project</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col overflow-hidden relative">
                      {currentStep === 1 && (
                          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                              <div className="space-y-5 animate-fade-in">
                                  <div className="grid grid-cols-2 gap-5">
                                      <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">First Name</label><input type="text" value={editingClient.firstName} onChange={(e) => setEditingClient({...editingClient, firstName: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" placeholder="John" /></div>
                                      <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Last Name</label><input type="text" value={editingClient.lastName} onChange={(e) => setEditingClient({...editingClient, lastName: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" placeholder="Doe" /></div>
                                  </div>
                                  <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Company Name</label><input type="text" value={editingClient.companyName} onChange={(e) => setEditingClient({...editingClient, companyName: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" placeholder="Acme Corp" /></div>
                                  <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Email Address</label><input type="email" value={editingClient.email} onChange={(e) => setEditingClient({...editingClient, email: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" placeholder="john@acme.com" /></div>
                                  <div className="grid grid-cols-2 gap-5">
                                      <div>
                                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Country</label>
                                          <SearchableSelect 
                                              options={countryOptions}
                                              value={editingClient.country || ''}
                                              onChange={(val) => setEditingClient({...editingClient, country: val})}
                                              placeholder="Select Country"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">City</label>
                                          <SearchableSelect 
                                              options={cityOptions}
                                              value={editingClient.city || ''}
                                              onChange={(val) => setEditingClient({...editingClient, city: val})}
                                              placeholder="Select City"
                                              disabled={!editingClient.country}
                                          />
                                      </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Language</label>
                                    <SearchableSelect 
                                        options={languageOptions}
                                        value={editingClient.language || ''}
                                        onChange={(val) => setEditingClient({...editingClient, language: val})}
                                        placeholder="Select Language"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1.5">Phone Number</label>
                                    <div className="w-full h-[42px] flex items-center border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-lg px-3 text-sm focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-gray-400 dark:text-[#ededed] transition-all">
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            value={editingClient.phone}
                                            defaultCountry={phoneCountry}
                                            onCountryChange={(country: any) => {
                                                if (country && country !== phoneCountry) {
                                                    setHasManualPhoneCountry(true);
                                                }
                                            }}
                                            onChange={(val: any) => setEditingClient({...editingClient, phone: val})}
                                            international
                                            className="bg-transparent"
                                        />
                                    </div>
                                  </div>
                              </div>
                          </div>
                      )}
                      {currentStep === 2 && (
                          <div className="flex-1 flex flex-col relative min-h-[400px]">
                              {/* Overlay for Form Focus */}
                              {isProjectFormOpen && (
                                <div className="absolute inset-0 z-20 bg-white dark:bg-[#1c1c1c] animate-slide-up flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                        <div className="mb-6 pb-2 border-b border-gray-200 dark:border-[#333]">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-[#ededed]">{editingProjectIndex !== null ? 'Edit Project' : 'New Project'}</h4>
                                            <p className="text-xs text-gray-500">Configure the project details.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Project Name</label><input type="text" value={newProjectForm.name} onChange={(e) => setNewProjectForm({...newProjectForm, name: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]" placeholder="e.g. Website Launch, Rebranding" /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Project Type</label><select value={newProjectForm.type} onChange={(e) => setNewProjectForm({...newProjectForm, type: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]">{projectTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}</select></div>
                                                <div><label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-1">Activity Sector</label><select value={newProjectForm.sector} onChange={(e) => setNewProjectForm({...newProjectForm, sector: e.target.value})} className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1c1c1c] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 dark:text-[#ededed]">{availableDomains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                                            </div>
                                            <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-[#8b9092] mb-2">Active Platforms</label>
                                            <div className="flex flex-wrap gap-2">
                                                {availablePlatforms.map(p => {
                                                    const isSelected = newProjectForm.platforms.includes(p);
                                                    return (
                                                        <button 
                                                            key={p} 
                                                            type="button"
                                                            onClick={() => {
                                                                if (newProjectForm.platforms.includes(p)) {
                                                                    setNewProjectForm({ ...newProjectForm, platforms: newProjectForm.platforms.filter(pl => pl !== p) });
                                                                } else {
                                                                    setNewProjectForm({ ...newProjectForm, platforms: [...newProjectForm.platforms, p] });
                                                                }
                                                            }} 
                                                            className={`p-2 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-400' : 'bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-[#383838] text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}
                                                            title={p}
                                                        >
                                                            <PlatformIcon 
                                                                platform={p} 
                                                                size={20} 
                                                                grayscale={!isSelected}
                                                            />
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Overlay Footer */}
                                    <div className="pt-4 mt-auto border-t border-gray-100 dark:border-[#2e2e2e] flex justify-end gap-3 bg-white dark:bg-[#1c1c1c] p-6">
                                        <button 
                                            onClick={handleCancelProjectForm} 
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-[#ccc] dark:hover:text-white border border-gray-300 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSaveTempProject} 
                                            disabled={!newProjectForm.name}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save size={16} /> {editingProjectIndex !== null ? 'Update Project' : 'Add to List'}
                                        </button>
                                    </div>
                                </div>
                              )}

                              {/* List View */}
                              {!isProjectFormOpen && (
                                  <>
                                    <div className="flex-1 overflow-y-auto p-8 pb-24 custom-scrollbar">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-[#ededed] flex items-center gap-2"><FolderOpen size={16} className="text-emerald-500"/> Initial Project Setup</h4>
                                            {tempProjects.length > 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">{tempProjects.length} Added</span>}
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {tempProjects.length > 0 ? tempProjects.map((p, idx) => (
                                                <div key={idx} className={`flex items-center justify-between p-3 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] rounded-lg shadow-sm transition-all hover:border-emerald-200 dark:hover:border-emerald-800`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md"><Briefcase size={16} /></div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900 dark:text-[#ededed]">{p.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-[#888] flex items-center gap-2">
                                                                <span>{p.type}</span> • <span>{p.activitySector}</span>
                                                            </div>
                                                            {p.platforms && p.platforms.length > 0 && (
                                                                <div className="flex gap-1 mt-1.5">
                                                                    {p.platforms.map(pl => (
                                                                        <span key={pl} className="bg-gray-100 dark:bg-[#333] p-1 rounded-md" title={pl}>
                                                                            <PlatformIcon platform={pl} size={12} grayscale={false} />
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleEditTempProject(idx)} className="text-gray-400 hover:text-blue-500 transition-colors p-1" title="Edit">
                                                            <PenLine size={16} />
                                                        </button>
                                                        <button onClick={() => handleRemoveTempProject(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-10 text-gray-400 italic bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-dashed border-gray-200 dark:border-[#333]">
                                                    No projects added yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sticky Add Button - Flush with footer */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-md border-t border-gray-200 dark:border-[#2e2e2e] p-4 z-10">
                                        <button 
                                            onClick={handleOpenProjectForm}
                                            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-lg text-sm transition-all flex items-center justify-center gap-2 text-gray-500 hover:text-emerald-600 dark:text-[#888] dark:hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 group font-medium"
                                        >
                                            <div className="bg-gray-100 dark:bg-[#2a2a2a] rounded-full p-1 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                                <Plus size={16} />
                                            </div>
                                            Add New Project
                                        </button>
                                    </div>
                                  </>
                              )}
                          </div>
                      )}
                  </div>
                  <div className="p-6 border-t border-gray-100 dark:border-[#282828] bg-gray-50 dark:bg-[#1c1c1c] flex justify-between items-center shrink-0">
                      {currentStep === 1 ? (
                          <>
                            <div className="text-xs text-gray-400">Step 1 of 2</div>
                            <button onClick={() => setCurrentStep(2)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-2">Next Step <ChevronRight size={16} /></button>
                          </>
                      ) : (
                          <>
                            <button onClick={() => setCurrentStep(1)} className="px-4 py-2 border border-gray-300 dark:border-[#383838] rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed] font-medium">Back</button>
                            <button 
                                onClick={handleSaveClient} 
                                disabled={isSaving || isProjectFormOpen} 
                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={isProjectFormOpen ? "Finish editing project first" : ""}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? 'Saving...' : 'Save Client & Project'}
                            </button>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Clients;
