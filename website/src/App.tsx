import { useState } from 'react';
import { Header } from './components/Header';
import { type NavTab } from './components/Navigation';
import { InfoPanel } from './components/InfoPanel';
import { Home } from './pages/Home';
import { Biome } from './pages/Biome';
import { Fires } from './pages/Fires';
import { FoodWeb } from './pages/FoodWeb';
import { Recovery } from './pages/Recovery';
import { Cycles } from './pages/Cycles';
import { Technology } from './pages/Technology';
import { type ForestMode } from './scenes/ForestScene';
import { type InteractiveData } from './components/InteractiveObject';
import './styles/global.css';

/**
 * App Principal
 * Gerencia todas as 7 seções do Museu Científico Futurista da Mata Atlântica.
 */
export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [forestMode, setForestMode] = useState<ForestMode>('preserved');
  const [selectedData, setSelectedData] = useState<InteractiveData | null>(null);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'fires') {
      setForestMode('burned');
    }
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            mode={forestMode}
            onModeChange={setForestMode}
            onSelectData={setSelectedData}
            selectedData={selectedData}
          />
        );
      case 'fires':
        return (
          <Fires
            mode={forestMode}
            onModeChange={setForestMode}
            onSelectData={setSelectedData}
            selectedData={selectedData}
          />
        );
      case 'biome':
        return <Biome onNavigate={handleTabChange} />;
      case 'foodweb':
        return <FoodWeb />;
      case 'recovery':
        return <Recovery />;
      case 'cycles':
        return <Cycles />;
      case 'tech':
        return <Technology />;
      default:
        return (
          <Home
            mode={forestMode}
            onModeChange={setForestMode}
            onSelectData={setSelectedData}
            selectedData={selectedData}
          />
        );
    }
  };

  // Nas telas que já possuem seus próprios painéis 3D integrados, ocultamos o painel lateral fixo antigo
  const hasEmbeddedPanels = ['home', 'fires', 'foodweb', 'recovery', 'cycles', 'tech'].includes(activeTab);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: forestMode === 'burned' && activeTab === 'fires' ? '#120c09' : 'var(--bg-dark)',
        transition: 'background-color 0.5s ease',
      }}
    >
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <div
        style={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 'calc(100vh - 75px)',
        }}
      >
        <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
          {renderCurrentView()}
        </main>

        {!hasEmbeddedPanels && (
          <InfoPanel
            selectedData={selectedData}
            onClearSelection={() => setSelectedData(null)}
            isBurnedMode={forestMode === 'burned'}
          />
        )}
      </div>
    </div>
  );
}

export default App;
