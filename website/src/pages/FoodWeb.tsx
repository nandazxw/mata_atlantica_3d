import React, { useEffect, useRef, useState } from 'react';
import { FoodWebScene, type DisplayMode } from '../scenes/FoodWebScene';
import { type FoodWebOrganism, FOOD_WEB_ORGANISMS, TROPHIC_COLORS } from '../data/foodWebData';

export const FoodWeb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<FoodWebScene | null>(null);

  const [displayMode, setDisplayMode] = useState<DisplayMode>('chain');
  const [isFireSimulated, setIsFireSimulated] = useState<boolean>(false);
  const [selectedOrganism, setSelectedOrganism] = useState<FoodWebOrganism | null>(null);
  const [showTheory, setShowTheory] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new FoodWebScene(containerRef.current, displayMode, (org) => {
      setSelectedOrganism(org);
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    if (sceneRef.current) {
      sceneRef.current.setDisplayMode(mode);
    }
  };

  const handleToggleFireSimulation = () => {
    const newState = !isFireSimulated;
    setIsFireSimulated(newState);
    if (sceneRef.current) {
      sceneRef.current.setFireSimulation(newState);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 75px)',
        overflow: 'hidden',
        background: isFireSimulated ? '#140d0a' : '#06140e',
        transition: 'background 0.5s ease',
      }}
    >
      {/* 1. Elemento Canvas Three.js */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          cursor: 'grab',
        }}
      />

      {/* 2. BARRA SUPERIOR DE CONTROLES */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Esquerda: Seletor Cadeia vs Teia e Teoria */}
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(7, 26, 20, 0.9)',
              backdropFilter: 'blur(10px)',
              padding: '4px',
              borderRadius: '24px',
              border: '1px solid var(--panel-border)',
            }}
          >
            <button
              onClick={() => handleModeChange('chain')}
              style={{
                background: displayMode === 'chain' ? 'var(--green-primary)' : 'transparent',
                color: displayMode === 'chain' ? '#fff' : 'rgba(241, 245, 242, 0.7)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '18px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: displayMode === 'chain' ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              CADEIA ALIMENTAR (DIDÁTICA)
            </button>
            <button
              onClick={() => handleModeChange('web')}
              style={{
                background: displayMode === 'web' ? 'var(--green-primary)' : 'transparent',
                color: displayMode === 'web' ? '#fff' : 'rgba(241, 245, 242, 0.7)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '18px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: displayMode === 'web' ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              TEIA TRÓFICA (REDE)
            </button>
          </div>

          <button
            onClick={() => setShowTheory(!showTheory)}
            style={{
              background: showTheory ? 'var(--blue-tech)' : 'rgba(7, 26, 20, 0.9)',
              color: showTheory ? '#071A14' : 'var(--blue-tech)',
              border: '1px solid var(--blue-tech)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}
          >
            {showTheory ? '✕ FECHAR TEORIA' : '📖 EXPLICAÇÃO CIENTÍFICA'}
          </button>
        </div>

        {/* Direita: Botão de Simulação de Queimadas */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            onClick={handleToggleFireSimulation}
            style={{
              background: isFireSimulated ? 'var(--alert-orange)' : 'rgba(255, 113, 61, 0.15)',
              color: isFireSimulated ? '#ffffff' : 'var(--alert-orange)',
              border: '1px solid var(--alert-orange)',
              padding: '7px 16px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              boxShadow: isFireSimulated ? '0 0 20px rgba(255, 113, 61, 0.5)' : 'none',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
            }}
          >
            <span>🔥</span>
            {isFireSimulated ? 'RESTAURAR TEIA NATURAL' : 'SIMULAR IMPACTO DAS QUEIMADAS'}
          </button>
        </div>
      </div>

      {/* 3. LEGENDA DE NÍVEIS TRÓFICOS (CANTO INFERIOR ESQUERDO) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 10,
          background: 'rgba(7, 26, 20, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--panel-border)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: TROPHIC_COLORS.producer }} />
          <span>Produtores</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: TROPHIC_COLORS.primary_consumer }} />
          <span>Cons. Primários</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: TROPHIC_COLORS.secondary_consumer }} />
          <span>Cons. Secundários</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: TROPHIC_COLORS.tertiary_consumer }} />
          <span>Predador Topo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: TROPHIC_COLORS.decomposer }} />
          <span>Decompositores</span>
        </div>
      </div>

      {/* 4. PAINEL MODAL DE EXPLICAÇÃO CIENTÍFICA (QUANDO ATIVADO) */}
      {showTheory && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '16px',
            right: '16px',
            maxHeight: 'calc(100vh - 170px)',
            overflowY: 'auto',
            background: 'rgba(7, 26, 20, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--blue-tech)',
            borderRadius: '10px',
            padding: '1.5rem',
            zIndex: 30,
            color: 'var(--white-text)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--blue-tech)', margin: 0, fontSize: '1.25rem' }}>
              Fundamentos Ecológicos: Cadeias, Teias e Ciclos da Mata Atlântica
            </h3>
            <button
              onClick={() => setShowTheory(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.86rem', lineHeight: 1.55 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(101, 230, 165, 0.2)' }}>
              <h4 style={{ color: 'var(--green-glow)', margin: '0 0 0.4rem 0' }}>🌱 O que é Cadeia vs. Teia Alimentar?</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                A <strong>cadeia alimentar</strong> é uma sequência linear simplificada de transferência de matéria e energia. 
                Na natureza real da Mata Atlântica, as relações formam uma <strong>teia trófica</strong> multidirecional, onde uma mesma ave ou primata consome múltiplos tipos de frutos e insetos.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(66, 191, 232, 0.2)' }}>
              <h4 style={{ color: 'var(--blue-tech)', margin: '0 0 0.4rem 0' }}>⚡ Fluxo Unidirecional de Energia</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                A energia solar é fixada pelos produtores (fotossíntese) e flui unidirecionalmente pelos níveis tróficos. A cada nível, cerca de 90% da energia é dissipada em calor e processos vitais, restando apenas ~10% para o nível seguinte.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(66, 191, 232, 0.2)' }}>
              <h4 style={{ color: 'var(--blue-tech)', margin: '0 0 0.4rem 0' }}>🔄 Ciclo da Matéria & Decompositores</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                Diferente da energia, a <strong>matéria é reciclada</strong>. Fungos e bactérias quebram fezes, folhas mortas e restos de animais, transformando moléculas orgânicas em nutrientes minerais absorvíveis pelas raízes das árvores.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 113, 61, 0.08)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 113, 61, 0.3)' }}>
              <h4 style={{ color: 'var(--alert-orange)', margin: '0 0 0.4rem 0' }}>🔥 Como as Queimadas Rompem a Teia?</h4>
              <p style={{ margin: 0, color: '#ffd6c9' }}>
                O fogo destrói a base vegetal e os insetos de baixa mobilidade. Sem produtores e herbívoros, os predadores de topo enfrentam o <strong>colapso de presas em cascata</strong>, forçando o êxodo da fauna e a esterilização temporária do ecossistema.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAINEL LATERAL INFORMATIVO DO ORGANISMO CLICADO */}
      {selectedOrganism && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            right: '16px',
            width: '340px',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            background: 'var(--panel-bg)',
            backdropFilter: 'blur(14px)',
            border: isFireSimulated ? '1px solid var(--alert-orange)' : '1px solid var(--panel-border)',
            borderRadius: '10px',
            padding: '1.2rem',
            zIndex: 25,
            color: 'var(--white-text)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                padding: '2px 8px',
                borderRadius: '4px',
                background: `${selectedOrganism.levelColor}22`,
                color: selectedOrganism.levelColor,
                border: `1px solid ${selectedOrganism.levelColor}66`,
              }}
            >
              {selectedOrganism.levelLabel}
            </span>
            <button
              onClick={() => {
                setSelectedOrganism(null);
                if (sceneRef.current) sceneRef.current.selectOrganism(null);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              ✕ Fechar
            </button>
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--white-text)', margin: '0.6rem 0 0.15rem 0' }}>
            {selectedOrganism.popularName}
          </h3>
          {selectedOrganism.scientificName && (
            <p style={{ fontStyle: 'italic', color: 'var(--green-glow)', margin: 0, fontSize: '0.85rem' }}>
              {selectedOrganism.scientificName}
            </p>
          )}

          <div style={{ marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.84rem' }}>
            <div>
              <div style={{ color: 'var(--blue-tech)', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                DO QUE SE ALIMENTA (PRESAS):
              </div>
              <p style={{ margin: '2px 0 0 0', color: '#e2e8f0' }}>{selectedOrganism.diet}</p>
            </div>

            <div>
              <div style={{ color: 'var(--alert-orange)', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                QUEM SE ALIMENTA DELE (PREDADORES):
              </div>
              <p style={{ margin: '2px 0 0 0', color: '#e2e8f0' }}>
                {selectedOrganism.predatorsOf.length > 0
                  ? selectedOrganism.predatorsOf.map((id) => FOOD_WEB_ORGANISMS[id]?.popularName).join(', ')
                  : 'Nenhum predador natural direto (exceto decompositores post-mortem)'}
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
              <div style={{ color: 'var(--green-glow)', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                PAPEL NA CADEIA ALIMENTAR:
              </div>
              <p style={{ margin: '2px 0 0 0', color: '#d1d5db', fontSize: '0.82rem' }}>
                {selectedOrganism.ecologicalRole}
              </p>
            </div>

            <div
              style={{
                background: isFireSimulated ? 'rgba(255, 113, 61, 0.15)' : 'rgba(255, 113, 61, 0.05)',
                border: '1px solid rgba(255, 113, 61, 0.3)',
                padding: '8px',
                borderRadius: '6px',
              }}
            >
              <div style={{ color: 'var(--alert-orange)', fontFamily: 'monospace', fontSize: '0.74rem', fontWeight: 700 }}>
                IMPACTO DO FOGO: {selectedOrganism.fireImpact.status}
              </div>
              <p style={{ margin: '2px 0 0 0', color: '#fed7aa', fontSize: '0.8rem' }}>
                {selectedOrganism.fireImpact.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
