import React, { useState, useEffect } from 'react';
import { Message, Platform } from '../types';
import { generateReply } from '../services/geminiService';
import { getMessages, updateMessage } from '../services/strategyService';
import { RefreshCw, Send, Sparkles, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle2, MessageCircle, Filter } from 'lucide-react';

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged'>('all');

  const refreshMessages = () => {
      setMessages([...getMessages()]);
  };

  useEffect(() => {
      refreshMessages();
      window.addEventListener('strategy-data-change', refreshMessages);
      return () => window.removeEventListener('strategy-data-change', refreshMessages);
  }, []);

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const handleGenerateReply = async () => {
    if (!selectedMessage) return;
    setIsGenerating(true);
    const reply = await generateReply(selectedMessage);
    setReplyText(reply);
    setIsGenerating(false);
  };

  const handleSendReply = () => {
    if (!selectedMessage) return;
    const updated = { ...selectedMessage, status: 'replied' as const, aiReplyDraft: replyText };
    updateMessage(updated);
    // State updates via listener
    setSelectedMessageId(null);
    setReplyText('');
  };

  const getPlatformIcon = (platform: Platform) => {
    return <span className="text-gray-600 dark:text-[#888] font-medium">{platform}</span>;
  };

  const getSentimentBadge = (sentiment?: string) => {
    if (!sentiment) return null;
    if (sentiment === 'positive') return <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">Positive</span>;
    if (sentiment === 'negative') return <span className="bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 text-xs px-2 py-0.5 rounded-full font-medium">Negative</span>;
    return <span className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#333] dark:text-[#aaa] dark:border-[#444] text-xs px-2 py-0.5 rounded-full font-medium">Neutral</span>;
  };

  const filteredMessages = messages.filter(msg => {
      if (filter === 'all') return true;
      return msg.status === filter;
  });

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 w-full animate-fade-in pb-4">
      {/* Message List */}
      <div className="w-1/2 bg-white dark:bg-[#232323] rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-[#282828] flex flex-col gap-3 bg-white dark:bg-[#232323]">
             <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-[#ededed]">Inbox</h3>
                <button onClick={refreshMessages} className="text-gray-400 hover:text-emerald-600 transition-colors"><RefreshCw size={16} /></button>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-900 border-gray-200 dark:bg-[#333] dark:text-white dark:border-[#444]' : 'bg-white dark:bg-[#232323] text-gray-500 dark:text-[#888] border-transparent hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${filter === 'pending' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-white dark:bg-[#232323] text-gray-500 dark:text-[#888] border-transparent hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                >
                    Pending
                </button>
                 <button 
                    onClick={() => setFilter('flagged')}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${filter === 'flagged' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 'bg-white dark:bg-[#232323] text-gray-500 dark:text-[#888] border-transparent hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
                >
                    Flagged
                </button>
            </div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    <p className="text-sm">No {filter} messages found.</p>
                </div>
            ) : (
                filteredMessages.map((msg) => (
                    <div 
                        key={msg.id}
                        onClick={() => { setSelectedMessageId(msg.id); setReplyText(msg.aiReplyDraft || ''); }}
                        className={`p-4 border-b border-gray-100 dark:border-[#333] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors ${selectedMessageId === msg.id ? 'bg-gray-50 dark:bg-[#2a2a2a]' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-1.5">
                            <div className="flex items-center gap-2">
                                {msg.status === 'replied' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                {msg.status === 'flagged' && <AlertCircle size={14} className="text-red-500" />}
                                {msg.status === 'pending' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                <span className={`text-sm font-medium ${selectedMessageId === msg.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-[#ededed]'}`}>{msg.author}</span>
                                <span className="text-xs text-gray-400">• {msg.timestamp}</span>
                            </div>
                            {getSentimentBadge(msg.sentiment)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-[#aaa] line-clamp-2 mb-2">{msg.content}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {getPlatformIcon(msg.platform)}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Message Detail / Reply */}
      <div className="w-1/2 bg-white dark:bg-[#232323] rounded-lg shadow-sm border border-gray-200 dark:border-[#282828] flex flex-col overflow-hidden">
        {selectedMessage ? (
            <>
                <div className="p-6 border-b border-gray-200 dark:border-[#282828] bg-white dark:bg-[#232323]">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={selectedMessage.avatar} alt={selectedMessage.author} className="w-10 h-10 rounded-full border border-gray-100 dark:border-[#333]" />
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-[#ededed] text-sm">{selectedMessage.author}</h4>
                            <p className="text-xs text-gray-500 dark:text-[#888]">via {selectedMessage.platform}</p>
                        </div>
                    </div>
                    <p className="text-gray-800 dark:text-[#ccc] text-sm leading-relaxed p-4 rounded-md border border-gray-100 dark:border-[#333] bg-gray-50 dark:bg-[#2a2a2a]">
                        {selectedMessage.content}
                    </p>
                    <div className="flex gap-2 mt-4">
                        <button className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#333] text-gray-600 dark:text-[#aaa] transition-colors">
                            <ThumbsUp size={14} /> Like
                        </button>
                        <button className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#333] text-gray-600 dark:text-[#aaa] transition-colors">
                            <ThumbsDown size={14} /> Dislike
                        </button>
                         <button className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#2a2a2a] border border-red-200 dark:border-red-900 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 ml-auto transition-colors">
                            <AlertCircle size={14} /> Flag
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col gap-4 bg-white dark:bg-[#232323]">
                    <div className="flex justify-between items-center">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-[#ededed] flex items-center gap-2">
                            <Sparkles size={14} className="text-emerald-600" /> AI Assistant
                        </h5>
                        <button 
                            onClick={handleGenerateReply}
                            disabled={isGenerating || selectedMessage.status === 'replied'}
                            className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-50 transition-colors font-medium"
                        >
                            {isGenerating ? 'Drafting...' : 'Generate Draft'}
                        </button>
                    </div>
                    
                    <textarea
                        className="w-full flex-1 p-4 rounded-md border border-gray-200 dark:border-[#333] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-gray-700 dark:text-[#ededed] text-sm bg-gray-50 dark:bg-[#2a2a2a]"
                        placeholder="Type a reply..."
                        value={replyText}
                        disabled={selectedMessage.status === 'replied'}
                        onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>

                    <div className="flex justify-end pt-2">
                        {selectedMessage.status === 'replied' ? (
                            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                <CheckCircle2 size={16} /> Replied
                            </span>
                        ) : (
                            <button 
                                onClick={handleSendReply}
                                disabled={!replyText}
                                className="bg-emerald-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <Send size={16} /> Send Reply
                            </button>
                        )}
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-[#666] p-8 text-center bg-gray-50 dark:bg-[#232323]">
                <div className="w-12 h-12 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <MessageCircle size={24} className="text-gray-300 dark:text-[#555]" />
                </div>
                <p className="text-sm">Select a message to view details.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;