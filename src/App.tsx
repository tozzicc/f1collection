import { useState, useMemo, useEffect } from 'react'
import { Search, Trophy, Menu, X, ChevronRight, Image as ImageIcon, ChevronLeft, Maximize2, Sun, Moon } from 'lucide-react'
import teamsData from './teams.json'
import imagesData from './images.json'
import f1Logo from './Imagens/formula-1-logo-0.png'

interface Team {
  id: string;
  name: string;
  path: string;
}

interface ImageObject {
  path: string;
  description: string;
}

const typedImagesData = imagesData as Record<string, ImageObject[]>;

// Logo mapping based on available files in old_site/logos
const logoMapping: Record<string, string> = {
  alfa: 'alfa.gif',
  alferes: 'temp.tmp', // Placeholder
  alpha: 'AlphaTauri.gif',
  alpine: 'Alpine_F1.gif',
  andrea: 'andrea.gif',
  arro: 'arrows.gif',
  aston_martin: 'AstonMartin_F1.gif',
  auto: 'auto.gif',
  bar: 'BAR.jpg',
  bene: 'benetton.jpg',
  brab: 'Brabham.jpg',
  braw: 'brawn.jpg',
  brm: 'brm.gif',
  buga: 'bugatti.gif',
  bwt: 'bwt.png',
  caterham: 'caterhamf1.gif',
  coloni: 'temp.tmp',
  coop: 'cooper.gif',
  coper: 'copersucar.gif',
  dall: 'dallara.gif',
  deto: 'detomaso.gif',
  eag: 'eagle.png',
  ensign: 'Ensign.gif',
  ferr: 'Ferrari.jpg',
  fiat: 'fiat.gif',
  foot: 'footwork.gif',
  force: 'force_india.jpg',
  fort: 'forti.gif',
  hass: 'hass.gif',
  hesketh: 'temp.tmp',
  hill: 'temp.tmp',
  hrt: 'HRTF1.png',
  hond: 'honda.gif',
  iso: 'temp.tmp',
  jagu: 'Jaguar.jpg',
  jord: 'jordan.gif',
  lamb: 'lamb.png',
  lanc: 'lancia.jpg',
  larr: 'larousse.gif',
  lds: 'lds.gif',
  leyt: 'leyton.gif',
  ligi: 'ligier.gif',
  lola: 'lola.gif',
  lotu: 'lotus.gif',
  marc: 'march.gif',
  marussia: 'Marussia.gif',
  mase: 'mase.gif',
  matr: 'matra.gif',
  mcla: 'teammcl_logo.gif',
  merc: 'mercedes.gif',
  merzario: 'merzario.gif',
  mf1: 'mf1.gif',
  mina: 'minardi.gif',
  modena: 'temp.tmp',
  odore: 'odore.gif',
  osella: 'osella.gif',
  paci: 'pacific.gif',
  pors: 'porsche.jpg',
  pros: 'prost.GIF',
  racepoint: 'racepoint.gif',
  rb: 'rb_visa.jpg',
  redb: 'redbulll_racing_logo.jpg',
  rena: 'logo_renaultf1.jpg',
  rial: 'Rial_racing.gif',
  saub: 'sauber.gif',
  simt: 'simtek.gif',
  spy: 'spyker.jpg',
  stew: 'Stewart.gif',
  str: 'toro_rosso.jpg',
  sagu: 'super-aguri.jpg',
  surtees: 'SurteesLogo.gif',
  talb: 'talbot.gif',
  tole: 'toleman.gif',
  toyo: 'toyota.gif',
  tyrr: 'Tyrrel.gif',
  vanw: 'vanwall.gif',
  vir: 'virgin-racing.jpg',
  will: 'williams.jpg',
  wolf: 'wolf.gif',
  zaks: 'zakspeed.gif'
};

const extractYear = (item: string | ImageObject) => {
  const path = typeof item === 'string' ? item : item.path;
  // First check for a hash suffix (added by our sync script)
  const hashMatch = path.match(/#((?:19|20)\d{2})$/);
  if (hashMatch) return hashMatch[1];

  // Otherwise use the existing regex logic
  const match = path.match(/(?:19|20)\d{2}/g);
  return match ? match[match.length - 1] : 'Other';
};

const getFileNameWithoutExtension = (path: string) => {
  if (!path) return '';
  const parts = path.split('/');
  const filenameWithExt = parts[parts.length - 1];
  const lastDotIndex = filenameWithExt.lastIndexOf('.');
  if (lastDotIndex > 0) {
    return filenameWithExt.substring(0, lastDotIndex);
  }
  return filenameWithExt;
};

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [modalImage, setModalImage] = useState<ImageObject | null>(null)
  const [shuffledTeams, setShuffledTeams] = useState<Team[]>([])
  const [isDark, setIsDark] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    // Shuffle the logos for the center grid once on mount
    const seed = [...(teamsData as Team[])].sort(() => Math.random() - 0.5);
    setShuffledTeams(seed);
  }, []);

  // Alpha teams for sidebars
  const filteredAlphaTeams = useMemo(() => {
    return (teamsData as Team[]).filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const halfWay = Math.ceil(filteredAlphaTeams.length / 2);
  const leftTeams = filteredAlphaTeams.slice(0, halfWay);
  const rightTeams = filteredAlphaTeams.slice(halfWay);

  // Shuffled teams for center
  const gridTeams = useMemo(() => {
    const list = shuffledTeams.length > 0 ? shuffledTeams : (teamsData as Team[]);
    return list.filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, shuffledTeams]);

  const imagesByYear = useMemo(() => {
    if (!selectedTeam) return {};
    const images = typedImagesData[selectedTeam.id] || [];
    const grouped: Record<string, ImageObject[]> = {};
    
    images.forEach(img => {
      const year = extractYear(img);
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(img);
    });
    
    return grouped;
  }, [selectedTeam]);

  const sortedYears = useMemo(() => {
    return Object.keys(imagesByYear).sort((a, b) => {
      // Always put 'Other' at the absolute end
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b); // Ascending order
    });
  }, [imagesByYear]);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setSelectedYear(null);
  };

  const getTeamLogo = (teamId: string) => {
    const filename = logoMapping[teamId];
    if (filename && filename !== 'temp.tmp') {
      return `/old_site/logos/${filename}`;
    }
    return null;
  };

  const getThumbnailPath = (imgPath: string) => {
    // Legacy site structure is equipes/team/images/xyz and equipes/team/thumbnails/xyz
    return imgPath.replace('/images/', '/thumbnails/').split('#')[0];
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
      <div className="flex flex-col h-screen overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-gray-100 font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
        
        {/* Modern Premium Two-Tier Header */}
        <header className="w-full bg-white dark:bg-[#0a0a0a] flex-shrink-0 z-50 transition-colors duration-300 sticky top-0 shadow-lg">

          {/* Main Tier: Primary Navigation Bar */}
          <div className="w-full px-6 py-10 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-[1920px] mx-auto transition-all">
            
            {/* Logo area */}
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => { setSelectedTeam(null); setSelectedYear(null); }}>
               <div className="relative">
                 <div className="absolute -inset-2 bg-red-600/10 rounded-lg blur-lg group-hover:bg-red-600/20 transition-all duration-500"></div>
                 <h1 className="relative text-3xl md:text-5xl font-extrabold italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white group-hover:from-red-600 group-hover:to-red-500 transition-all duration-500">
                   F1 <span className="font-light not-italic tracking-normal text-2xl text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-500">COLLECTION</span>
                 </h1>
               </div>
            </div>

            {/* Center Area: Search & Equipes */}
            <div className={`flex-1 w-full max-w-2xl px-4 transition-all duration-700 flex items-center gap-6 ${selectedTeam ? 'opacity-0 invisible scale-95 -translate-y-4' : 'opacity-100 visible scale-100 translate-y-0'}`}>
              
              {/* External Search Icon */}
              <Search className="h-6 w-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />

              {/* Search Box */}
              <div className="flex-1 flex items-center p-2 bg-gray-100/50 dark:bg-white/5 rounded-[2rem] border border-gray-200/50 dark:border-white/10 shadow-inner focus-within:ring-4 focus-within:ring-red-500/10 focus-within:border-red-500/30 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Encontre sua equipe favorita..."
                  className="w-full bg-transparent py-4 px-6 text-lg focus:outline-none text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                />
              </div>
              
              {/* External Equipes Button */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.1em] text-[11px] px-8 py-4 rounded-[1.5rem] hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl active:scale-95 flex items-center gap-2 group/btn whitespace-nowrap"
              >
                EQUIPES <ChevronRight className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-90' : ''}`} size={16} />
              </button>
            </div>

            {/* Right Area: Navigation Links */}
            <div className="flex items-center gap-10">
               {/* Dark/Light Mode Toggle Moved Here */}
               <button 
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-all focus:outline-none"
                title="Alterar Tema"
               >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
               </button>

               <button 
                 className={`text-xs font-black tracking-[0.2em] uppercase transition-all relative group ${!selectedTeam ? 'text-red-600' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                 onClick={() => { setSelectedTeam(null); setSelectedYear(null); }}
               >
                 Início
                 <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-red-600 transition-transform duration-300 ${!selectedTeam ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
               </button>
               <button className="text-xs font-black tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all relative group">
                 Sobre
                 <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-600 transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
               </button>
            </div>
          </div>
          
          {/* Bottom Accent Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
          
          {/* Dropdown Menu Overlay (Spawns below header) */}
          {!selectedTeam && isDropdownOpen && (
              <div className="absolute top-full right-0 left-0 md:left-auto md:right-1/2 md:translate-x-1/2 mt-2 w-full md:w-[600px] bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden custom-scrollbar z-50 md:rounded-2xl transition-all duration-300 animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                  <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Escuderias ({filteredAlphaTeams.length})</span>
                  <button onClick={() => setIsDropdownOpen(false)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                </div>
                <div className="max-h-[50vh] overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredAlphaTeams.length > 0 ? (
                    filteredAlphaTeams.map(team => (
                      <button 
                        key={team.id}
                        onClick={() => {
                          handleSelectTeam(team);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className="text-left px-4 py-2.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all flex items-center justify-between group border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                      >
                        <span className="truncate" title={team.name.replace(/\r/g, '').trim()}>
                          {team.name.replace(/\r/g, '').trim()}
                        </span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-transform -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center flex flex-col items-center opacity-50">
                      <Trophy size={32} className="mb-2"/>
                      <span className="text-xs font-bold tracking-widest uppercase">Nenhuma equipe encontrada</span>
                    </div>
                  )}
                </div>
              </div>
          )}
        </header>

        {/* Main Container */}
        <div className="flex-1 flex overflow-hidden">

          {/* Center Content */}
          <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-[#0a0a0a] transition-colors duration-200 relative flex flex-col">

            <div className="flex-1 p-0 md:p-0">
              {selectedTeam ? (
                <div className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 text-black dark:text-white transition-colors duration-200">
                    <div>
                      <button 
                        onClick={() => { setSelectedTeam(null); setSelectedYear(null); }}
                        className="group flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6 transition-colors text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full"
                      >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar para Equipes
                      </button>
                      <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-2 leading-none whitespace-pre-line text-gray-900 dark:text-gray-100 drop-shadow-sm">
                        {selectedTeam.name.replace(/\r/g, '')}
                      </h2>
                    </div>
                    {getTeamLogo(selectedTeam.id) && (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center transition-transform duration-300">
                        {/* Logo kept on white bg so dark logos stay visible if they don't have transparency or if they are black */}
                        <img src={getTeamLogo(selectedTeam.id)!} alt={selectedTeam.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Years Table */}
                  {sortedYears.length > 0 && (
                    <div className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Temporadas Disponíveis
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {sortedYears.map(year => {
                          const isSelected = selectedYear === year;
                          return (
                            <button
                              key={year}
                              onClick={() => setSelectedYear(isSelected ? null : year)}
                              className={`py-3 px-2 rounded-lg text-sm font-black transition-all border-2 
                                ${isSelected 
                                  ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-lg scale-105 z-10' 
                                  : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected Year Thumbnails */}
                  {selectedYear && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b-2 border-gray-200 dark:border-gray-700 gap-4">
                        <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-black dark:text-white">
                          <span className="text-red-600 mr-2">{selectedYear}</span> 
                          Galeria
                        </h3>
                        <button 
                          onClick={() => setSelectedYear(null)}
                          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white transition-all bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-full shadow-sm"
                        >
                          Fechar Ano <X size={16} className="group-hover:rotate-90 transition-transform" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
                        {imagesByYear[selectedYear]?.map((img, idx) => {
                          const description = img.description;
                          return (
                          <div key={idx} className="flex flex-col gap-2">
                            <div 
                              onClick={() => setModalImage(img)}
                              className="group relative aspect-video bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl hover:border-red-500 dark:hover:border-red-500 transition-all duration-300"
                            >
                              <img 
                                src={getThumbnailPath(img.path)} 
                                onError={(e) => { e.currentTarget.src = img.path; }}
                                alt={description} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                <Maximize2 size={24} className="text-white transform scale-50 group-hover:scale-100 transition-transform duration-300 drop-shadow-md" />
                                <span className="text-white text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100">Ampliar</span>
                              </div>
                            </div>
                            <p className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-snug line-clamp-2 px-1" title={description}>
                                {description}
                            </p>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}
                  
                  {!sortedYears.length && (
                    <div className="py-20 text-center opacity-40">
                        <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
                        <p className="font-bold uppercase tracking-widest text-sm text-gray-600 dark:text-gray-300">Nenhum registro encontrado.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full">
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="bg-white dark:bg-black p-10 sm:p-16 rounded-[3rem] shadow-2xl transition-colors duration-300 flex items-center justify-center">
                    <img src={f1Logo} alt="F1 Logo" className="max-w-[12rem] md:max-w-[20rem] w-full object-contain opacity-90 transition-all duration-500 hover:scale-110" />
                  </div>
                </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Image Modal */}
        {modalImage && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300 backdrop-blur-sm"
            onClick={() => setModalImage(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white hover:rotate-90 transition-all bg-white/10 hover:bg-white/20 p-3 rounded-full z-50 cursor-pointer"
              onClick={() => setModalImage(null)}
            >
              <X size={24} />
            </button>
            
            <img 
              src={modalImage.path} 
              alt="F1 Record"
              className="relative max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-500 bg-white" 
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none bg-black/75 px-16 py-4 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl min-w-[320px]">
              <p className="text-xs font-black tracking-[0.2em] uppercase text-white/90">
                {selectedTeam?.name.replace(/\r/g, '')} <span className="text-red-500 mx-2">|</span> {selectedYear}
              </p>
              <p className="text-[11px] font-semibold text-gray-300 mt-1 uppercase max-w-[80vw] truncate">
                 {modalImage.description}
              </p>
            </div>
          </div>
        )}
      </div>
  )
}

export default App

