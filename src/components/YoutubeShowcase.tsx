import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Youtube, 
  Clock, 
  Calendar, 
  ExternalLink, 
  ArrowRight, 
  Check, 
  Users, 
  Video, 
  Tv, 
  Eye, 
  Search,
  Bell,
  Heart,
  Share2,
  Sliders,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

const nexoraLogo = '/src/assets/images/nexora_logo_1783811137284.jpg';
const nexoraBanner = '/src/assets/images/nexora_banner_1783811152255.jpg';

// Interfaces
interface VideoData {
  id: string;
  title: string;
  category: string;
  description: string;
  uploadDate: string;
  duration: string;
  views: string;
  url: string;
  bgGradient: string;
  accentColor: string;
  iconName?: string;
  thumbnailUrl?: string;
}

export const YoutubeShowcase: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(12420);
  const [activeTab, setActiveTab] = useState<'all' | 'cad' | 'electronics' | 'tutorials'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 4 requested long videos (acts as dynamic fallback)
  const videosListFallback: VideoData[] = [
    {
      id: '92NGRk_LF-4',
      title: '6-Axis Robotic Arm Kinematics & Parametric CAD modeling Masterclass',
      category: 'Mechanical Engineering',
      description: 'Step-by-step masterclass modeling a 6-axis robotic arm with complex joints, workspace volume optimization, and torque calculation in Fusion 360 & Inventor.',
      uploadDate: 'June 18, 2026',
      duration: '1:48:22',
      views: '15.4K views',
      url: 'https://youtu.be/92NGRk_LF-4',
      bgGradient: 'from-green-950 via-[#1b5e20] to-[#0f3a12]',
      accentColor: '#4CAF50',
      iconName: 'mechanical',
      thumbnailUrl: 'https://img.youtube.com/vi/92NGRk_LF-4/maxresdefault.jpg'
    },
    {
      id: 'eMELSgE5YtE',
      title: 'Industrial PCB Design & High-Speed Impedance Routing Walkthrough',
      category: 'Hardware PCBs',
      description: 'A complete 8-layer high-speed PCB design session in Altium Designer, detailing impedance-matched routing, differential pairs, and signal integrity simulations.',
      uploadDate: 'May 25, 2026',
      duration: '1:28:45',
      views: '12.1K views',
      url: 'https://youtu.be/eMELSgE5YtE',
      bgGradient: 'from-emerald-700 to-[#1b5e20]',
      accentColor: '#4CAF50',
      iconName: 'electronics',
      thumbnailUrl: 'https://img.youtube.com/vi/eMELSgE5YtE/maxresdefault.jpg'
    },
    {
      id: 'POvlAxG3G_w',
      title: 'High-Fidelity 3D Product Rendering & CAD Animation Workshop',
      category: 'Product Design',
      description: 'Learn professional rendering, materials setup, scene lighting, and complex keyframe animations for high-end product showcasing using SolidWorks & KeyShot.',
      uploadDate: 'April 30, 2026',
      duration: '1:35:10',
      views: '9.5K views',
      url: 'https://youtu.be/POvlAxG3G_w',
      bgGradient: 'from-[#2e7d32] to-emerald-900',
      accentColor: '#4CAF50',
      iconName: 'cad',
      thumbnailUrl: 'https://img.youtube.com/vi/POvlAxG3G_w/maxresdefault.jpg'
    },
    {
      id: 'OT0US0xXWAI',
      title: 'Ansys Finite Element Method (FEM) Static & Dynamic Simulation Course',
      category: 'Mechanical Engineering',
      description: 'Master linear static, modal, and transient structural stress simulations in Ansys Workbench for mechanical brackets, chassis structures, and high-load assemblies.',
      uploadDate: 'March 15, 2026',
      duration: '2:15:40',
      views: '18.3K views',
      url: 'https://youtu.be/OT0US0xXWAI',
      bgGradient: 'from-emerald-950 via-teal-950 to-green-950',
      accentColor: '#4CAF50',
      iconName: 'tutorials',
      thumbnailUrl: 'https://img.youtube.com/vi/OT0US0xXWAI/maxresdefault.jpg'
    }
  ];

  // Dynamic state hooks for loading and feed persistence
  const [videos, setVideos] = useState<VideoData[]>(videosListFallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingLiveFeed, setIsUsingLiveFeed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestVideos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/youtube/latest');
        const data = await response.json();
        if (isMounted) {
          if (data.success && data.videos && data.videos.length > 0) {
            setVideos(data.videos);
            setIsUsingLiveFeed(true);
          } else {
            console.warn("Using fallback video presets. Reason:", data.error || "empty response");
          }
        }
      } catch (err) {
        console.warn("Failed to contact API for live YouTube videos, falling back to local list:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchLatestVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Video Player Modal State
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isPlayingSimulated, setIsPlayingSimulated] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const handleSubscribeToggle = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      setSubscribersCount(prev => prev - 1);
    } else {
      setIsSubscribed(true);
      setSubscribersCount(prev => prev + 1);
    }
  };

  // Display all videos in the grid
  const gridVideos = videos;

  // Filters based on search & tab
  const filteredVideos = gridVideos.filter(vid => {
    const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vid.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    
    // Support category strings dynamically parsed from YouTube titles/descriptions
    const cat = (vid.category || '').toLowerCase();
    const isCad = cat.includes('cad') || cat.includes('model') || vid.iconName === 'solidworks' || vid.iconName === 'autocad';
    const isElec = cat.includes('elec') || cat.includes('pcb') || cat.includes('circuit') || vid.iconName === 'electrical';
    const isTutorial = cat.includes('tutorial') || cat.includes('guide') || cat.includes('creative') || vid.iconName === 'mechanical' || vid.iconName === 'product' || vid.iconName === 'editing';

    if (activeTab === 'cad') return matchesSearch && isCad;
    if (activeTab === 'electronics') return matchesSearch && isElec;
    if (activeTab === 'tutorials') return matchesSearch && isTutorial;
    return matchesSearch;
  });

  const renderIcon = (name: string) => {
    switch (name) {
      case 'mechanical':
        return (
          <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'solidworks':
        return (
          <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        );
      case 'autocad':
        return (
          <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 18l5.447-2.724a1 1 0 00.553-.894V5.618a1 1 0 00-.553-.894L9 2m0 18V2" />
          </svg>
        );
      case 'product':
        return (
          <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'electrical':
        return (
          <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        );
      case 'editing':
        return (
          <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.24 11.54l-4.24-2.12v4.24l4.24-2.12zm-5.74 5.7c-3.15 0-5.7-2.55-5.7-5.7s2.55-5.7 5.7-5.7 5.7 2.55 5.7 5.7-2.55 5.7-5.7 5.7zm0-13c-4.03 0-7.3 3.27-7.3 7.3s3.27 7.3 7.3 7.3 7.3-3.27 7.3-7.3-3.27-7.3-7.3-7.3z" />
          </svg>
        );
      default:
        return <Video className="w-12 h-12 text-white" />;
    }
  };

  // Simulated playback trigger
  const triggerSimulatedPlayback = (video: VideoData) => {
    setSelectedVideo(video);
    setIsPlayingSimulated(true);
    setSimulatedProgress(0);
    
    // Increment progress bar simulation
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 250);
  };

  return (
    <section 
      id="videos" 
      className="py-24 relative overflow-hidden bg-[#0B0F14] text-white border-t border-b border-white/10"
    >
      {/* Decorative Retro Grid Overlay (Subtle Green Dark Theme) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* 8-bit / Pixel Decorative Floating Elements */}
      <div className="absolute top-12 left-8 w-6 h-6 text-emerald-500/10 pointer-events-none select-none z-0 hidden lg:block">
        <svg viewBox="0 0 8 8" fill="currentColor">
          <path d="M3 0h2v1H3zm-1 1h4v1H2zm-1 1h6v1H1zm0 1h6v1H1zm0 1h6v1H1zm0 1h6v1H1zm1 1h4v1H2zm1 1h2v1H3z" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-10 w-8 h-8 text-emerald-500/10 pointer-events-none select-none z-0 hidden lg:block">
        <svg viewBox="0 0 8 8" fill="currentColor">
          <path d="M3 0h2v1H3zM1 2h6v1H1zm0 2h6v1H1zm2 2h2v1H3z" />
        </svg>
      </div>
      <div className="absolute top-1/2 right-12 w-4 h-4 text-emerald-500/10 pointer-events-none select-none z-0 hidden md:block">
        <svg viewBox="0 0 8 8" fill="currentColor">
          <path d="M0 3h8v2H0zm3-3h2v8H3z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header with Retro Pixel Touches */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-8 relative">
          <div className="absolute -top-3 left-0 px-2 py-0.5 bg-emerald-600 text-[8px] font-mono font-bold text-white uppercase tracking-widest">
            Module: Showcase_V2
          </div>
          <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 mb-3 uppercase flex items-center gap-1.5 font-mono">
            <Youtube className="w-4 h-4 text-emerald-400" /> 05 / BROADCAST CHANNELS
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase font-display flex flex-wrap items-center gap-x-3">
            🎥 Latest <span className="text-emerald-400 italic font-extrabold">Videos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mt-4 leading-relaxed text-xs sm:text-sm font-sans">
            Explore tutorials, engineering projects, CAD modeling, product design, and creative content from my YouTube channel.
          </p>
        </div>

        {/* Featured YouTube Channel Banner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 rounded-none shadow-xl bg-[#101419] border border-white/10 overflow-hidden"
          id="youtube-channel-banner-card"
        >
          {/* Top Banner Cover Area */}
          <div className="h-32 sm:h-44 md:h-52 w-full relative overflow-hidden select-none border-b border-white/10">
            <img 
              src={nexoraBanner} 
              alt="Nexora Channel Banner" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom Profile Info Row */}
          <div className="p-6 md:p-8 bg-[#101419] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Avatar with double green retro border */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-emerald-950 border border-emerald-500/30 p-1 flex items-center justify-center shrink-0 shadow-sm relative group-hover:scale-105 transition-transform overflow-hidden">
                <div className="w-full h-full bg-[#141A22] flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={nexoraLogo} 
                    alt="Nexora Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full animate-pulse" />
                </div>
              </div>
              
              {/* Channel metadata */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg md:text-xl font-bold tracking-tight text-white font-display uppercase">
                    Nexora
                  </h4>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] font-extrabold" title="Verified Creator">
                    ✓
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  <span className="font-bold text-white">@Nexora-k9x</span> • {subscribersCount.toLocaleString()} subscribers • 142 videos
                </p>
                <p className="text-xs text-gray-400 mt-2 max-w-xl leading-relaxed font-sans">
                  Welcome to the hardware design sandbox. High-fidelity parametric mechanical modeling, 6-axis kinematics, microcontroller routing, and technical software architecture.
                </p>
              </div>
            </div>

            {/* Subscribe Action Button with interactive state */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono">
              <button 
                onClick={handleSubscribeToggle}
                className={`px-6 py-3 border text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer rounded-none ${
                  isSubscribed 
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950' 
                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-white animate-bounce" />
                    Subscribe
                  </>
                )}
              </button>
              
              <a 
                href="https://www.youtube.com/@Nexora-k9x" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-white/10 hover:border-white/20 bg-[#141A22] hover:bg-white/5 text-gray-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Channel Link
              </a>
            </div>
          </div>
        </motion.div>

        {/* Video Filter and Search Row */}
        <div className="mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Videos' },
              { id: 'cad', label: 'CAD Designs' },
              { id: 'electronics', label: 'PCBs & Hardware' },
              { id: 'tutorials', label: 'Methodologies' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider font-bold transition-all duration-300 select-none focus:outline-none border-2 rounded-none ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 bg-[#101419]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar inside the video manager */}
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="Filter topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-none border border-white/10 focus:border-emerald-500 text-xs bg-[#101419] text-white placeholder-gray-500 outline-none transition-all font-mono"
            />
            <Search className="w-4 h-4 text-emerald-500/40 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Responsive Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                key={video.id}
                className="group rounded-none bg-[#101419] border border-white/10 overflow-hidden hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
                id={`video-card-${video.id}`}
              >
                {/* Thumbnail Area with Aspect-Ratio 16:9 */}
                <div 
                  onClick={() => triggerSimulatedPlayback(video)}
                  className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer select-none border-b border-white/5"
                >
                  {video.thumbnailUrl ? (
                    <>
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Play Overlay icon on Hover */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-none bg-[#101419]/95 flex items-center justify-center text-emerald-400 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-md">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      {/* Duration Label */}
                      <div className="absolute bottom-2 right-3 px-1.5 py-0.5 bg-black/85 text-white font-mono text-[9px] tracking-wider rounded font-medium select-none z-10">
                        {video.duration}
                      </div>
                    </>
                  ) : (
                    /* Decorative circuit design based on video categories */
                    <div className={`absolute inset-0 bg-gradient-to-br ${video.bgGradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:12px_12px]" />
                      <div className="absolute inset-0 bg-radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.03),transparent)" />
                      
                      {/* SVG graphics representative of categories */}
                      <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
                        {renderIcon(video.iconName || '')}
                      </div>

                      {/* Tiny Pixel crosshairs in the corners of thumbnails */}
                      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
                      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />

                      {/* Play Overlay icon on Hover */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-none bg-[#101419]/95 flex items-center justify-center text-emerald-400 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-sm">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Duration Label */}
                      <div className="absolute bottom-2 right-3 px-1.5 py-0.5 bg-black/85 text-white font-mono text-[9px] tracking-wider rounded font-medium select-none z-10">
                        {video.duration}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info Content */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-[#101419]">
                  <div>
                    {/* Category Stamp */}
                    <span className="text-[9px] font-bold text-emerald-400 tracking-[0.15em] uppercase font-mono block mb-1.5">
                      // {video.category}
                    </span>
                    
                    <h4 
                      onClick={() => triggerSimulatedPlayback(video)}
                      className="text-base font-bold text-white tracking-tight mb-2 font-display group-hover:text-emerald-400 transition-colors duration-300 cursor-pointer text-ellipsis line-clamp-2 uppercase"
                    >
                      {video.title}
                    </h4>
                    
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                      {video.description}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-auto font-mono">
                    {/* Metadata indicators */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {video.uploadDate}
                      </span>
                      <span>{video.views}</span>
                    </div>

                    {/* Direct Trigger to watch link */}
                    <a 
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-none border border-white/10 hover:border-emerald-500/30 bg-[#141A22] hover:bg-white/5 text-gray-300 hover:text-emerald-400 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all select-none"
                    >
                      Watch on YouTube
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#101419] border border-white/10 rounded-none">
            <span className="text-sm font-mono text-gray-500">NO VIDEOS MATCHED YOUR SELECTION</span>
          </div>
        )}

        {/* View All YouTube Videos Action Banner */}
        <div className="mt-16 text-center flex flex-col items-center justify-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0" />
          
          <div className="px-6 bg-[#0B0F14] relative z-10 flex flex-col items-center">
            <a 
              href="https://www.youtube.com/@Nexora-k9x" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#101419] border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-none select-none cursor-pointer rounded-none font-mono"
            >
              <Youtube className="w-4 h-4 fill-current" />
              View All Videos
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-3">
              LINK: WWW.YOUTUBE.COM/@NEXORA-K9X
            </span>
          </div>
        </div>

      </div>

      {/* Simulated Premium Pixel Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#101419] border border-white/10 rounded-none shadow-2xl overflow-hidden relative"
            >
              {/* Header of Modal styled like a CRT hardware readout */}
              <div className="px-6 py-3 bg-[#141A22] border-b border-white/10 flex items-center justify-between text-white font-mono text-[10px] tracking-widest select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>BROADCAST_STREAM: {selectedVideo.id.toUpperCase()}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedVideo(null);
                    setIsPlayingSimulated(false);
                  }}
                  className="text-gray-400 hover:text-emerald-400 hover:bg-white/5 px-2 py-1 uppercase text-[10px] border border-white/10 font-bold"
                >
                  DISCONNECT
                </button>
              </div>

              {/* Player Body View */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                
                {/* Big Screen */}
                <div className="w-full md:w-3/5 shrink-0">
                  <div className="relative aspect-video rounded-none bg-black border border-white/5 flex flex-col items-center justify-center text-center overflow-hidden select-none">
                    
                    {!(selectedVideo.id.startsWith('featured-') || selectedVideo.id.startsWith('vid-')) ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`} 
                        className="w-full h-full border-0 absolute inset-0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                        id={`youtube-player-frame-${selectedVideo.id}`}
                      />
                    ) : (
                      <>
                        {/* Simulated scanning filters */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] z-30 opacity-40 pointer-events-none" />
                        
                        {isPlayingSimulated ? (
                          <>
                            {/* Audio Wave animation or custom grid loader */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0F171A] to-[#040608] flex flex-col items-center justify-center p-6 text-center">
                              <div className="flex items-center justify-center gap-1.5 h-16 mb-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                                  <div 
                                    key={bar} 
                                    className="w-1.5 bg-emerald-500 rounded-none animate-[pulse_1s_infinite]" 
                                    style={{ 
                                      height: `${Math.floor(Math.random() * 50) + 15}px`,
                                      animationDelay: `${bar * 120}ms`
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-mono text-emerald-500 tracking-[0.25em] uppercase">
                                STREAMING CAD DATA...
                              </span>
                              <span className="text-[9px] font-mono text-gray-500 mt-2">
                                TIME REMAINING: {selectedVideo.duration} • QUALITY: 1080P_HD
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
                              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                                <Play className="w-6 h-6 fill-current ml-0.5" />
                              </div>
                              <span className="text-xs font-mono text-gray-400 tracking-wider">
                                BROADCAST SIGNAL STABLE
                              </span>
                              <button 
                                onClick={() => setIsPlayingSimulated(true)}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white font-mono text-[10px] tracking-widest uppercase hover:bg-emerald-700"
                              >
                                RUN SIGNAL
                              </button>
                            </div>
                          </>
                        )}

                        {/* Overlay metadata */}
                        <div className="absolute top-4 left-4 text-[9px] text-gray-500 font-mono text-left z-20">
                          SYS: {selectedVideo.id}<br />
                          BUFFER: READY
                        </div>

                        {/* Interactive Custom Simulated Player HUD Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 flex flex-col gap-2 z-40 border-t border-white/5 font-mono text-[9px] text-gray-400">
                          {/* Interactive Progress timeline */}
                          <div className="w-full h-1 bg-white/15 rounded-none overflow-hidden relative cursor-pointer">
                            <div className="h-full bg-emerald-500" style={{ width: `${isPlayingSimulated ? simulatedProgress : 0}%` }} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setIsPlayingSimulated(!isPlayingSimulated)}
                                className="text-white hover:text-emerald-500 uppercase text-[9px]"
                              >
                                {isPlayingSimulated ? 'PAUSE' : 'PLAY'}
                              </button>
                              <span>VOL: 100%</span>
                            </div>
                            <div>
                              <span>{isPlayingSimulated ? `${Math.floor(simulatedProgress / 100 * parseFloat(selectedVideo.duration))}:00` : '0:00'} / {selectedVideo.duration}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </div>

                {/* Info and action panel inside modal */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest uppercase block mb-2">
                      // NOW STREAMING
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug font-display uppercase">
                      {selectedVideo.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">
                      Uploaded: {selectedVideo.uploadDate} • {selectedVideo.views}
                    </p>
                    <p className="text-xs text-gray-400 mt-4 leading-relaxed max-h-40 overflow-y-auto font-sans">
                      {selectedVideo.description}
                    </p>

                    <div className="p-4 bg-emerald-950/20 border border-white/5 rounded-none mt-6 font-mono text-[10px] text-gray-400 flex flex-col gap-1 select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500" />
                        <span>STREAM RESOLUTION: <strong className="text-white">AUTO (1080p60)</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500" />
                        <span>CHANNEL BROADCAST: <strong className="text-white">NEXORA</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 font-mono">
                    <a 
                      href={selectedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 rounded-none"
                    >
                      <Youtube className="w-4 h-4 fill-current" />
                      Watch on Real YouTube
                    </a>
                    <button 
                      onClick={() => {
                        setSelectedVideo(null);
                        setIsPlayingSimulated(false);
                      }}
                      className="px-5 py-3 border border-white/10 hover:border-emerald-500/30 bg-[#141A22] text-gray-300 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider text-center rounded-none"
                    >
                      Close Player
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
