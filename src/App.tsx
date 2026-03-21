import { useState, useMemo, useEffect } from 'react'
import { Search, Trophy, Menu, X, ChevronRight, Image as ImageIcon, ChevronLeft, Maximize2, Sun, Moon } from 'lucide-react'
import teamsData from './teams.json'
import imagesData from './images.json'

interface Team {
  id: string;
  name: string;
  path: string;
}

const typedImagesData = imagesData as Record<string, string[]>;

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

const extractYear = (path: string) => {
  const match = path.match(/(?:19|20)\d{2}/g);
  return match ? match[match.length - 1] : 'Other';
};

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [shuffledTeams, setShuffledTeams] = useState<Team[]>([])
  const [isDark, setIsDark] = useState(false)

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
    const grouped: Record<string, string[]> = {};
    
    images.forEach(img => {
      const year = extractYear(img);
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(img);
    });
    
    return grouped;
  }, [selectedTeam]);

  const sortedYears = useMemo(() => {
    return Object.keys(imagesByYear).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return b.localeCompare(a); // Descending order
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
    const parts = imgPath.split('/');
    const filename = parts.pop();
    return [...parts, 'thumbnails', filename].join('/');
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
        
        {/* Simple Text Header (No Banner Image) */}
        <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-50 transition-colors duration-200">
          <div className="mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedTeam(null); setSelectedYear(null); }}>
               <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">F1 Collection</h1>
            </div>
            <div className="flex items-center gap-6">
               <button 
                 className="text-xs font-bold tracking-[0.2em] uppercase hover:text-red-600 dark:hover:text-red-500 transition-colors"
                 onClick={() => { setSelectedTeam(null); setSelectedYear(null); }}
               >
                 Home
               </button>
               <button className="text-xs font-bold tracking-[0.2em] uppercase hover:text-red-600 dark:hover:text-red-500 transition-colors hidden sm:block">
                 Contato
               </button>
               {/* Dark/Light Mode Toggle */}
               <button 
                 onClick={() => setIsDark(!isDark)}
                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                 title="Toggle Theme"
               >
                 {isDark ? <Sun size={18} /> : <Moon size={18} />}
               </button>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar */}
          {!selectedTeam && (
            <aside className="w-40 lg:w-48 flex-shrink-0 overflow-y-auto px-2 py-4 custom-scrollbar border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <nav className="flex flex-col gap-0.5">
                {leftTeams.map(team => (
                  <button 
                    key={team.id} 
                    onClick={() => handleSelectTeam(team)}
                    className="text-left text-xs font-semibold text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 px-3 py-1.5 rounded transition-all truncate"
                    title={team.name.replace(/\r/g, '').trim()}
                  >
                    {team.name.replace(/\r/g, '').trim()}
                  </button>
                ))}
              </nav>
            </aside>
          )}

          {/* Center Content */}
          <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 transition-colors duration-200 relative flex flex-col">
            
            {/* Search Filter (Spans whole top of center section) */}
            {!selectedTeam && (
              <div className="w-full flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors duration-200">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 focus-within:text-red-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Filter teams..."
                    className="w-full bg-transparent py-4 pl-14 pr-6 text-lg focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 transition-all placeholder:text-gray-400 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

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
                      <div className="w-24 h-24 sm:w-32 sm:h-32 p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform duration-300">
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
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {imagesByYear[selectedYear]?.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setModalImage(img)}
                            className="group relative aspect-square bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl hover:border-red-500 dark:hover:border-red-500 transition-all duration-300"
                          >
                            <img 
                              src={getThumbnailPath(img)} 
                              onError={(e) => { e.currentTarget.src = img; }}
                              alt="" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                              <Maximize2 size={24} className="text-white transform scale-50 group-hover:scale-100 transition-transform duration-300 drop-shadow-md" />
                              <span className="text-white text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100">Ampliar</span>
                            </div>
                          </div>
                        ))}
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
                  {/* Home Page: Super Dense Logos Center (Non-Alpha, NO gaps) */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-0 items-center justify-items-center w-full">
                    {gridTeams.map(team => (
                      <div 
                        key={team.id}
                        onClick={() => handleSelectTeam(team)}
                        className="group w-full aspect-[4/3] flex items-center justify-center cursor-pointer transition-all duration-300 hover:z-20 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 relative"
                        title={team.name.replace(/\r/g, '').trim()}
                      >
                        {getTeamLogo(team.id) ? (
                          <img src={getTeamLogo(team.id)!} alt={team.id} className="max-w-[85%] max-h-[85%] object-contain filter group-hover:scale-125 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal dark:opacity-90 dark:group-hover:opacity-100" />
                        ) : (
                          <span className="text-[9px] font-black text-gray-300 dark:text-gray-600 group-hover:text-red-600 dark:group-hover:text-red-500 truncate max-w-full px-1 uppercase tracking-wider">{team.name.replace(/\r/g, '').trim()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          {!selectedTeam && (
            <aside className="w-40 lg:w-48 flex-shrink-0 overflow-y-auto px-2 py-4 custom-scrollbar border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <nav className="flex flex-col gap-0.5">
                {rightTeams.map(team => (
                  <button 
                    key={team.id} 
                    onClick={() => handleSelectTeam(team)}
                    className="text-left text-xs font-semibold text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 px-3 py-1.5 rounded transition-all truncate"
                    title={team.name.replace(/\r/g, '').trim()}
                  >
                    {team.name.replace(/\r/g, '').trim()}
                  </button>
                ))}
              </nav>
            </aside>
          )}
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
              src={modalImage} 
              alt="F1 Record"
              className="relative max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-500 bg-white" 
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none bg-black bg-opacity-60 px-6 py-2 rounded-full backdrop-blur-md">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                {selectedTeam?.name.replace(/\r/g, '')} <span className="text-red-500 mx-2">|</span> {selectedYear}
              </p>
            </div>
          </div>
        )}
      </div>
  )
}

export default App

