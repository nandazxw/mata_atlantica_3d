import React, { useEffect, useRef, useState } from 'react';
import { TechScene } from '../scenes/TechScene';
import {
  TECH_SECTIONS,
  MAP_LAYERS,
  SIMULATED_METRICS,
  type TechSectionId,
  type MapLayer
} from '../data/techData';

export const Technology: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<TechScene | null>(null);

  const [activeSectionId, setActiveSectionId] = useState<TechSectionId>('satelites');
  const [layers, setLayers] = useState<MapLayer[]>(MAP_LAYERS);
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true);

  // Inicialização da cena 3D
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new TechScene(mountRef.current, 'satelites');
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Mudança de módulo tecnológico
  const handleSectionSelect = (id: TechSectionId) => {
    setActiveSectionId(id);
    if (sceneRef.current) {
      sceneRef.current.setSection(id);
    }
  };

  // Alternar camadas cartográficas do satélite
  const handleToggleLayer = (layerId: string) => {
    const updated = layers.map((layer) => {
      if (layer.id === layerId) {
        const nextState = !layer.active;
        if (sceneRef.current) {
          sceneRef.current.toggleLayer(layerId, nextState);
        }
        return { ...layer, active: nextState };
      }
      return layer;
    });
    setLayers(updated);
  };

  const currentSection = TECH_SECTIONS[activeSectionId];

  // Nomes curtos e objetivos para as abas sem quebrar texto
  const tabShortNames: Record<TechSectionId, string> = {
    satelites: 'Satélites',
    drones: 'Drones',
    ia: 'Inteligência Artificial',
    alertas: 'Alertas & Telemetria',
    restauracao: 'Restauração'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 75px)', overflow: 'hidden', background: '#050e09' }}>
      {/* Canvas 3D */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* CABEÇALHO SUPERIOR CENTRAL */}
      <div
        style={{
          position: 'absolute',
          top: '0.8rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 15,
          maxWidth: '92vw',
        }}
      >
        {/* Título & Badge Educativo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            background: 'rgba(5, 14, 9, 0.92)',
            border: '1px solid rgba(66, 191, 232, 0.35)',
            borderRadius: '24px',
            padding: '0.35rem 1.1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>🔬</span>
          <span style={{ color: 'var(--blue-tech)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Tecnologia a Favor da Natureza
          </span>
          <span
            style={{
              background: 'rgba(255, 113, 61, 0.15)',
              border: '1px solid rgba(255, 113, 61, 0.5)',
              color: 'var(--alert-orange)',
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '0.12rem 0.55rem',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Dados Didáticos Simulados
          </span>
        </div>

        {/* Barra de Módulos Tecnológicos */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            background: 'rgba(7, 26, 20, 0.92)',
            padding: '0.3rem',
            borderRadius: '16px',
            border: '1px solid var(--panel-border)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            maxWidth: '90vw',
            overflowX: 'auto',
          }}
        >
          {Object.values(TECH_SECTIONS).map((sec) => {
            const isSelected = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleSectionSelect(sec.id)}
                style={{
                  background: isSelected ? 'var(--blue-tech)' : 'transparent',
                  color: isSelected ? '#050e09' : 'var(--white-text)',
                  border: isSelected ? '1px solid var(--blue-tech)' : '1px solid transparent',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{sec.icon}</span>
                <span>{tabShortNames[sec.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DICA DE NAVEGAÇÃO 3D */}
      <div
        style={{
          position: 'absolute',
          top: '5.2rem',
          right: '1.2rem',
          background: 'rgba(5, 14, 9, 0.75)',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid rgba(101, 230, 165, 0.25)',
          color: '#cbd5e0',
          fontSize: '0.72rem',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        🖱️ Arraste p/ rotacionar • Scroll p/ zoom 3D
      </div>

      {/* PAINEL LATERAL ESQUERDO: EXPLICAÇÃO CIENTÍFICA (RETRÁTIL) */}
      <div
        style={{
          position: 'absolute',
          top: '5.5rem',
          left: '1.2rem',
          width: isLeftPanelOpen ? '360px' : 'auto',
          maxHeight: 'calc(100vh - 220px)',
          background: 'rgba(7, 26, 20, 0.94)',
          border: '1px solid rgba(66, 191, 232, 0.35)',
          borderRadius: '12px',
          padding: isLeftPanelOpen ? '1rem 1.1rem' : '0.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          zIndex: 20,
          color: 'var(--white-text)',
          overflowY: isLeftPanelOpen ? 'auto' : 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isLeftPanelOpen ? '0.6rem' : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '1.3rem' }}>{currentSection.icon}</span>
            {isLeftPanelOpen && (
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--blue-tech)', lineHeight: '1.2' }}>
                  {currentSection.title}
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--green-glow)' }}>
                  {currentSection.subtitle}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            title={isLeftPanelOpen ? 'Recolher painel' : 'Expandir painel'}
            style={{
              background: 'rgba(66, 191, 232, 0.15)',
              border: '1px solid rgba(66, 191, 232, 0.4)',
              color: 'var(--blue-tech)',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {isLeftPanelOpen ? '◀' : '▶ Detalhes'}
          </button>
        </div>

        {isLeftPanelOpen && (
          <>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e0', lineHeight: '1.45', margin: '0.6rem 0' }}>
              {currentSection.description}
            </p>

            {/* Aplicações Práticas Didáticas */}
            <div style={{ marginTop: '0.7rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Aplicações Ecológicas & Práticas:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {currentSection.practicalApplications.map((app, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(5, 14, 9, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--green-glow)', marginBottom: '0.15rem' }}>
                      {app.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#c5d4cd', lineHeight: '1.35' }}>
                      {app.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota Científica & Fontes Oficiais */}
            <div
              style={{
                marginTop: '0.8rem',
                padding: '0.6rem',
                background: 'rgba(66, 191, 232, 0.08)',
                borderLeft: '3px solid var(--blue-tech)',
                borderRadius: '4px',
                fontSize: '0.73rem',
                color: '#cbd5e0',
                lineHeight: '1.35',
              }}
            >
              <strong style={{ color: 'var(--blue-tech)' }}>Referencial Científico: </strong>
              {currentSection.scientificNote}
              <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                Fontes: {currentSection.officialSources.join(', ')}
              </div>
            </div>
          </>
        )}
      </div>

      {/* CONTROLE DE CAMADAS CARTOGRÁFICAS (Visível no modo Satélites e Sistemas de Alerta) */}
      {(activeSectionId === 'satelites' || activeSectionId === 'alertas') && (
        <div
          style={{
            position: 'absolute',
            top: '5.5rem',
            right: '1.2rem',
            width: '260px',
            background: 'rgba(7, 26, 20, 0.94)',
            border: '1px solid rgba(101, 230, 165, 0.35)',
            borderRadius: '12px',
            padding: '0.85rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 15,
            color: 'var(--white-text)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--green-glow)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Camadas do Mapa Orbital
            </h4>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Ativar/Ocultar</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {layers.map((layer) => (
              <label
                key={layer.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.55rem',
                  background: layer.active ? 'rgba(101, 230, 165, 0.1)' : 'rgba(5, 14, 9, 0.5)',
                  border: `1px solid ${layer.active ? layer.color : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={layer.active}
                  onChange={() => handleToggleLayer(layer.id)}
                  style={{ cursor: 'pointer', accentColor: layer.color }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: layer.active ? layer.color : '#94a3b8' }}>
                    {layer.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0', lineHeight: '1.2' }}>
                    {layer.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: '#718096', textAlign: 'center' }}>
            Simulação didática inspirada no MapBiomas Alerta.
          </div>
        </div>
      )}

      {/* BARRA INFERIOR DE TELEMETRIA DEMONSTRATIVA (HUD DE MONITORAMENTO) */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.8rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '94%',
          maxWidth: '1100px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.6rem',
          zIndex: 15,
        }}
      >
        {SIMULATED_METRICS.map((metric, idx) => {
          const statusColor =
            metric.status === 'otimo' ? 'var(--green-glow)' :
            metric.status === 'alerta' ? 'var(--alert-orange)' : 'var(--blue-tech)';

          return (
            <div
              key={idx}
              style={{
                background: 'rgba(7, 26, 20, 0.92)',
                border: `1px solid ${statusColor}44`,
                borderTop: `3px solid ${statusColor}`,
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {metric.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', margin: '0.15rem 0' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: statusColor, fontFamily: 'monospace' }}>
                  {metric.value}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#cbd5e0' }}>{metric.unit}</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#a0aec0', lineHeight: '1.25' }}>
                {metric.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÃO FLUTUANTE PARA CONSULTAR FONTES CIENTÍFICAS */}
      <button
        onClick={() => setShowSourcesModal(true)}
        style={{
          position: 'absolute',
          bottom: '0.8rem',
          right: '1.2rem',
          background: 'rgba(5, 14, 9, 0.92)',
          border: '1px solid var(--blue-tech)',
          color: 'var(--blue-tech)',
          padding: '0.45rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
        }}
      >
        <span>📚</span>
        <span>Fontes & Instituições</span>
      </button>

      {/* MODAL CIENTÍFICO DE INSTITUIÇÕES E CONCEITOS */}
      {showSourcesModal && (
        <div
          onClick={() => setShowSourcesModal(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#071A14',
              border: '1px solid var(--blue-tech)',
              borderRadius: '12px',
              maxWidth: '650px',
              width: '100%',
              padding: '1.8rem',
              color: 'var(--white-text)',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--blue-tech)', fontSize: '1.3rem' }}>
                Instituições Oficiais & Dados Científicos
              </h3>
              <button
                onClick={() => setShowSourcesModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#c5d4cd', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <p>
                As informações deste museu são didáticas e baseadas nas melhores práticas de monitoramento ambiental conduzidas por instituições científicas no Brasil:
              </p>
              <div>
                <strong style={{ color: 'var(--green-glow)' }}>• INPE (Instituto Nacional de Pesquisas Espaciais):</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#cbd5e0' }}>
                  Opera o Programa Queimadas e o sistema DETER/PRODES, pioneiros mundiais no uso de sensores orbitais para detectar anomalias térmicas e desmatamento.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--green-glow)' }}>• MapBiomas:</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#cbd5e0' }}>
                  Iniciativa multi-institucional que processa séries históricas de imagens de satélite com Inteligência Artificial na nuvem, mapeando o uso da terra em todo o território nacional.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--green-glow)' }}>• SOS Mata Atlântica & Pacto pela Restauração:</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#cbd5e0' }}>
                  Organizações e redes dedicadas à restauração da integridade ecológica do bioma, conectando corredores ecológicos prioritários e promovendo semeadura com espécies nativas.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--alert-orange)' }}>• Aviso sobre Dados Simulados:</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#cbd5e0' }}>
                  Os números e valores demonstrados nos painéis de telemetria desta página são exemplos ilustrativos para fins pedagógicos e de conscientização, não representando medições em tempo real de uma estação física específica.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setShowSourcesModal(false)}
                style={{
                  background: 'var(--blue-tech)',
                  color: '#050e09',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
