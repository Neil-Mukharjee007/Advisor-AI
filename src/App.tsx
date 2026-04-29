/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  RefreshCw,
  Info,
  TrendingUp,
  Handshake
} from 'lucide-react';
import { generateSmartReply, ObjectionResponse } from './services/geminiService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function App() {
  const [objection, setObjection] = useState('');
  const [response, setResponse] = useState<ObjectionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!objection.trim()) return;
    setLoading(true);
    try {
      const result = await generateSmartReply(objection);
      setResponse(result);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fullResponseText = response 
    ? `${response.acknowledge}\n\n${response.reassure}\n\n${response.explain}\n\n${response.softClose}`
    : '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AdvisorAI</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck size={16} /> Trust Building</span>
            <span className="flex items-center gap-1"><TrendingUp size={16} /> Long-term Focus</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Intro */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Handle Client Objections <span className="text-blue-600">Smartly</span>.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
            Expertly handle market volatility, SIP fears, and trust issues with non-salesy, 
            Hinglish responses designed for Indian retail investors.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <label htmlFor="objection-input" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Client Ki Objection (English/Hinglish)
          </label>
          <textarea
            id="objection-input"
            className="w-full min-h-[120px] p-4 text-lg border-none focus:ring-0 resize-none bg-slate-50 rounded-xl placeholder:text-slate-400 text-slate-800 transition-colors"
            placeholder='e.g. "Abhi invest karne ka right time nahi hai" or "Mutual funds are too risky..."'
            value={objection}
            onChange={(e) => setObjection(e.target.value)}
          />
          <div className="mt-4 flex items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-xs text-slate-400">
               <Info size={14} />
               <span>Type in English or Hinglish script</span>
             </div>
             <button
                onClick={handleGenerate}
                disabled={loading || !objection.trim()}
                id="generate-btn"
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? 'Thinking...' : 'Generate Smart Reply'}
              </button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {response && (
            <motion.div
              key="response"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Main Response Sections */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'Acknowledge', icon: <MessageSquare size={18} className="text-amber-500" />, content: response.acknowledge, color: 'bg-amber-50 border-amber-100' },
                  { title: 'Reassure', icon: <ShieldCheck size={18} className="text-emerald-500" />, content: response.reassure, color: 'bg-emerald-50 border-emerald-100' },
                  { title: 'Explain', icon: <TrendingUp size={18} className="text-blue-500" />, content: response.explain, color: 'bg-blue-50 border-blue-100' },
                  { title: 'Soft Close', icon: <Handshake size={18} className="text-purple-500" />, content: response.softClose, color: 'bg-purple-50 border-purple-100' },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.title} 
                    variants={itemVariants} 
                    className={`${item.color} border rounded-xl p-5 relative group`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                       {item.icon}
                       <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">{item.title}</h3>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-base">
                      {item.content}
                    </p>
                    <button 
                      onClick={() => copyToClipboard(item.content, item.title)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600 p-1 bg-white/50 rounded-md shadow-sm"
                      title="Copy this section"
                    >
                      {copiedSection === item.title ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons for all */}
              <div className="flex justify-end">
                <button 
                   onClick={() => copyToClipboard(fullResponseText, 'full')}
                   className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100"
                >
                   {copiedSection === 'full' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                   Copy Full Context
                </button>
              </div>

              {/* WhatsApp Version Card */}
              <motion.div variants={itemVariants} className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Zap size={100} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Quick WhatsApp Version</h3>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(response.whatsappVersion, 'whatsapp')}
                      className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-500/20 transition-all font-medium"
                    >
                      {copiedSection === 'whatsapp' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      {copiedSection === 'whatsapp' ? 'Copied!' : 'Copy to Chat'}
                    </button>
                  </div>
                  <p className="text-slate-100 text-lg leading-relaxed italic">
                    "{response.whatsappVersion}"
                  </p>
                </div>
              </motion.div>

              <div className="text-center pt-8">
                <button 
                  onClick={() => {
                    setResponse(null);
                    setObjection('');
                  }}
                  className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <RefreshCw size={14} /> Clear and start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !response && (
          <div className="py-20 text-center">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Drafting the perfect response...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 mt-12 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <p className="text-sm text-slate-400 mb-2">Designed for Indian Financial Advisors</p>
           <div className="flex justify-center gap-6">
              {['Smart', 'Ethical', 'Non-salesy', 'Psychology-led'].map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-slate-300">{tag}</span>
              ))}
           </div>
        </div>
      </footer>
    </div>
  );
}
