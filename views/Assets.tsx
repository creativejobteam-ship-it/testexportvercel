
import React, { useState, useRef, useEffect } from 'react';
import { editImageWithGemini, analyzeImageWithGemini, generateMemeCaptions } from '../services/geminiService';
import { Upload, Sparkles, Image as ImageIcon, Wand2, Download, RefreshCw, X, Copy, Check, Eye, Palette, Sticker, Search, Type } from 'lucide-react';

// Trending Templates (Public Domain / Common usage)
const MEME_TEMPLATES = [
  { id: 'drake', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 'distracted', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 'two-buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { id: 'change-mind', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { id: 'disaster-girl', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg' },
  { id: 'success-kid', name: 'Success Kid', url: 'https://i.imgflip.com/2gnnj.jpg' }
];

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
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when switching images
  const resetState = () => {
    setEditedImage(null);
    setAnalysisResult('');
    setMemeCaptions([]);
    setTopText('');
    setBottomText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        resetState();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = async (url: string) => {
      try {
          const response = await fetch(url);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result as string);
              resetState();
          };
          reader.readAsDataURL(blob);
      } catch (e) {
          console.error("Error loading template", e);
          // Fallback if CORS fails (though imgflip usually works)
          setSelectedImage(url); 
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

  const applyCaption = (caption: string) => {
      // Simple heuristic to split text
      const words = caption.split(' ');
      const midpoint = Math.ceil(words.length / 2);
      const top = words.slice(0, midpoint).join(' ');
      const bottom = words.slice(midpoint).join(' ');
      
      if (words.length <= 5) {
          setTopText('');
          setBottomText(caption);
      } else {
          setTopText(top);
          setBottomText(bottom);
      }
  };

  // Canvas Drawing for Meme Download
  useEffect(() => {
      if (activeTab === 'meme' && selectedImage && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = selectedImage;
          
          img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              
              if (ctx) {
                  // Draw Image
                  ctx.drawImage(img, 0, 0);
                  
                  // Text Style
                  const fontSize = Math.floor(img.height / 10);
                  ctx.font = `900 ${fontSize}px Impact, sans-serif`;
                  ctx.fillStyle = 'white';
                  ctx.strokeStyle = 'black';
                  ctx.lineWidth = Math.max(2, fontSize / 15);
                  ctx.textAlign = 'center';
                  
                  const drawMemeText = (text: string, y: number, baseline: CanvasTextBaseline) => {
                      ctx.textBaseline = baseline;
                      ctx.strokeText(text.toUpperCase(), canvas.width / 2, y);
                      ctx.fillText(text.toUpperCase(), canvas.width / 2, y);
                  };

                  if (topText) drawMemeText(topText, fontSize * 0.2, 'top');
                  if (bottomText) drawMemeText(bottomText, canvas.height - (fontSize * 0.2), 'bottom');
              }
          };
      }
  }, [selectedImage, topText, bottomText, activeTab]);

  const handleDownloadMeme = () => {
      if (canvasRef.current) {
          const link = document.createElement('a');
          link.download = `meme_${Date.now()}.png`;
          link.href = canvasRef.current.toDataURL('image/png');
          link.click();
      }
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
                            {/* Editor/Analyzer View */}
                            {activeTab !== 'meme' && (
                                <img src={selectedImage} alt="Source" className="max-w-full max-h-full object-contain" />
                            )}
                            
                            {/* Meme Canvas View */}
                            {activeTab === 'meme' && (
                                <>
                                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                                    {/* Fallback img if canvas fails or during load */}
                                    <img src={selectedImage} alt="Source" className="hidden" />
                                </>
                            )}

                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                            {/* Upload Area */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full max-w-sm h-48 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all gap-4"
                            >
                                <div className="w-12 h-12 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center text-gray-400">
                                    <Upload size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-900 dark:text-[#ededed]">Upload an image</p>
                                    <p className="text-xs text-gray-500 dark:text-[#888]">JPG, PNG supported</p>
                                </div>
                            </div>

                            {/* Templates Grid (Only for Meme Tab) */}
                            {activeTab === 'meme' && (
                                <div className="w-full max-w-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Or choose a template</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {MEME_TEMPLATES.map(t => (
                                            <div 
                                                key={t.id} 
                                                onClick={() => handleTemplateSelect(t.url)}
                                                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all border border-gray-200 dark:border-[#333]"
                                            >
                                                <img src={t.url} alt={t.name} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                        {/* Text Inputs */}
                        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                                <Type size={18} className="text-gray-500" /> Custom Text
                            </h3>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Top Text" 
                                    value={topText}
                                    onChange={(e) => setTopText(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-[#333] rounded-md px-3 py-2 text-sm bg-gray-50 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#ededed] outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Bottom Text" 
                                    value={bottomText}
                                    onChange={(e) => setBottomText(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-[#333] rounded-md px-3 py-2 text-sm bg-gray-50 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#ededed] outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                            
                            <button 
                                onClick={handleDownloadMeme}
                                disabled={!selectedImage}
                                className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-200 dark:border-[#333] py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-[#ededed] text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <Download size={16} /> Download Meme
                            </button>
                        </div>

                        {/* AI Generation */}
                        <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4 flex items-center gap-2">
                                <Sticker size={18} className="text-orange-500" /> Magic Captions
                            </h3>
                            <button 
                                onClick={handleGenerateCaptions}
                                disabled={!selectedImage || isProcessing}
                                className="w-full bg-orange-500 text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                Generate Ideas
                            </button>
                        </div>

                        {memeCaptions.length > 0 && (
                            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 flex-1 overflow-auto">
                                <h3 className="font-bold text-gray-900 dark:text-[#ededed] mb-4">Suggestions</h3>
                                <div className="space-y-2">
                                    {memeCaptions.map((caption, i) => (
                                        <button
                                            key={i}
                                            onClick={() => applyCaption(caption)}
                                            className="w-full text-left p-3 rounded-lg text-sm border border-transparent hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all text-gray-700 dark:text-[#ededed] bg-gray-50 dark:bg-[#2a2a2a]"
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
