

import React, { useState } from 'react';
import MarketingLayout from './MarketingLayout';
import { 
  Calendar, 
  Check, 
  CheckCircle,
  Users, 
  PenTool, 
  BarChart3, 
  MessageSquare, 
  Clock,
  Layers,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MoreHorizontal,
  Filter,
  Search,
  Bell,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  Music2,
  Pin,
  AtSign,
  Mail,
  FileText,
  Newspaper,
  Lightbulb,
  Zap,
  Globe,
  Shield,
  Server,
  Lock,
  ArrowRight,
  BrainCircuit
} from 'lucide-react';


interface LandingProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
  toggleTheme: () => void;
}

const TWEETS = [
    { handle: '@nerdburn', text: "It’s fun, feels lightweight, and really quick to spin up user auth and a few tables. Almost too easy! Highly recommend.", link: "https://twitter.com/nerdburn/status/1356857261495214085" },
    { handle: '@patrickc', text: "Very impressed by @supabase's growth. For new startups, they seem to have gone from \"promising\" to \"standard\" in remarkably short order.", link: "https://x.com/patrickc/status/1979157875600617913" },
    { handle: '@Aliahsan_sfv', text: "Okay, I finally tried Supabase today and wow... why did I wait so long? 😅 Went from 'how do I even start' to having auth + database + real-time updates working in like 20 minutes. Sometimes the hype is actually justified! #Supabase", link: "https://x.com/Aliahsan_sfv/status/1967167095894098210" },
    { handle: '@yatsiv_yuriy', text: "Supabase is the best product experience I've had in years.\nNot just tech - taste.\nFrom docs to latency to the URL structure that makes you think \"oh, that's obvious\"\nFeels like every other platform should study how they built it\n@supabase I love you", link: "https://x.com/yatsiv_yuriy/status/1979182362480071162" },
    { handle: '@adeelibr', text: "@supabase shout out, their MCP is awesome. It's helping me create better row securities and telling me best practises for setting up a supabase app", link: "https://x.com/adeelibr/status/1981356783818985774" },
    { handle: '@TyronBache', text: "Really impressed with @supabase's Assistant.\n\nIt has helped me troubleshoot and solve complex CORS Configuration issues on Pinger.", link: "https://x.com/TyronBache/status/1924425289959928039" },
    { handle: '@MinimEditor', text: "I’ve always used Supabase just as a database.\n\nYesterday, I helped debug a founder’s vibe-coding project built with React + React Router — no backend server.\nThe “backend” was entirely Supabase Edge Functions as the API.\nFirst time using Supabase this way.\nImpressive.", link: "https://x.com/MinimEditor/status/1954422981708722372" },
    { handle: '@orlandopedro_', text: "Love @supabase custom domains\n\nmakes the auth so much better", link: "https://x.com/orlandopedro_/status/1958618806143578336" },
    { handle: '@sdusteric', text: "Loving #Supabase MCP. Claude Code would not only plan what data we should save but also figure out a migration script by checking what the schema looks like on Supabase via MCP.", link: "https://x.com/sdusteric/status/1957703488470921550" },
    { handle: '@SteinlageScott', text: "I love @supabase's built-in Advisors. The security and performance linters improve everything and boost my confidence in what I'm building!", link: "https://x.com/SteinlageScott/status/1958603243401183701" },
    { handle: '@BowTiedQilin', text: "Working with @supabase has been one of the best dev experiences I've had lately.\n\nIncredibly easy to set up, great documentation, and so many fewer hoops to jump through than the competition.\n\nI definitely plan to use it on any and all future projects.", link: "https://x.com/BowTiedQilin/status/1497602628410388480" },
    { handle: '@adm_lawson', text: "Love supabse edge functions. Cursor+Supabase+MCP+Docker desktop is all I need", link: "https://x.com/adm_lawson/status/1958216298309066887" },
    { handle: '@gokul_i', text: "First time running @supabase in local. It just works. Very good DX imo.", link: "https://x.com/gokul_i/status/1958880167889133811" },
    { handle: '@dadooos_', text: "Run supabase locally and just wow in silence! I am impressed! This is the kind of tooling I would want for my team.", link: "https://x.com/dadooos_/status/1947924753618243663" },
    { handle: '@Rodrigo66799141', text: "After a week of diving deep into Supabase for my new SaaS project, I'm really impressed with its Auth and RLS features. It makes security much simpler for solo founders. #buildinpublic #SaaS", link: "https://x.com/Rodrigo66799141/status/1959246083957100851" },
    { handle: '@xthemadgeniusx', text: "Lately been using Supabase over AWS/ GCP for products to save on costs and rapid builds(Vibe Code) that do not need all the Infra and the hefty costs that come with AWS/ GCP out the door. Great solution overall.", link: "https://x.com/xthemadgeniusx/status/1960049950110384250" },
    { handle: '@pontusab', text: "I love everything about Supabase.", link: "https://x.com/pontusab/status/1958603243401183701" },
    { handle: '@viratt_mankali', text: "Love how Supabase makes full stack features this easy. Using it with Next.js and loving the experience!", link: "https://x.com/viratt_mankali/status/1963290133421240591" }
];

const SOCIAL_PLATFORMS = [
    { name: 'Twitter', icon: <Twitter strokeWidth={1.5} /> },
    { name: 'Instagram', icon: <Instagram strokeWidth={1.5} /> },
    { name: 'LinkedIn', icon: <Linkedin strokeWidth={1.5} /> },
    { name: 'Facebook', icon: <Facebook strokeWidth={1.5} /> },
    { name: 'YouTube', icon: <Youtube strokeWidth={1.5} /> },
    { name: 'Discord', icon: <MessageSquare strokeWidth={1.5} /> },
    { name: 'TikTok', icon: <Music2 strokeWidth={1.5} /> },
    { name: 'Pinterest', icon: <Pin strokeWidth={1.5} /> },
    { name: 'WhatsApp', icon: <MessageSquare strokeWidth={1.5} /> },
    { name: 'Reddit', icon: <Globe strokeWidth={1.5} /> },
    { name: 'Snapchat', icon: <Bell strokeWidth={1.5} /> },
    { name: 'Telegram', icon: <MessageSquare strokeWidth={1.5} /> },
];

const FAQ_ITEMS = [
    {
        question: "How does Auto-CM work?",
        answer: "Auto-CM connects to your social platforms via official APIs. It listens for mentions, comments, and messages in real-time. Our AI engine then analyzes the context and sentiment, drafts appropriate responses based on your brand guidelines, and can even auto-publish them if you enable autonomous mode. It also schedules content and provides deep analytics on community growth."
    },
    {
        question: "What platforms can I connect?",
        answer: "We currently support major platforms including Twitter (X), Discord, Slack, LinkedIn, and Facebook. We are actively working on integrations for Instagram and TikTok to provide a complete omni-channel experience."
    },
    {
        question: "Which languages are supported?",
        answer: "Auto-CM natively supports over 50 languages including English, Spanish, French, German, Portuguese, Japanese, and Chinese. The AI automatically detects the incoming message language and responds in the same language."
    },
    {
        question: "Can I customize the AI persona?",
        answer: "Yes! You have full control over the AI's tone of voice, forbidden words, and specific knowledge base. You can upload your own documentation and brand guidelines so the AI sounds exactly like a member of your team."
    },
    {
        question: "Is Auto-CM free to use?",
        answer: "We offer a generous Free Tier that includes 1 connected community and 50 AI generations per month. For power users and agencies, our Pro plans start at $49/mo with unlimited connections and advanced automation features."
    },
    {
        question: "I have more questions!",
        answer: "We'd love to chat! You can join our Discord community to talk with the team directly, or check out our comprehensive Documentation for detailed guides and API references."
    }
];

const LOGOS = [
    { name: 'Venture Inc' },
    { name: 'Startup Co' },
    { name: 'Innovate LLC' },
    { name: 'TechFlow' },
    { name: 'Future Systems' },
    { name: 'Quantum Leap' },
    { name: 'Global Solutions' },
    { name: 'Alpha Brand' },
    { name: 'NextGen' },
    { name: 'Synergy Corp' },
    { name: 'Momentum' }
];

const BrandLogo = ({ name }: { name: string }) => {
    return (
        <span className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors">
            {name}
        </span>
    );
}

// New component: TweetCard
interface TweetCardProps {
    tweet: {
        handle: string;
        text: string;
        link: string;
    };
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
    return (
        <a 
            href={tweet.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#282828] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-[#3ecf8e]/50 transition-all duration-300"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-500">
                    <Twitter size={18} />
                </div>
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">@{tweet.handle.substring(1)}</p>
                    <p className="text-xs text-gray-500 dark:text-[#8b9092]">Twitter / X user</p>
                </div>
            </div>
            <p className="text-gray-700 dark:text-[#ededed] text-base leading-relaxed mb-4">
                {tweet.text}
            </p>
            <span className="text-xs text-emerald-600 dark:text-[#3ecf8e] flex items-center gap-1">
                Read on Twitter <ArrowRight size={12} />
            </span>
        </a>
    );
};


const Landing: React.FC<LandingProps> = ({ onStart, onNavigate, toggleTheme }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Split tweets into 3 columns for vertical marquee
  const col1 = TWEETS.slice(0, 6);
  const col2 = TWEETS.slice(6, 12);
  const col3 = TWEETS.slice(12, 18);

  return (
    <MarketingLayout onNavigate={onNavigate} onLogin={onStart} toggleTheme={toggleTheme}>
        
        {/* Hero Section */}
        <section className="hero-section">
            <div className="hero-content">
                <h1>
                    <span className="line-1">Orchestrate your entire</span>
                    <span className="line-2">social strategy</span>
                </h1>
                <p className="subtitle">
                    The all-in-one platform for agencies and brands to plan, collaborate,<br className="hidden-mobile"/>
                    and schedule content at scale. Centralize your workflow.
                </p>
                <div className="cta-buttons">
                    <button onClick={onStart} className="btn btn-primary">Start your free trial</button>
                    <button className="btn btn-secondary">Book a demo</button>
                </div>
            </div>

            <div className="hero-logos relative w-full overflow-hidden mask-linear-gradient pt-8">
                <p className="trusted-text text-center mb-8">Trusted by leading agencies and multi-location brands</p>
                <div className="flex animate-marquee gap-12 items-center">
                    {[...LOGOS, ...LOGOS].map((logo, i) => (
                        <div key={i} className="flex items-center justify-center min-w-[120px] group">
                            <BrandLogo name={logo.name} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Supabase-style Feature Grid */}
        <div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20 !pt-0 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 xl:gap-3 2xl:gap-6 md:grid-cols-12">
            
            {/* Context Engine Card (Formerly Postgres) */}
            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 md:col-span-12 xl:col-span-6 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-black w-full h-full text-gray-400 [&_strong]:!font-normal [&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center md:ml-2 md:mt-2 lg:pl-0 md:justify-start md:max-w-[250px] md:text-left md:items-start">
                            <div className="flex items-center gap-2 text-white">
                                <BrainCircuit width={18} height={18} strokeWidth={1.5} />
                                <h2 className="">AI Context Engine</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-white">Your brand's <strong>central nervous system</strong>. It remembers every interaction, guideline, and past success.</p>
                                <span className="hidden lg:block text-white md:block">
                                    <ul className="flex flex-col gap-1 text-sm">
                                        <li><Check className="inline h-4 w-4" /> Context-aware responses</li>
                                        <li><Check className="inline h-4 w-4" /> Brand Safe & Private</li>
                                        <li><Check className="inline h-4 w-4" /> Auto-updating Knowledge</li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                        <figure className="absolute inset-0 z-0 hidden sm:block" role="img" aria-label="AI Context Engine visualization">
                            <div className="absolute right-0 bottom-0 top-0 w-3/4 flex items-center justify-center">
                                <div className="relative w-full h-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                    {/* Abstract Data Visualization */}
                                    <div className="grid grid-cols-3 gap-3 transform rotate-12 scale-90">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className={`w-16 h-16 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center ${i === 4 ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}>
                                                <div className={`w-2 h-2 rounded-full ${i === 4 ? 'bg-emerald-400' : 'bg-white/20'}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Connecting Lines */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ transform: 'rotate(12deg)' }}>
                                        <line x1="30%" y1="30%" x2="70%" y2="70%" stroke="white" strokeWidth="1" />
                                        <line x1="70%" y1="30%" x2="30%" y2="70%" stroke="white" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                        </figure>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 xl:col-span-3 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-white dark:bg-[#1c1c1c] w-full h-full text-gray-500 dark:text-gray-400 [&_strong]:!font-normal [&_strong]:!text-gray-900 dark:[&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center lg:mx-0 lg:pl-2 lg:items-start lg:text-left">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.03305 15.8071H12.7252V18.884M5.03305 15.8071V12.7302H12.7252V15.8071M15.0419 8.15385V5.07692C15.0419 3.37759 13.6643 2 11.965 2C10.2657 2 8.88814 3.37759 8.88814 5.07692V8.15385M5 11.2307L5 18.9231C5 20.6224 6.37757 22 8.07689 22H15.769C17.4683 22 18.8459 20.6224 18.8459 18.9231V11.2307C18.8459 9.53142 17.4683 8.15385 15.769 8.15385L8.07689 8.15385C6.37757 8.15385 5 9.53142 5 11.2307Z" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"></path>
                                </svg>
                                <h2 className="">Authentication</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-gray-900 dark:[&_strong]:!text-white"><strong>Add user sign ups and logins</strong>,<br className="hidden lg:inline-block"/> securing your data with Row Level Security.</p>
                            </div>
                        </div>
                        <figure className="group absolute inset-0 z-0 -top-16 xl:top-0 xl:bottom-0 hidden sm:block" role="img" aria-label="Supabase Authentication">
                             <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-[#232323] to-transparent opacity-50"></div>
                        </figure>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 xl:col-span-3 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-white dark:bg-[#1c1c1c] w-full h-full text-gray-500 dark:text-gray-400 [&_strong]:!font-normal [&_strong]:!text-gray-900 dark:[&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center lg:mx-0 lg:pl-2 lg:items-start lg:text-left">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.6594 21.8201C8.10788 22.5739 9.75418 23 11.5 23C17.299 23 22 18.299 22 12.5C22 10.7494 21.5716 9.09889 20.8139 7.64754M16.4016 3.21191C14.9384 2.43814 13.2704 2 11.5 2C5.70101 2 1 6.70101 1 12.5C1 14.287 1.44643 15.9698 2.23384 17.4428M2.23384 17.4428C1.81058 17.96 1.55664 18.6211 1.55664 19.3416C1.55664 20.9984 2.89979 22.3416 4.55664 22.3416C6.21349 22.3416 7.55664 20.9984 7.55664 19.3416C7.55664 17.6847 6.21349 16.3416 4.55664 16.3416C3.62021 16.3416 2.78399 16.7706 2.23384 17.4428ZM21.5 5.64783C21.5 7.30468 20.1569 8.64783 18.5 8.64783C16.8432 8.64783 15.5 7.30468 15.5 5.64783C15.5 3.99097 16.8432 2.64783 18.5 2.64783C20.1569 2.64783 21.5 3.99097 21.5 5.64783ZM18.25 12.5C18.25 16.2279 15.2279 19.25 11.5 19.25C7.77208 19.25 4.75 16.2279 4.75 12.5C4.75 8.77208 7.77208 5.75 11.5 5.75C15.2279 5.75 18.25 8.77208 18.25 12.5Z" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"></path>
                                </svg>
                                <h2 className="">Edge Functions</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-gray-900 dark:[&_strong]:!text-white">Easily write custom code<br className="hidden sm:inline-block"/> <strong>without deploying or scaling servers.</strong></p>
                            </div>
                        </div>
                        <figure className="absolute inset-0 z-20 hidden sm:block" role="img" aria-label="Supabase Edge Functions visual composition">
                            <div className="absolute inset-0 top-[48%] xl:top-[45%] w-full max-w-[200px] h-fit mx-auto px-2.5 py-1.5 flex items-center justify-start rounded-full bg-gray-50 dark:bg-[#232323] border border-gray-300 dark:border-[#383838] text-xs text-gray-500 dark:text-gray-400 text-left">
                                <span className="mr-2">$</span>supabase<span className="ml-1 text-emerald-600 inline-block">functions <span>serve</span></span>
                            </div>
                        </figure>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 xl:col-span-3 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-white dark:bg-[#1c1c1c] w-full h-full text-gray-500 dark:text-gray-400 [&_strong]:!font-normal [&_strong]:!text-gray-900 dark:[&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center lg:mx-0 lg:pl-2 lg:items-start lg:text-left">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.4997 12.1386V9.15811L14.8463 3.53163H6.43717C5.57423 3.53163 4.87467 4.23119 4.87467 5.09413V9.78087M20.4447 9.13199L14.844 3.53125L14.844 7.56949C14.844 8.43243 15.5436 9.13199 16.4065 9.13199L20.4447 9.13199ZM7.12729 9.78087H4.83398C3.97104 9.78087 3.27148 10.4804 3.27148 11.3434V19.1559C3.27148 20.8818 4.67059 22.2809 6.39648 22.2809H18.8965C20.6224 22.2809 22.0215 20.8818 22.0215 19.1559V13.7011C22.0215 12.8381 21.3219 12.1386 20.459 12.1386H10.8032C10.3933 12.1386 9.99969 11.9774 9.70743 11.6899L8.22312 10.2296C7.93086 9.94202 7.53729 9.78087 7.12729 9.78087Z" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"></path>
                                </svg>
                                <h2 className="">Storage</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-gray-900 dark:[&_strong]:!text-white"><strong>Store, organize, and serve</strong><br className="hidden sm:inline-block xl:hidden 2xl:inline-block"/> large files, from videos to images.</p>
                            </div>
                        </div>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 pointer-events-none xl:col-span-3 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-white dark:bg-[#1c1c1c] w-full h-full text-gray-500 dark:text-gray-400 [&_strong]:!font-normal [&_strong]:!text-gray-900 dark:[&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center lg:mx-0 lg:pl-2 lg:items-start lg:text-left">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.15928 1.94531V5.84117M6.24345 5.84117L2.91385 2.40977M6.24345 8.53673H2.4248M16.7998 16.496L21.9988 15.2019C22.7217 15.022 22.8065 14.0285 22.1246 13.7286L9.73411 8.28034C9.08269 7.99391 8.41873 8.65652 8.70383 9.30851L14.0544 21.5445C14.3518 22.2247 15.341 22.1456 15.5266 21.4269L16.7998 16.496Z" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"></path>
                                </svg>
                                <h2 className="">Realtime</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-gray-900 dark:[&_strong]:!text-white"><strong>Build multiplayer experiences</strong><br className="hidden sm:inline-block"/> with real-time data synchronization.</p>
                            </div>
                        </div>
                        <figure className="absolute inset-0 xl:-bottom-2 2xl:bottom-0 z-0 w-full overflow-hidden pointer-events-auto hidden sm:block" role="img" aria-label="Supabase Realtime multiplayer app demo">
                            <div className="absolute will-change-transform" style={{top: '60%', left: '30%', transform: 'translate(0px, 0px) translate(-50%, -50%)', transition: 'transform 0.75s ease-out'}}>
                                <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z" fill="currentColor" className="text-gray-100 dark:text-[#2a2a2a]" stroke="currentColor" strokeLinejoin="round"></path></svg>
                                <div className="!w-[66.70px] !h-[33.35px] absolute left-full flex items-center justify-center gap-1 -top-6 border border-gray-400 dark:border-gray-500 rounded-full bg-gray-50 dark:bg-[#232323]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_infinite] pause group-hover:run"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_200ms_infinite] pause group-hover:run"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_400ms_infinite] pause group-hover:run"></div>
                                </div>
                            </div>
                            <div className="absolute will-change-transform scale-[80%]" style={{top: '80%', left: '65%', transform: 'translate(0px, 0px) translate(-50%, -50%)', transition: 'transform 1s ease-out'}}>
                                <svg width="20" height="28" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z" fill="currentColor" className="text-gray-100 dark:text-[#2a2a2a]" stroke="currentColor" strokeLinejoin="round"></path></svg>
                                <div className="!w-[55px] !h-[28px] absolute left-full flex items-center justify-center gap-1 -top-6 border border-gray-400 rounded-full bg-gray-50 dark:bg-[#232323] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_infinite] pause group-hover:run"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_200ms_infinite] pause group-hover:run"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_400ms_infinite] pause group-hover:run"></div>
                                </div>
                            </div>
                            <div className="absolute will-change-transform w-1 h-1 opacity-0 motion-safe:group-hover:opacity-100 delay-0 duration-75 group-hover:duration-300 transition-opacity" style={{top: '0px', left: '0px', transform: 'translate(13px, 267.2px) translate(-50%, -50%)'}}>
                                <div className="w-auto h-auto px-2.5 py-1.5 absolute left-full flex items-center justify-center gap-1 -top-6 border border-emerald-600 rounded-full bg-emerald-900/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_infinite] pause group-hover:run"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_200ms_infinite] pause group-hover:run"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_400ms_infinite] pause group-hover:run"></div>
                                </div>
                            </div>
                        </figure>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 xl:col-span-3 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-white dark:bg-[#1c1c1c] w-full h-full text-gray-500 dark:text-gray-400 [&_strong]:!font-normal [&_strong]:!text-gray-900 dark:[&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center lg:mx-0 lg:pl-2 lg:items-start lg:text-left">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.9983 11.4482V21.7337M11.9983 11.4482L21.0732 6.17699M11.9983 11.4482L2.92383 6.17723M2.92383 6.17723V12.4849M2.92383 6.17723V6.1232L8.35978 2.9657M21.0736 12.54V6.1232L15.6376 2.9657M17.7247 18.6107L11.9987 21.9367L6.27265 18.6107" stroke="currentColor" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"></path>
                                </svg>
                                <h2 className="">Vector</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-gray-900 dark:[&_strong]:!text-white">Integrate your favorite ML-models to <br className="hidden sm:inline-block md:hidden"/><strong>store, index and search vector embeddings</strong>.</p>
                            </div>
                        </div>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            {/* Custom Domains - Added to fill the grid */}
            <a className="group relative w-full sm:h-[400px] flex flex-col gap-5 lg:flex-row focus:outline-none focus:border-none focus:ring-emerald-600 focus:ring-2 focus:rounded-xl col-span-6 xl:col-span-3 cursor-default" href="#">
                <div className="group/panel rounded-lg md:rounded-xl p-px bg-white dark:bg-[#1c1c1c] bg-gradient-to-b from-gray-200 dark:from-[#282828] to-gray-200/50 dark:to-[#1c1c1c] transition-all hover:shadow-md flex items-center justify-center relative w-full h-full">
                    <div className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-row sm:flex-col gap-4 items-start sm:items-center lg:items-start justify-between bg-white dark:bg-[#1c1c1c] w-full h-full text-gray-500 dark:text-gray-400 [&_strong]:!font-normal [&_strong]:!text-gray-900 dark:[&_strong]:!text-white p-4 sm:py-6">
                        <div className="relative z-10 h-full w-full mx-auto gap-2 sm:gap-4 flex flex-col items-start sm:items-center text-left sm:text-center lg:mx-0 lg:pl-2 lg:items-start lg:text-left">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Globe width={18} height={18} strokeWidth={1.5} />
                                <h2 className="">Custom Domains</h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                                <p className="text-sm [&_strong]:!text-gray-900 dark:[&_strong]:!text-white"><strong>Whitelabel your experience</strong><br/> with fully customizable domains and SSL.</p>
                            </div>
                        </div>
                        <div className="absolute z-10 inset-0 w-full h-full pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </a>

            <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 col-span-full tracking-[-.01rem] text-center mt-8"><span className="text-gray-900 dark:text-white">Use one or all.</span> Best of breed products. Integrated as a platform.</p>
        </div>

        {/* Platforms */}
        <div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20 overflow-hidden">
            <div className="flex flex-col text-center gap-4 items-center justify-center">
                <h2 className="text-2xl sm:text-3xl xl:text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
                    Pick your Channels
                </h2>
                <p className="mx-auto text-gray-500 dark:text-gray-400 max-w-2xl">
                    Auto-CM works with your existing social presence. Connect once, automate forever.
                </p>
            </div>
            <div className="w-full py-12 flex items-center justify-center text-center">
                <div className="relative mx-auto w-full max-w-5xl flex flex-wrap items-center justify-center gap-6 px-4">
                    {SOCIAL_PLATFORMS.map((platform) => (
                        <div key={platform.name} className="relative group z-0">
                            <a className="flex flex-col items-center text-center group cursor-pointer p-4">
                                <div 
                                    className="relative w-[80px] h-[80px] flex items-center justify-center bg-white dark:bg-[#232323] rounded-2xl border border-gray-200 dark:border-[#333] p-3 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-[#3ecf8e] group-hover:border-emerald-600/30 dark:group-hover:border-[#3ecf8e]/30 transition-all duration-300 shadow-sm group-hover:shadow-emerald-500/10 group-hover:scale-110"
                                >
                                    {React.cloneElement(platform.icon as React.ReactElement<any>, { size: 40, strokeWidth: 1.5 })}
                                </div>
                                <div className="text-gray-900 dark:text-white mt-3 font-medium text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                                    {platform.name}
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Dashboard Preview */}
        <section className="dashboard-section">
            <h2>The control center for your community</h2>
            <div className="dashboard-window">
                <div className="window-chrome">
                    <div className="window-dot bg-red-400"></div>
                    <div className="window-dot bg-yellow-400"></div>
                    <div className="window-dot bg-green-400"></div>
                </div>
                <div className="window-content bg-[#F3F4F6] flex flex-col h-full overflow-hidden text-gray-900">
                    {/* Mock App Header */}
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-white" />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-500">
                            <Facebook size={20} className="text-blue-600 hover:scale-110 transition-transform cursor-pointer" />
                            <Twitter size={20} className="text-black hover:scale-110 transition-transform cursor-pointer" />
                            <Instagram size={20} className="text-pink-600 hover:scale-110 transition-transform cursor-pointer" />
                            <Linkedin size={20} className="text-blue-700 hover:scale-110 transition-transform cursor-pointer" />
                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform cursor-pointer">G</div>
                            <Music2 size={20} className="text-black hover:scale-110 transition-transform cursor-pointer" />
                            <Pin size={20} className="text-red-600 hover:scale-110 transition-transform cursor-pointer" />
                            <AtSign size={20} className="text-black hover:scale-110 transition-transform cursor-pointer" />
                            <div className="w-8 h-8 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 cursor-pointer">
                                <Plus size={16} />
                            </div>
                        </div>

                        <div>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                                <PenTool size={16} /> Compose
                            </button>
                        </div>
                    </div>

                    {/* Calendar Toolbar */}
                    <div className="bg-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-gray-100">
                        <div className="w-20"></div> {/* Spacer */}
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-gray-600"><ChevronLeft size={20} /></button>
                            <span className="text-lg font-semibold text-gray-700">June 2024</span>
                            <button className="text-gray-400 hover:text-gray-600"><ChevronRight size={20} /></button>
                        </div>
                        <div className="flex bg-gray-100 rounded-md p-1">
                            <button className="px-3 py-1 bg-white shadow-sm rounded text-sm font-medium text-gray-700">Month</button>
                            <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">Week</button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-y-auto bg-white p-6">
                        <div className="grid grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden h-full min-h-[600px]">
                            {/* Cell 1: Draft + Post */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">1</div>
                                <div className="bg-white border border-gray-200 rounded p-2 shadow-sm flex items-center gap-2">
                                    <PenTool size={12} className="text-blue-400" />
                                    <span className="text-xs text-gray-600 font-medium">Draft</span>
                                </div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="h-20 bg-orange-100 relative">
                                        <img src="https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=300&q=80" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Facebook size={10} className="text-blue-600"/></div>
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Instagram size={10} className="text-pink-600"/></div>
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Twitter size={10} className="text-black"/></div>
                                        </div>
                                    </div>
                                    <div className="p-1.5 flex justify-between items-center">
                                        <div className="w-16 h-2 bg-gray-100 rounded"></div>
                                        <CheckCircle size={12} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Cell 2: Post */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">2</div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="h-24 bg-purple-100 relative">
                                        <img src="https://images.unsplash.com/photo-1628751506440-72e5ef3dc6d2?w=300&q=80" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Facebook size={10} className="text-blue-600"/></div>
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Instagram size={10} className="text-pink-600"/></div>
                                        </div>
                                    </div>
                                    <div className="p-1.5 flex justify-between items-center">
                                        <div className="w-12 h-2 bg-gray-100 rounded"></div>
                                        <CheckCircle size={12} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Cell 3: Time Slots */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">3</div>
                                <div className="border border-dashed border-indigo-200 bg-indigo-50 rounded p-2 text-center">
                                    <span className="text-xs font-medium text-indigo-600 block">12:50 PM</span>
                                </div>
                                <div className="border border-dashed border-orange-200 bg-orange-50 rounded p-2 text-center">
                                    <span className="text-xs font-medium text-orange-600 block">5:30 PM</span>
                                </div>
                            </div>

                            {/* Cell 4: Post */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">4</div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="h-24 bg-pink-100 relative">
                                        <img src="https://images.unsplash.com/photo-1582979512210-99b6a53385f9?w=300&q=80" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Linkedin size={10} className="text-blue-700"/></div>
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm text-[8px] font-bold text-blue-500">G</div>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full text-white">
                                            <MessageSquare size={8} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cell 5: Brief */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">7</div>
                                <div className="bg-white border border-gray-200 rounded p-3 shadow-sm flex flex-col gap-2 h-full">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium text-xs">
                                        <Lightbulb size={12} /> Brief & Ideas
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                                        <div className="h-1.5 w-2/3 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Cell 6: Newsletter */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">9</div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="px-2 py-1.5 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
                                        <Mail size={10} className="text-orange-500"/>
                                        <span className="text-[10px] font-medium text-orange-700">Newsletter</span>
                                    </div>
                                    <div className="h-20 bg-yellow-100">
                                        <img src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=300&q=80" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-1.5 flex justify-between items-center">
                                        <Clock size={12} className="text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Cell 7: Press Release */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">11</div>
                                <div className="bg-white border border-gray-200 rounded p-3 shadow-sm flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-indigo-700 font-medium text-xs">
                                        <Newspaper size={12} /> Press Release
                                    </div>
                                    <div className="h-1.5 w-full bg-indigo-50 rounded"></div>
                                    <div className="flex justify-end mt-1">
                                        <Clock size={12} className="text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Cell 8: TikTok */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">12</div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="h-24 bg-red-50 relative">
                                        <img src="https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=300&q=80" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1">
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Music2 size={10} className="text-black"/></div>
                                        </div>
                                    </div>
                                    <div className="p-1.5 flex justify-between items-center">
                                        <CheckCircle size={12} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Cell 9: Post */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">13</div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="h-24 bg-yellow-100 relative">
                                        <img src="https://images.unsplash.com/photo-1582979512210-99b6a53385f9?w=300&q=80" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Linkedin size={10} className="text-blue-700"/></div>
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Facebook size={10} className="text-blue-600"/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cell 10: Pinterest */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]">
                                <div className="text-xs text-gray-400 font-medium mb-1">14</div>
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="h-20 bg-red-100 relative">
                                        <img src="https://images.unsplash.com/photo-1560806887-1e-400000000000?w=300&q=80" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1">
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"><Pin size={10} className="text-red-600"/></div>
                                        </div>
                                    </div>
                                    <div className="p-1.5 flex justify-between items-center">
                                        <Clock size={12} className="text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Remaining empty cells */}
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]"><div className="text-xs text-gray-400 font-medium">15</div></div>
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]"><div className="text-xs text-gray-400 font-medium">16</div></div>
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]"><div className="text-xs text-gray-400 font-medium">17</div></div>
                            <div className="bg-white p-2 flex flex-col gap-2 min-h-[140px]"><div className="text-xs text-gray-400 font-medium">18</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Social Proof (Tweets) */}
        <section className="py-24 bg-gray-50 dark:bg-[#1c1c1c] border-t border-gray-100 dark:border-[#282828] overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Loved by developers</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Auto-CM is built on an open-source, developer-first platform. Here's what they're saying.
                    </p>
                </div>

                <div className="relative h-[600px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                    <div className="absolute inset-0 flex gap-6 justify-center">
                        <div className="w-[380px] space-y-6 animate-marquee-up [animation-duration:90s] hover:[animation-play-state:paused]">
                           {[...col1, ...col1].map((tweet, i) => (
                               <TweetCard key={i} tweet={tweet} />
                           ))}
                        </div>
                        <div className="w-[380px] space-y-6 animate-marquee-down [animation-duration:100s] hover:[animation-play-state:paused]">
                           {[...col2, ...col2].map((tweet, i) => (
                               <TweetCard key={i} tweet={tweet} />
                           ))}
                        </div>
                        <div className="w-[380px] space-y-6 animate-marquee-up [animation-duration:80s] hover:[animation-play-state:paused] hidden lg:block">
                           {[...col3, ...col3].map((tweet, i) => (
                               <TweetCard key={i} tweet={tweet} />
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-24 px-6 max-w-3xl mx-auto">
            <h2 className="text-center text-4xl font-bold mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="border border-gray-200 dark:border-[#2e2e2e] rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                            className="w-full flex justify-between items-center p-6 text-left"
                        >
                            <span className="font-semibold text-lg">{item.question}</span>
                            <ChevronDown size={20} className={`transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                        </button>
                        <div 
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-96 pb-6' : 'max-h-0'}`}
                        >
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    </MarketingLayout>
  );
};

export default Landing;
