import React from 'react';

export type NavTab = 'home' | 'biome' | 'fires' | 'foodweb' | 'recovery' | 'cycles' | 'tech';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const MENU_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'home', label: 'Início' },
  { id: 'biome', label: 'O Bioma' },
  { id: 'fires', label: 'Queimadas' },
  { id: 'foodweb', label: 'Cadeia Alimentar' },
  { id: 'recovery', label: 'Recuperação' },
  { id: 'cycles', label: 'Ciclos Naturais' },
  { id: 'tech', label: 'Tecnologia' },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      {MENU_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              background: isActive ? 'var(--green-primary)' : 'rgba(7, 26, 20, 0.6)',
              color: isActive ? 'var(--white-text)' : 'rgba(241, 245, 242, 0.75)',
              border: isActive
                ? '1px solid var(--green-glow)'
                : '1px solid rgba(101, 230, 165, 0.2)',
              boxShadow: isActive ? '0 0 10px rgba(101, 230, 165, 0.35)' : 'none',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--blue-tech)';
                e.currentTarget.style.color = 'var(--white-text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(101, 230, 165, 0.2)';
                e.currentTarget.style.color = 'rgba(241, 245, 242, 0.75)';
              }
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
