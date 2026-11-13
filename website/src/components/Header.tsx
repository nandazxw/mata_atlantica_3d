import React from 'react';
import { Navigation, type NavTab } from './Navigation';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1.8rem',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--panel-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      {/* Título e Subtítulo (clicável para retornar à Home) */}
      <div
        onClick={() => onTabChange('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        title="Voltar à Página Inicial"
      >
        {/* Ponto indicador de status operacional */}
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--green-glow)',
            boxShadow: '0 0 10px var(--green-glow)',
            flexShrink: 0,
          }}
        />
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '2px',
              color: 'var(--white-text)',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            MATA ATLÂNTICA <span style={{ color: 'var(--green-glow)' }}>3D</span>
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--blue-tech)',
              letterSpacing: '0.8px',
              margin: 0,
              fontWeight: 500,
            }}
          >
            Um ecossistema em transformação
          </p>
        </div>
      </div>

      {/* Menu com as 6 opções solicitadas */}
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
    </header>
  );
};
