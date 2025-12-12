
import React, { useState, useEffect } from 'react';
import { generatePostContent } from '../services/geminiService';
import { Platform } from '../types';
import { Calendar, Image as ImageIcon, Sparkles, Send, X, Hash, Smile, Link, Paperclip, Check, Clock, History } from 'lucide-react';
import { getEnabledPlatforms } from '../services/platformService';
import { getRecentPublisherPosts, addPublisherPost } from '../services/strategyService';

interface RecentPost {
  id: number;
  content: string;
  platforms: Platform[];
  timestamp: string;
  status: 'published' | 'scheduled';
}

interface PublisherProps {
    isEmbedded?: boolean;
}

const Publisher: React.FC<PublisherProps> = ({ isEmbedded = false }) => {
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  const refreshPosts = () => {
      setRecentPosts([...getRecentPublisherPosts()]);
  };

  useEffect(() => {
      refreshPosts();
      window.addEventListener('strategy-data-change', refreshPosts);
      
      // Load enabled platforms
      const enabled = getEnabledPlatforms();
      setAvailablePlatforms(enabled);
      
      // Select first one by default if none selected and available
      if (enabled.length > 0 && selectedPlatforms.length === 0) {
          setSelectedPlatforms([enabled[0]]);
      }

      const handlePlatformChange = () => {
          const newEnabled = getEnabledPlatforms();
          setAvailablePlatforms(newEnabled);
          setSelectedPlatforms(prev => prev.filter(p => newEnabled.includes(p)));
      };
      window.addEventListener('platforms-changed', handlePlatformChange);
      
      return () => {
          window.removeEventListener('strategy-data-change', refreshPosts);
          window.removeEventListener('platforms-changed', handlePlatformChange);
      }
  }, []);

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
        setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
    } else {
        setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    // Use the first selected platform for generation context
    const text = await generatePostContent(topic, selectedPlatforms[0] || Platform.Twitter);
    setContent(text);
    setIsGenerating(false);
  };

  const handlePublish = () => {
      if (!content || selectedPlatforms.length === 0) return;
      
      setIsPublishing(true);
      // Simulate API delay
      setTimeout(() => {
          const newPost: RecentPost = {
              id: Date.now(),
              content,
              platforms: selectedPlatforms,
              timestamp: scheduleDate ? new Date(scheduleDate).toLocaleDateString() : 'Just now',
              status: scheduleDate ? 'scheduled' : 'published'
          };
          
          addPublisherPost(newPost);
          setIsPublishing(false);
          setShowSuccess(true);
          setContent('');
          setTopic('');
          setScheduleDate('');
          
          // Hide success message after 3s
          setTimeout(() => setShowSuccess(false), 3000);
      }, 1500);
  };

  return (
    <div className={`w-full ${isEmbedded ? 'h-full flex flex-col' : 'space-y-6 animate-fade-in pb-12'}`}>
        <div className={`flex items-center justify-between ${isEmbedded ? 'pb-2 mb-4' : 'pb-4 border-b border-gray-200 dark:border-[#282828]'}`}>
            {!isEmbedded ? (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#ededed] tracking-tight">Publisher</h2>
                    <p className="text-gray-500 dark:text-[#8b9092] mt-1">Compose, schedule, and publish to multiple channels.</p>
                </div>
            ) : (
                <h3 className="font-bold text-lg text-gray-900 dark:text-[#ededed]">Content Production</h3>
            )}
             <div className="flex gap-2">
                {showSuccess && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium px-3 animate-fade-in">
                        <Check size={16} /> {scheduleDate ? 'Scheduled successfully!' : 'Published successfully!'}
                    </div>
                )}
                <button className="bg-white dark:bg-[#232323] text-gray-700 dark:text-[#ededed] border border-gray-200 dark:border-[#383838] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm">
                    Save Draft
                </button>
                <button 
                    onClick={handlePublish}
                    disabled={isPublishing || !content}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] justify-center"
                >
                    {isPublishing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                           {scheduleDate ? <Calendar size={16}/> : <Send size={16} />}
                           {scheduleDate ? 'Schedule' : 'Publish'}
                        </>
                    )}
                </button>
            </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isEmbedded ? 'flex-1 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Channel Selector */}
                <div className="bg-white dark:bg-[#232323] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-[#282828]">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-3">Select Channels</label>
                    <div className="flex flex-wrap gap-2">
                        {availablePlatforms.length === 0 && <span className="text-sm text-gray-400 italic">No platforms enabled in Settings > Connections.</span>}
                        {availablePlatforms.map((p) => (
                            <button
                                key={p}
                                onClick={() => togglePlatform(p)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all flex items-center gap-2 ${
                                    selectedPlatforms.includes(p)
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                    : 'bg-white dark:bg-[#2a2a2a] text-gray-600 dark:text-[#ccc] border-gray-200 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#333]'
                                }`}
                            >
                                {p}
                                {selectedPlatforms.includes(p) && <Check size={12} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI & Content Input */}
                <div className="bg-white dark:bg-[#232323] rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] overflow-hidden">
                    <div className="p-4 bg-gray-50 dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-[#282828] flex gap-2 items-center">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What do you want to post about? (for AI generation)"
                            className="flex-1 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#333] rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500 dark:text-[#ededed] transition-colors"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !topic}
                            className="bg-white dark:bg-[#232323] text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Sparkles size={14} />
                            {isGenerating ? 'Working...' : 'Generate'}
                        </button>
                    </div>

                    <div className="p-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post content here..."
                            className="w-full h-48 outline-none text-gray-800 dark:text-[#ccc] text-base resize-none bg-transparent"
                        ></textarea>
                    </div>

                    <div className="p-3 border-t border-gray-100 dark:border-[#282828] flex items-center justify-between bg-gray-50 dark:bg-[#1c1c1c]">
                        <div className="flex gap-1">
                            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors"><ImageIcon size={18} /></button>
                            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors"><Smile size={18} /></button>
                            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors"><Hash size={18} /></button>
                            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors"><Link size={18} /></button>
                            <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors"><Paperclip size={18} /></button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs ${content.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                                {content.length} chars
                            </span>
                            <div className="w-px h-4 bg-gray-300 dark:bg-[#444]"></div>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                />
                                <button className={`flex items-center gap-1.5 text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${scheduleDate ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-[#888]'}`}>
                                    <Calendar size={16} />
                                    {scheduleDate || 'Schedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Placeholder */}
                 <div className="border-2 border-dashed border-gray-300 dark:border-[#333] rounded-lg p-8 text-center bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#232323] transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-white dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-200 dark:border-[#333] shadow-sm">
                        <Paperclip size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#ededed]">Drop files to attach</p>
                    <p className="text-xs text-gray-500 dark:text-[#888] mt-1">or click to browse</p>
                </div>
            </div>

            {/* Preview & History Section */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#232323] rounded-lg border border-gray-200 dark:border-[#282828] shadow-sm p-4">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-4">Live Preview</h3>
                    
                    {selectedPlatforms.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Select a platform to see preview.</p>
                    ) : (
                         <div className="space-y-4">
                            {selectedPlatforms.slice(0, 1).map(p => (
                                <div key={p}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#333]"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-[#ededed]">Your Brand</p>
                                            <p className="text-xs text-gray-500 dark:text-[#888]">@{p.toLowerCase()}_handle</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="text-xs text-gray-400">Now</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-800 dark:text-[#ccc] whitespace-pre-wrap">{content || "Your post content will appear here..."}</p>
                                        <div className="h-32 bg-gray-100 dark:bg-[#1a1a1a] rounded-md border border-gray-100 dark:border-[#333] flex items-center justify-center text-gray-400 text-xs">
                                            Image Preview
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-[#333] text-gray-400">
                                        <div className="h-4 w-4 bg-gray-200 dark:bg-[#333] rounded"></div>
                                        <div className="h-4 w-4 bg-gray-200 dark:bg-[#333] rounded"></div>
                                        <div className="h-4 w-4 bg-gray-200 dark:bg-[#333] rounded"></div>
                                        <div className="h-4 w-4 bg-gray-200 dark:bg-[#333] rounded"></div>
                                    </div>
                                </div>
                            ))}
                            {selectedPlatforms.length > 1 && (
                                <p className="text-xs text-center text-gray-400 border-t border-gray-100 dark:border-[#333] pt-2">+ {selectedPlatforms.length - 1} other platforms selected</p>
                            )}
                         </div>
                    )}
                </div>

                <div className="bg-white dark:bg-[#232323] rounded-lg border border-gray-200 dark:border-[#282828] shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-[#282828] bg-gray-50 dark:bg-[#1c1c1c] flex items-center gap-2">
                        <History size={16} className="text-gray-500" />
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-[#888] uppercase tracking-wider">Recent Activity</h3>
                    </div>
                    {recentPosts.length === 0 ? (
                         <div className="p-6 text-center text-sm text-gray-400">
                             No posts created in this session.
                         </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-[#2e2e2e]">
                            {recentPosts.map(post => (
                                <div key={post.id} className="p-3 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-1.5">
                                            {post.status === 'published' ? (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 rounded-sm font-medium">SENT</span>
                                            ) : (
                                                <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 rounded-sm font-medium">SCHED</span>
                                            )}
                                            <span className="text-xs text-gray-500">{post.timestamp}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {post.platforms.map(p => (
                                                <span key={p} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-[#444]" title={p}></span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-700 dark:text-[#ccc] line-clamp-2">{post.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Publisher;
