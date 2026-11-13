import React, { useEffect, useState } from 'react';
import { type InteractiveData } from '../components/InteractiveObject';
import { type SpeciesData } from '../data/organisms';
import { type FireImpactData } from '../data/impacts';

interface InfoPanelProps {
  selectedData: InteractiveData | null;
  onClearSelection?: () => void;
  isBurnedMode?: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedData,
  onClearSelection,
  isBurnedMode = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Auto-expande quando o visitante clica em qualquer elemento 3D
  useEffect(() => {
    if (selectedData) {
      setCollapsed(false);
    }
  }, [selectedData]);

  const isSpecies = selectedData && 'popularName' in selectedData;
  const isFireImpact = selectedData && 'title' in selectedData;

  const species = isSpecies ? (selectedData as SpeciesData) : null;
  const impact = isFireImpact ? (selectedData as FireImpactData) : null;

  return (
    <aside
      style={{
        width: collapsed ? '44px' : '360px',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(12px)',
        borderLeft: isBurnedMode
          ? '1px solid rgba(255, 113, 61, 0.35)'
          : '1px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease, border-color 0.4s ease',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 25,
        flexShrink: 0,
      }}
    >
      {/* Botão de Alternância (Recolher / Expandir) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expandir painel' : 'Recolher painel'}
        style={{
          background: 'transparent',
          border: 'none',
          color: isBurnedMode ? 'var(--alert-orange)' : 'var(--green-glow)',
          cursor: 'pointer',
          padding: '0.8rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: isBurnedMode
            ? '1px solid rgba(255, 113, 61, 0.35)'
            : '1px solid var(--panel-border)',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}
      >
        {!collapsed && (
          <span
            style={{
              color: isBurnedMode ? 'var(--alert-orange)' : 'var(--green-glow)',
              fontWeight: 600,
            }}
          >
            {selectedData
              ? isFireImpact
                ? '🔥 IMPACTO SELECIONADO'
                : '🔬 BIODADOS SELECIONADOS'
              : isBurnedMode
              ? 'DIAGNÓSTICO DA QUEIMADA'
              : 'DADOS DO ECOSSISTEMA'}
          </span>
        )}
        <span>{collapsed ? '▶' : '◀'}</span>
      </button>

      {/* Conteúdo Dinâmico */}
      {!collapsed && (
        <div
          style={{
            padding: '1.2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            fontSize: '0.88rem',
            lineHeight: 1.55,
          }}
        >
          {/* CASO 1: IMPACTO DE QUEIMADA CLICADO */}
          {impact && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      color: 'var(--alert-orange)',
                      textTransform: 'uppercase',
                      border: '1px solid var(--alert-orange)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {impact.category} // GRAVIDADE {impact.severity}
                  </span>

                  {onClearSelection && (
                    <button
                      onClick={onClearSelection}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✕ Fechar
                    </button>
                  )}
                </div>

                <h2 style={{ fontSize: '1.25rem', color: '#ffb59b', margin: '0.6rem 0 0.2rem 0' }}>
                  {impact.title}
                </h2>
                <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.85rem', fontStyle: 'italic' }}>
                  {impact.subtitle}
                </p>
              </div>

              {/* Descrição do Dano */}
              <div>
                <h4 style={{ color: 'var(--alert-orange)', fontSize: '0.82rem', fontFamily: 'monospace', margin: '0 0 0.3rem 0' }}>
                  O QUE OCORRE COM O ELEMENTO
                </h4>
                <p style={{ margin: 0, color: '#f3f4f6', fontSize: '0.85rem' }}>
                  {impact.description}
                </p>
              </div>

              {/* Consequência Ecológica Ampla */}
              <div
                style={{
                  background: 'rgba(255, 113, 61, 0.1)',
                  border: '1px solid rgba(255, 113, 61, 0.3)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                }}
              >
                <h4 style={{ color: 'var(--alert-orange)', fontSize: '0.82rem', fontFamily: 'monospace', margin: '0 0 0.3rem 0' }}>
                  CONSEQUÊNCIA ECOLÓGICA
                </h4>
                <p style={{ margin: 0, color: '#fed7aa', fontSize: '0.83rem' }}>
                  {impact.ecologicalConsequence}
                </p>
              </div>

              {/* Desafio de Regeneração */}
              <div
                style={{
                  background: 'rgba(66, 191, 232, 0.08)',
                  border: '1px solid rgba(66, 191, 232, 0.25)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                }}
              >
                <h4 style={{ color: 'var(--blue-tech)', fontSize: '0.82rem', fontFamily: 'monospace', margin: '0 0 0.3rem 0' }}>
                  DESAFIO DE RECUPERAÇÃO
                </h4>
                <p style={{ margin: 0, color: '#e0f2fe', fontSize: '0.83rem' }}>
                  {impact.regenerationChallenge}
                </p>
              </div>
            </>
          )}

          {/* CASO 2: ESPÉCIE PRESERVADA CLICADA */}
          {species && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      color: 'var(--blue-tech)',
                      textTransform: 'uppercase',
                      border: '1px solid var(--blue-tech)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {species.category}
                  </span>

                  {onClearSelection && (
                    <button
                      onClick={onClearSelection}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✕ Fechar
                    </button>
                  )}
                </div>

                <h2 style={{ fontSize: '1.35rem', color: 'var(--white-text)', margin: '0.6rem 0 0.2rem 0' }}>
                  {species.popularName}
                </h2>

                {species.scientificName && (
                  <p style={{ fontStyle: 'italic', color: 'var(--green-glow)', margin: 0, fontSize: '0.9rem' }}>
                    {species.scientificName}
                  </p>
                )}
              </div>

              {species.conservationStatus && (
                <div
                  style={{
                    background: 'rgba(255, 113, 61, 0.1)',
                    border: '1px solid rgba(255, 113, 61, 0.3)',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    color: 'var(--alert-orange)',
                  }}
                >
                  STATUS: {species.conservationStatus}
                </div>
              )}

              <div>
                <h4 style={{ color: 'var(--blue-tech)', fontSize: '0.82rem', fontFamily: 'monospace', margin: '0 0 0.3rem 0' }}>
                  CARACTERÍSTICAS BIOLÓGICAS
                </h4>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem' }}>
                  {species.characteristics}
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(31, 112, 75, 0.25)',
                  border: '1px solid rgba(101, 230, 165, 0.3)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                }}
              >
                <h4 style={{ color: 'var(--green-glow)', fontSize: '0.82rem', fontFamily: 'monospace', margin: '0 0 0.3rem 0' }}>
                  PAPEL NO ECOSSISTEMA
                </h4>
                <p style={{ margin: 0, color: '#dcfce7', fontSize: '0.83rem' }}>
                  {species.ecologicalImportance}
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(66, 191, 232, 0.08)',
                  border: '1px solid rgba(66, 191, 232, 0.25)',
                  padding: '0.8rem',
                  borderRadius: '6px',
                }}
              >
                <h4 style={{ color: 'var(--blue-tech)', fontSize: '0.82rem', fontFamily: 'monospace', margin: '0 0 0.3rem 0' }}>
                  CURIOSIDADE CIENTÍFICA
                </h4>
                <p style={{ margin: 0, color: '#e0f2fe', fontSize: '0.83rem' }}>
                  {species.curiosities}
                </p>
              </div>
            </>
          )}

          {/* CASO 3: NENHUM ELEMENTO CLICADO (VISÃO GERAL DO MODO) */}
          {!selectedData && (
            <>
              {isBurnedMode ? (
                <>
                  <div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: 'var(--alert-orange)',
                        letterSpacing: '1px',
                        marginBottom: '0.3rem',
                      }}
                    >
                      // ÁREA SOB EFEITO DE INCÊNDIO
                    </div>
                    <h3 style={{ fontSize: '1.05rem', color: '#ffb59b', margin: '0 0 0.4rem 0' }}>
                      Impactos Severos das Queimadas
                    </h3>
                    <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.85rem' }}>
                      A Mata Atlântica é uma floresta tropical úmida cujas árvores e fauna nativa não possuem
                      mecanismos de defesa contra o fogo. O fogo rasteiro consome a serapilheira e aquece o solo,
                      matando as raízes e impedindo a regeneração das espécies clímax.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 113, 61, 0.1)',
                      border: '1px solid rgba(255, 113, 61, 0.3)',
                      borderRadius: '6px',
                      padding: '0.8rem',
                    }}
                  >
                    <div style={{ color: 'var(--alert-orange)', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '0.3rem' }}>
                      ⚠ O CICLO DA DEGRADAÇÃO
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#fed7aa' }}>
                      Após o fogo, gramíneas invasoras de fácil combustão ocupam as bordas, aumentando drasticamente
                      a frequência e o risco de novos incêndios em anos secos futuros.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(66, 191, 232, 0.08)',
                      border: '1px solid rgba(66, 191, 232, 0.25)',
                      borderRadius: '6px',
                      padding: '0.8rem',
                    }}
                  >
                    <div style={{ color: 'var(--blue-tech)', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '0.3rem' }}>
                      // COMO RESTAURAR?
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#d0f0fd' }}>
                      Áreas severamente queimadas necessitam de controle de formigas-cortadeiras, correção do solo,
                      plantio em linhas de adubação verde e enriquecimento com espécies atrativas da fauna.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: 'var(--green-glow)',
                        letterSpacing: '1px',
                        marginBottom: '0.3rem',
                      }}
                    >
                      // MODO FLORESTA PRESERVADA
                    </div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--white-text)', margin: '0 0 0.4rem 0' }}>
                      Floresta Ombrófila Densa
                    </h3>
                    <p style={{ color: '#c5d4cd', margin: 0, fontSize: '0.85rem' }}>
                      Use o botão central <strong>"ÁREA DEVASTADA"</strong> no topo para alternar instantaneamente
                      entre a floresta preservada e a mesma paisagem atingida pelo fogo.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(31, 112, 75, 0.25)',
                      border: '1px solid rgba(101, 230, 165, 0.3)',
                      borderRadius: '6px',
                      padding: '0.8rem',
                    }}
                  >
                    <div style={{ color: 'var(--green-glow)', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '0.3rem' }}>
                      🌿 SERVIÇOS ECOSSISTÊMICOS
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#dcfce7' }}>
                      Florestas preservadas regulam o regime de chuvas, evitam deslizamentos de terra na serra e
                      estocam carbono orgânico por séculos nos tecidos das árvores.
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Rodapé do painel */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '0.8rem',
              borderTop: isBurnedMode
                ? '1px solid rgba(255, 113, 61, 0.35)'
                : '1px solid var(--panel-border)',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              color: isBurnedMode ? 'var(--alert-orange)' : 'var(--green-glow)',
              textAlign: 'center',
            }}
          >
            MUSEU VIRTUAL // ANTES E DEPOIS
          </div>
        </div>
      )}
    </aside>
  );
};
