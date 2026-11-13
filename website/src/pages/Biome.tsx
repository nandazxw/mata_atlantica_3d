import React, { useState } from 'react';
import { SPECIES_DATA } from '../data/organisms';
import { type NavTab } from '../components/Navigation';

interface BiomeProps {
  onNavigate?: (tab: NavTab) => void;
}

export const Biome: React.FC<BiomeProps> = ({ onNavigate }) => {
  const speciesList = Object.values(SPECIES_DATA);
  const [filter, setFilter] = useState<'all' | 'flora' | 'fauna' | 'recurso'>('all');

  const filteredSpecies = speciesList.filter((sp) => {
    if (filter === 'flora') return sp.kingdom === 'Plantae';
    if (filter === 'fauna') return sp.kingdom === 'Animalia';
    if (filter === 'recurso') return sp.kingdom === 'Geológico/Hídrico';
    return true;
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', color: 'var(--white-text)' }}>
      {/* Banner de Apresentação com Identidade Futurista */}
      <div
        style={{
          background: 'rgba(7, 26, 20, 0.85)',
          border: '1px solid var(--panel-border)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🌿</span>
          <h2 style={{ color: 'var(--green-glow)', margin: 0, fontSize: '1.6rem' }}>
            Biodiversidade & Riqueza da Mata Atlântica
          </h2>
        </div>
        <p style={{ lineHeight: '1.6', color: '#cbd5e0', fontSize: '0.95rem', margin: '0.6rem 0 1.2rem 0' }}>
          A Mata Atlântica é um dos principais <em>hotspots</em> mundiais de conservação biológica, abrigando mais de
          20.000 espécies vegetais (cerca de 35% de todas as espécies brasileiras) e centenas de espécies de vertebrados
          endêmicos. O bioma exerce serviços ecossistêmicos vitais, garantindo o abastecimento hídrico e a regulação climática
          para mais de 145 milhões de habitantes no Brasil.
        </p>

        {/* Botões de Ação para Navegação Rápida às Experiências 3D */}
        {onNavigate && (
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'var(--green-primary)',
                color: 'var(--white-text)',
                border: '1px solid var(--green-glow)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🌲</span>
              <span>Explorar Floresta Preservada 3D</span>
            </button>
            <button
              onClick={() => onNavigate('fires')}
              style={{
                background: 'rgba(255, 113, 61, 0.15)',
                color: 'var(--alert-orange)',
                border: '1px solid var(--alert-orange)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🔥</span>
              <span>Ver Impacto das Queimadas 3D</span>
            </button>
            <button
              onClick={() => onNavigate('recovery')}
              style={{
                background: 'rgba(66, 191, 232, 0.15)',
                color: 'var(--blue-tech)',
                border: '1px solid var(--blue-tech)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🌱</span>
              <span>Ver Sucessão & Regeneração 3D</span>
            </button>
          </div>
        )}
      </div>

      {/* Filtros de Categorias */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--blue-tech)' }}>
          Espécies-Chave Catalogadas no Museu
        </h3>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { id: 'all', label: 'Todas' },
            { id: 'flora', label: 'Flora' },
            { id: 'fauna', label: 'Fauna' },
            { id: 'recurso', label: 'Recursos Hídricos' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as typeof filter)}
              style={{
                background: filter === item.id ? 'var(--blue-tech)' : 'rgba(7, 26, 20, 0.6)',
                color: filter === item.id ? '#050e09' : 'var(--white-text)',
                border: filter === item.id ? '1px solid var(--blue-tech)' : '1px solid var(--panel-border)',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: filter === item.id ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Espécies Catalogadas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
        {filteredSpecies.map((species) => (
          <div
            key={species.id}
            style={{
              background: 'var(--panel-bg)',
              padding: '1.3rem',
              borderRadius: '10px',
              border: '1px solid var(--panel-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  color: 'var(--blue-tech)',
                  border: '1px solid var(--blue-tech)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {species.category}
              </span>
              <h3 style={{ margin: '0.5rem 0 0.2rem 0', color: 'var(--white-text)', fontSize: '1.2rem' }}>
                {species.popularName}
              </h3>
              {species.scientificName && (
                <p style={{ fontStyle: 'italic', color: 'var(--green-glow)', fontSize: '0.88rem', margin: 0 }}>
                  {species.scientificName}
                </p>
              )}
            </div>

            <p style={{ fontSize: '0.86rem', color: '#c5d4cd', margin: '0.4rem 0', lineHeight: 1.5 }}>
              {species.characteristics}
            </p>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: '0.6rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              {species.ecologicalImportance && (
                <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>
                  <strong style={{ color: 'var(--green-glow)' }}>Papel Ecológico: </strong>
                  {species.ecologicalImportance}
                </div>
              )}

              {species.conservationStatus && (
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255, 113, 61, 0.15)',
                      color: 'var(--alert-orange)',
                      border: '1px solid rgba(255, 113, 61, 0.3)',
                      display: 'inline-block',
                    }}
                  >
                    Status: {species.conservationStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé Científico e Fontes */}
      <div
        style={{
          marginTop: '2.5rem',
          padding: '1.2rem',
          background: 'rgba(7, 26, 20, 0.6)',
          borderLeft: '4px solid var(--blue-tech)',
          borderRadius: '6px',
          fontSize: '0.82rem',
          color: '#cbd5e0',
          lineHeight: '1.5',
        }}
      >
        <strong style={{ color: 'var(--blue-tech)' }}>Fontes & Referências de Biodiversidade: </strong>
        Dados taxonômicos e de conservação alinhados com o <em>Livro Vermelho da Fauna Brasileira Ameaçada de Extinção (ICMBio)</em>,
        a <em>Flora e Funga do Brasil (Jardim Botânico do Rio de Janeiro)</em> e relatórios da Fundação <em>SOS Mata Atlântica</em>.
      </div>
    </div>
  );
};
