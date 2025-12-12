
import React, { useState, useEffect, useCallback } from 'react';
import { subscribeToBrief, updateBriefAnswers, claimBriefingFocus } from '../../services/briefingService';
import { generateCompositeBriefingSchema } from '../../services/briefingModuleService';
import { BriefingRecord, QuestionDefinition } from '../../types';
import { Loader2, CheckCircle2, Lock, Save, Globe, Info, Upload, File as FileIcon, Trash2, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import useStorage from '../../src/hooks/useStorage';

interface PublicBriefViewProps {
    token?: string;
    projectId?: string;
}

const FileUploader = ({ 
    value, 
    onChange, 
    path, 
    disabled,
    multiple = false
}: { 
    value: string | string[]; 
    onChange: (url: string | string[]) => void; 
    path: string; 
    disabled?: boolean;
    multiple?: boolean;
}) => {
    const { uploadFile, isUploading, progress, error } = useStorage();

    const currentFiles = Array.isArray(value) ? value : (value ? [value] : []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const fullPath = `${path}/${cleanFileName}_${Date.now()}`;
            
            const url = await uploadFile(file, fullPath);
            if (url) {
                if (multiple) {
                    onChange([...currentFiles, url]);
                } else {
                    onChange(url);
                }
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const handleRemove = (urlToRemove: string) => {
        if (disabled) return;
        if (multiple) {
            onChange(currentFiles.filter(u => u !== urlToRemove));
        } else {
            onChange('');
        }
    };

    return (
        <div className="space-y-3">
            {/* File List */}
            {currentFiles.map((url, idx) => {
                 const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('data:image');
                 return (
                    <div key={idx} className="relative group border border-gray-200 rounded-lg p-2 bg-gray-50 flex items-center gap-3 h-14 overflow-hidden">
                        {isImage ? (
                            <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-300">
                                <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 border border-blue-100">
                                <FileIcon size={20} />
                            </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">File {idx + 1}</p>
                            <a href={url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline truncate block">View</a>
                        </div>

                        {!disabled && (
                            <button onClick={() => handleRemove(url)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-white transition-colors">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                 )
            })}

            {/* Upload Area */}
            {(!currentFiles.length || multiple) && (
                <div className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/10 cursor-pointer'}`}>
                    {isUploading ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 size={20} className="text-emerald-600 animate-spin" />
                            <p className="text-xs text-gray-500">Uploading... {Math.round(progress)}%</p>
                        </div>
                    ) : (
                        <>
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" onChange={handleFileSelect} disabled={disabled} />
                            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                                <div className="p-2 bg-gray-100 rounded-full text-gray-500"><Upload size={18} /></div>
                                <p className="text-sm font-medium text-gray-600">
                                    {multiple ? "Add another file" : "Upload File"}
                                </p>
                                <p className="text-xs text-gray-400">Drag & drop or click to browse</p>
                            </div>
                        </>
                    )}
                    {error && <p className="text-[10px] text-red-500 mt-2">{error}</p>}
                </div>
            )}
        </div>
    );
};

const PublicBriefView: React.FC<PublicBriefViewProps> = ({ token, projectId }) => {
    const [brief, setBrief] = useState<BriefingRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Debounce timer ref
    const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Fallback: Try parse URL hash if token prop missing
        let activeToken = token;
        let activeProjectId = projectId;

        if (!activeToken) {
            const hash = window.location.hash;
            if (hash.startsWith('#/brief/')) {
                const parts = hash.split('/');
                if (parts.length >= 4) {
                    activeProjectId = parts[2];
                    activeToken = parts[3];
                }
            }
        }

        if (!activeToken) {
            setLoading(false);
            setErrorMsg("Invalid link configuration.");
            return;
        }

        // Initialize user presence
        claimBriefingFocus(activeToken, 'client');

        // Real-time subscription
        const unsubscribe = subscribeToBrief(activeToken, (data) => {
            setLoading(false);
            if (data) {
                // Security check: if projectId is provided, verify match
                if (activeProjectId && data.projectId !== activeProjectId) {
                    setErrorMsg("Security Mismatch: Invalid Project ID for this token.");
                    setBrief(null);
                    return;
                }

                setBrief(data);
                
                // Generate UI Schema based on config
                if (sections.length === 0) {
                    const schema = generateCompositeBriefingSchema(
                        data.config.domainName, 
                        data.config.platforms, 
                        data.config.context
                    );
                    setSections(schema.sections);
                }
            } else {
                setErrorMsg("Brief not found. It may have been deleted or expired.");
            }
        });

        return () => unsubscribe();
    }, [token, projectId, sections.length]);

    // Handle Input Change with Debounced Auto-Save
    const handleInputChange = useCallback((questionId: string, value: any) => {
        if (!brief || (brief as any).locked) return;

        // Optimistic UI Update
        const newAnswers = { ...brief.answers, [questionId]: value };
        setBrief(prev => prev ? { ...prev, answers: newAnswers } : null);
        setIsSaving(true);

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            if (brief.id) { // Use brief ID (token)
                await updateBriefAnswers(brief.id, newAnswers);
                setIsSaving(false);
                setLastSaved(new Date());
                // Re-assert focus in case it timed out
                claimBriefingFocus(brief.id, 'client');
            }
        }, 1000); // Save after 1 second of inactivity
    }, [brief]);

    // Focus handler to keep session alive
    const handleFocus = () => {
        if(brief) claimBriefingFocus(brief.id, 'client');
    };

    // --- Render Helpers ---
    const renderField = (q: QuestionDefinition) => {
        const value = brief?.answers?.[q.id] || '';
        // Lock if brief is completed/validated OR if Agency is currently editing
        const disabled = (brief as any)?.locked || (brief as any)?.currentFocus === 'agency';
        
        const baseClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm " + 
                          (disabled ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300");

        if (q.type === 'file' || q.type === 'multi-file') {
            return (
                <div onClick={handleFocus}>
                    <FileUploader 
                        value={value}
                        onChange={(url) => handleInputChange(q.id, url)}
                        path={`brief_assets/${brief?.clientId}/${brief?.id}`}
                        disabled={disabled}
                        multiple={q.type === 'multi-file'}
                    />
                </div>
            );
        }

        if (q.type === 'color_palette') {
            const colors = value || {};
            
            const updateColor = (key: string, val: string) => {
                handleInputChange(q.id, { ...colors, [key]: val });
            }

            return (
                <div className="flex gap-4 items-center" onClick={handleFocus}>
                    {['Primary', 'Secondary', 'Accent'].map((label) => {
                        const key = label.toLowerCase();
                        const colorVal = colors[key] || '#ffffff';
                        return (
                            <div key={key} className="flex flex-col items-center gap-1">
                                <div className="relative w-10 h-10 rounded-full border border-gray-300 overflow-hidden shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-transform">
                                    <input
                                        type="color"
                                        disabled={disabled}
                                        value={colorVal}
                                        onChange={(e) => updateColor(key, e.target.value)}
                                        className="absolute -top-4 -left-4 w-20 h-20 p-0 border-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium uppercase">{label}</span>
                            </div>
                        )
                    })}
                </div>
            )
        }

        if (q.type === 'color') {
            return (
                <div className="flex gap-2 items-center" onClick={handleFocus}>
                    <div className="relative w-8 h-8 rounded-lg border border-gray-300 overflow-hidden shadow-sm shrink-0 cursor-pointer">
                        <input
                            type="color"
                            disabled={disabled}
                            value={value || '#ffffff'}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        disabled={disabled}
                        value={value}
                        placeholder="#RRGGBB"
                        className={`${baseClass} font-mono uppercase w-24`}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        maxLength={7}
                    />
                </div>
            );
        }

        if (q.type === 'radio') {
            return (
                <div className="flex flex-col gap-2" onClick={handleFocus}>
                    {q.options?.map(opt => {
                        const isSelected = value === opt;
                        return (
                            <div 
                                key={opt}
                                onClick={() => !disabled && handleInputChange(q.id, opt)}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                    isSelected 
                                    ? 'border-emerald-500 bg-emerald-50/50' 
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected 
                                    ? 'border-emerald-500 bg-emerald-500' 
                                    : 'border-gray-300'
                                }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <span className="text-sm text-gray-700">{opt}</span>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (q.type === 'segmented') {
            return (
                <div className="flex bg-gray-100 p-1 rounded-lg" onClick={handleFocus}>
                    {q.options?.map(opt => {
                        const isSelected = value === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => !disabled && handleInputChange(q.id, opt)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-all ${
                                    isSelected 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            );
        }

        if (q.type === 'textarea') {
            return (
                <textarea
                    disabled={disabled}
                    value={value}
                    placeholder={q.placeholder}
                    className={`${baseClass} h-24 resize-none`}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    onFocus={handleFocus}
                />
            );
        }

        if (q.type === 'select') {
            return (
                <select
                    disabled={disabled}
                    value={value}
                    className={baseClass}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    onFocus={handleFocus}
                >
                    <option value="">Select an option...</option>
                    {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }

        if (q.type === 'multi-select') {
            return (
                <div className="flex flex-wrap gap-2" onClick={handleFocus}>
                    {q.options?.map(opt => {
                        const isSelected = (brief?.answers?.[q.id] as string[] || []).includes(opt);
                        return (
                            <button
                                key={opt}
                                disabled={disabled}
                                onClick={() => {
                                    if(disabled) return;
                                    const current = (brief?.answers?.[q.id] as string[]) || [];
                                    const newValue = isSelected 
                                        ? current.filter(v => v !== opt)
                                        : [...current, opt];
                                    handleInputChange(q.id, newValue);
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                                    isSelected 
                                    ? 'bg-emerald-600 text-white border-emerald-600' 
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {opt}
                            </button>
                        )
                    })}
                </div>
            );
        }

        return (
            <input
                type={q.type}
                disabled={disabled}
                value={value}
                placeholder={q.placeholder}
                className={baseClass}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                onFocus={handleFocus}
            />
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 size={40} className="text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (errorMsg || !brief) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full">
                    <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h1>
                    <p className="text-gray-500">{errorMsg || "Brief not found."}</p>
                </div>
            </div>
        );
    }

    const isLocked = (brief as any).locked;
    const isAgencyEditing = (brief as any).currentFocus === 'agency';

    return (
        <div className="min-h-screen bg-[#F9FAFB] relative">
            
            {/* AGENCY LOCK OVERLAY */}
            {isAgencyEditing && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl border border-blue-100 p-8 max-w-md text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <ShieldAlert size={32} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Live Agency Edit</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Your agency is currently updating this brief. Please wait a moment until they release control to continue filling it out.
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full">
                            <Loader2 size={12} className="animate-spin" /> Waiting for release...
                        </div>
                    </div>
                </div>
            )}

            {/* Minimal Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            A
                        </div>
                        <span className="font-bold text-gray-900 tracking-tight text-sm">Auto-CM Briefing</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isSaving ? (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <Loader2 size={10} className="animate-spin" /> Saving...
                            </span>
                        ) : lastSaved ? (
                            <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                <CheckCircle2 size={12} /> Saved
                            </span>
                        ) : null}
                    </div>
                </div>
            </header>

            {/* Banner for Locked State */}
            {isLocked && (
                <div className="bg-emerald-600 text-white text-center py-2 text-xs font-medium sticky top-14 z-10 flex items-center justify-center gap-2">
                    <Lock size={12} /> This brief has been validated and locked by the agency.
                </div>
            )}

            <main className="max-w-3xl mx-auto px-4 py-8">
                
                {/* Intro Card */}
                <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-3">
                        <Globe size={10} /> {brief.config.domainName} Strategy
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Project Kickoff: {brief.projectName.replace('Bf/', '')}
                    </h1>
                    <p className="text-gray-600 text-sm max-w-lg mx-auto leading-relaxed">
                        Welcome! Please fill out the details below to help us construct your {brief.config.context.toLowerCase().replace('_', ' ')} strategy.
                    </p>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-base font-bold text-gray-900">{section.title}</h2>
                                {section.description && <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>}
                            </div>
                            <div className="p-5 space-y-5">
                                {section.questions.map((q: QuestionDefinition) => (
                                    <div key={q.id} className="group">
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                                            {q.label}
                                            {q.required && <span className="text-red-500" title="Required">*</span>}
                                            {q.helperText && (
                                                <Info size={12} className="text-gray-400 cursor-help" title={q.helperText} />
                                            )}
                                        </label>
                                        {renderField(q)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center border-t border-gray-200 pt-6">
                    {!isLocked && (
                        <button 
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <Save size={16} /> Review & Finish
                        </button>
                    )}
                    <p className="text-gray-400 text-xs mt-4">
                        Powered by Auto-CM Collaborative Intelligence
                    </p>
                </div>

            </main>
        </div>
    );
};

export default PublicBriefView;
