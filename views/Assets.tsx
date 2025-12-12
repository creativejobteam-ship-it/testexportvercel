
import React, { useState, useRef } from 'react';
import { editImageWithGemini, analyzeImageWithGemini, generateMemeCaptions } from '../services/geminiService';
import { Upload, Sparkles, Image as ImageIcon, Wand2, Download, RefreshCw, X, Copy, Check, Eye, Palette, Sticker, Search } from 'lucide-react';

const Assets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'analyzer' | 'meme'>('editor');
  
  // Shared Image State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Editor State
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);

  // Analyzer State
  const [analysisResult, setAnalysisResult] = useState<string>('');

  // Meme State
  const [memeCaptions, setMemeCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        // Reset sub-states
        setEditedImage(null);
        setAnalysisResult('');
        setMemeCaptions([]);
        setSelectedCaption(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt) return;
    setIsProcessing(true);
    const result = await editImageWithGemini(selectedImage, editPrompt);
    setEditedImage(result);
    setIsProcessing(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    const result = await analyzeImageWithGemini(selectedImage);
    setAnalysisResult(result);
    setIsProcessing(false);
  };

  const handleGenerateCaptions = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    const captions = await generateMemeCaptions(selectedImage);
    setMemeCaptions(captions);
    setIsProcessing(false);
  };

  const renderTabButton = (id: 'editor' | 'analyzer' | 'meme', label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
        activeTab === id 
          ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' 
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-[#888] dark:hover:text-[#ccc]'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-gray-200 dark:border-[#282828] pb-0">
            <div>
                <h2 className="text-3xl font-normal text-gray-900 dark:text-[#ededed] tracking-tight mb-2">Creative Studio</h2>
                <div className="flex gap-2">
                    {renderTabButton('editor', 'Magic Editor', <Palette size={18} />)}
                    {renderTabButton('analyzer', 'Visual Analyzer', <Eye size={18} />)}
                    {renderTabButton('meme', 'Meme Generator', <Sticker size={18} />)}
                </div>
            </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
            {/* Left: Input / Preview */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 flex-1 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
                    {selectedImage ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#151515] rounded-lg border border-gray-100 dark:border-[#333] overflow-hidden">
                            <img src={selectedImage} alt="Source" className="max-w-full max-h-full object-contain" />
                            {activeTab === 'meme' && selectedCaption && (
                                <div className="absolute inset-0 flex flex-col justify-end pb-8 items-center pointer-events-none p-4">
                                    <h2 className="text-white text-center font-black text-2xl md:text-3xl uppercase tracking-wide stroke-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                                        {selectedCaption}
                                    </h2>
                                </div>
                            )}
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all gap-4"
                        >
                            <div className="w-16 h-16 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center text-gray-400">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-gray-900 dark:text-[#ededed]">Click to upload an image</p>
                                <p className="text-sm text-gray-500 dark:text-[#888]">JPG, PNG supported</p>
                            </div>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>

            {/* Right: Controls & Output */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                
                {/* EDITOR CONTROLS */}
                {activeTab === 'editor' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                                <Wand2 size={18} className="text-purple-500" /> Magic Edit
                            </h3>
                            <textarea 
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder='Describe your edit: "Add a retro filter", "Remove the background person", "Make it snowy"...'
                                className="w-full h-24 p-3 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-lg text-sm text-gray-900 dark:text-[#ededed] resize-none outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            <button 
                                onClick={handleEdit}
                                disabled={!selectedImage || !editPrompt || isProcessing}
                                className="w-full mt-4 bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                Generate Edit
                            </button>
                        </div>

                        {editedImage && (
                            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4">Result</h3>
                                <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-[#333] bg-gray-50 dark:bg-[#151515]">
                                    <img src={editedImage} alt="Edited" className="w-full h-auto" />
                                </div>
                                <a 
                                    href={editedImage} 
                                    download="edited_image.png"
                                    className="mt-4 flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-[#333] py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed] text-sm font-medium transition-colors"
                                >
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* ANALYZER CONTROLS */}
                {activeTab === 'analyzer' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                                <Eye size={18} className="text-blue-500" /> Deep Analysis
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-[#888] mb-4">
                                Use Gemini Pro Vision to understand image context, sentiment, and objects.
                            </p>
                            <button 
                                onClick={handleAnalyze}
                                disabled={!selectedImage || isProcessing}
                                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                                Analyze Image
                            </button>
                        </div>

                        {analysisResult && (
                            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 flex-1 overflow-auto">
                                <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4">Insights</h3>
                                <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-[#ccc] whitespace-pre-wrap leading-relaxed">
                                    {analysisResult}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* MEME CONTROLS */}
                {activeTab === 'meme' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                                <Sticker size={18} className="text-orange-500" /> Meme Studio
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-[#888] mb-4">
                                AI analyzes context and suggests viral captions. Click to overlay.
                            </p>
                            <button 
                                onClick={handleGenerateCaptions}
                                disabled={!selectedImage || isProcessing}
                                className="w-full bg-orange-500 text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                Magic Captions
                            </button>
                        </div>

                        {memeCaptions.length > 0 && (
                            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 flex-1 overflow-auto">
                                <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4">Suggestions</h3>
                                <div className="space-y-2">
                                    {memeCaptions.map((caption, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedCaption(caption)}
                                            className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${
                                                selectedCaption === caption 
                                                ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' 
                                                : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700 dark:bg-[#2a2a2a] dark:text-[#ededed] dark:hover:bg-[#333]'
                                            }`}
                                        >
                                            {caption}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default Assets;
