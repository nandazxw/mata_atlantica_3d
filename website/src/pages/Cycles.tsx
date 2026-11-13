import React, { useEffect, useRef, useState } from 'react';
import { BiogeochemicalScene } from '../scenes/BiogeochemicalScene';
import {
  BIOGEOCHEMICAL_CYCLES,
  type CycleType,
  type CycleStepData,
} from '../data/cyclesData';

export const Cycles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BiogeochemicalScene | null>(null);

  const [currentCycle, setCurrentCycle] = useState<CycleType>('water');
  const [isFireSimulated, setIsFireSimulated] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<CycleStepData | null>(null);
  const [showTheory, setShowTheory] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new BiogeochemicalScene(containerRef.current, currentCycle, (step) => {
      setSelectedStep(step);
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  const handleCycleChange = (cycle: CycleType) => {
    setCurrentCycle(cycle);
    setSelectedStep(null);
    if (sceneRef.current) {
      sceneRef.current.loadCycle(cycle);
    }
  };

  const handleToggleFire = () => {
    const newState = !isFireSimulated;
    setIsFireSimulated(newState);
    if (sceneRef.current) {
      sceneRef.current.setFireImpact(newState);
    }
  };

  const currentCycleData = BIOGEOCHEMICAL_CYCLES[currentCycle];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 75px)',
        overflow: 'hidden',
        background: isFireSimulated ? '#160e0a' : '#06140e',
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

      {/* 2. BARRA SUPERIOR DE NAVEGAÇÃO DOS CICLOS */}
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
        {/* Seletor dos 3 Ciclos Biogeoquímicos */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            background: 'rgba(7, 26, 20, 0.92)',
            backdropFilter: 'blur(12px)',
            padding: '4px',
            borderRadius: '30px',
            border: '1px solid var(--panel-border)',
            gap: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => handleCycleChange('water')}
            style={{
              background: currentCycle === 'water' ? 'var(--blue-tech)' : 'transparent',
              color: currentCycle === 'water' ? '#071A14' : 'rgba(241, 245, 242, 0.75)',
              border: currentCycle === 'water' ? '1px solid var(--blue-tech)' : '1px solid transparent',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: currentCycle === 'water' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>💧</span> CICLO DA ÁGUA
          </button>

          <button
            onClick={() => handleCycleChange('carbon')}
            style={{
              background: currentCycle === 'carbon' ? 'var(--green-glow)' : 'transparent',
              color: currentCycle === 'carbon' ? '#071A14' : 'rgba(241, 245, 242, 0.75)',
              border: currentCycle === 'carbon' ? '1px solid var(--green-glow)' : '1px solid transparent',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: currentCycle === 'carbon' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🌿</span> CICLO DO CARBONO
          </button>

          <button
            onClick={() => handleCycleChange('nitrogen')}
            style={{
              background: currentCycle === 'nitrogen' ? '#A78BFA' : 'transparent',
              color: currentCycle === 'nitrogen' ? '#071A14' : 'rgba(241, 245, 242, 0.75)',
              border: currentCycle === 'nitrogen' ? '1px solid #A78BFA' : '1px solid transparent',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: currentCycle === 'nitrogen' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>⚡</span> CICLO DO NITROGÊNIO
          </button>
        </div>

        {/* Botão de Queimada & Teoria */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleToggleFire}
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
            {isFireSimulated ? 'RESTAURAR FLUXO EQUILIBRADO' : 'VISUALIZAR IMPACTO DAS QUEIMADAS'}
          </button>

          <button
            onClick={() => setShowTheory(!showTheory)}
            style={{
              background: showTheory ? 'var(--blue-tech)' : 'rgba(7, 26, 20, 0.92)',
              color: showTheory ? '#071A14' : 'var(--blue-tech)',
              border: '1px solid var(--blue-tech)',
              padding: '7px 14px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}
          >
            {showTheory ? '✕ FECHAR' : '📖 CONCEITOS GERAIS'}
          </button>
        </div>
      </div>

      {/* 3. DICA DE INTERAÇÃO FLUTUANTE */}
      <div
        style={{
          position: 'absolute',
          top: '68px',
          left: '16px',
          zIndex: 10,
          pointerEvents: 'none',
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--panel-border)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          color: isFireSimulated ? 'var(--alert-orange)' : 'var(--green-glow)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}
      >
        <span>🔍 Clique em qualquer orbe do ciclo para ver sua função biológica e alteração pós-fogo</span>
      </div>

      {/* 4. BARRA INFERIOR DE ETAPAS DO CICLO (SELETOR RÁPIDO) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {currentCycleData.steps.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              setSelectedStep(st);
              if (sceneRef.current) sceneRef.current.selectStep(st.id);
            }}
            style={{
              flex: 1,
              minWidth: '150px',
              background: selectedStep?.id === st.id ? 'var(--green-primary)' : 'rgba(7, 26, 20, 0.88)',
              color: selectedStep?.id === st.id ? '#fff' : 'rgba(241, 245, 242, 0.8)',
              border: selectedStep?.id === st.id ? '1px solid var(--green-glow)' : '1px solid rgba(101, 230, 165, 0.2)',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {st.name}
          </button>
        ))}
      </div>

      {/* 5. PAINEL LATERAL DIREITO: DETALHES DA ETAPA OU RESUMO DO IMPACTO */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          right: '16px',
          width: '350px',
          maxHeight: 'calc(100vh - 170px)',
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
        {selectedStep ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: `${selectedStep.color}22`,
                  color: selectedStep.color,
                  border: `1px solid ${selectedStep.color}66`,
                }}
              >
                {selectedStep.category}
              </span>
              <button
                onClick={() => {
                  setSelectedStep(null);
                  if (sceneRef.current) sceneRef.current.selectStep(null);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ✕ Fechar
              </button>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--white-text)', margin: '0.6rem 0 0.15rem 0' }}>
              {selectedStep.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.83rem', marginTop: '0.8rem' }}>
              <div>
                <strong style={{ color: 'var(--blue-tech)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  PROCESSO NATURAL:
                </strong>
                <p style={{ margin: '2px 0 0 0', color: '#e2e8f0', lineHeight: 1.45 }}>{selectedStep.naturalProcess}</p>
              </div>

              <div style={{ background: 'rgba(101, 230, 165, 0.08)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(101, 230, 165, 0.2)' }}>
                <strong style={{ color: 'var(--green-glow)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  FUNÇÃO ECOLÓGICA NO BIOMA:
                </strong>
                <p style={{ margin: '2px 0 0 0', color: '#dcfce7', lineHeight: 1.45 }}>{selectedStep.biologicalImportance}</p>
              </div>

              <div style={{ background: 'rgba(255, 113, 61, 0.1)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 113, 61, 0.3)' }}>
                <strong style={{ color: 'var(--alert-orange)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  ALTERAÇÃO PÓS-QUEIMADA:
                </strong>
                <p style={{ margin: '2px 0 0 0', color: '#fed7aa', lineHeight: 1.45 }}>{selectedStep.fireAlteration}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>
                {currentCycle === 'water' ? '💧' : currentCycle === 'carbon' ? '🌿' : '⚡'}
              </span>
              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: currentCycleData.accentColor, letterSpacing: '1px' }}>
                  CICLOS BIOGEOQUÍMICOS // MATA ATLÂNTICA
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--white-text)', margin: 0 }}>
                  {currentCycleData.title}
                </h3>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--blue-tech)', fontSize: '0.8rem', margin: '0.4rem 0 0.8rem 0' }}>
              {currentCycleData.subtitle}
            </p>

            <p style={{ fontSize: '0.84rem', color: '#cbd5e0', lineHeight: 1.5, marginBottom: '1rem' }}>
              {currentCycleData.description}
            </p>

            {isFireSimulated ? (
              <div style={{ background: 'rgba(255, 113, 61, 0.12)', border: '1px solid rgba(255, 113, 61, 0.35)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ color: 'var(--alert-orange)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.74rem', marginBottom: '4px' }}>
                  ⚠ {currentCycleData.fireImpactSummary.title}
                </div>
                <p style={{ color: '#fed7aa', fontSize: '0.8rem', margin: '0 0 8px 0' }}>
                  {currentCycleData.fireImpactSummary.description}
                </p>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#ffedd5', fontSize: '0.76rem', lineHeight: 1.4 }}>
                  {currentCycleData.fireImpactSummary.keyPoints.map((kp, idx) => (
                    <li key={idx}>{kp}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ background: 'rgba(101, 230, 165, 0.08)', border: '1px solid rgba(101, 230, 165, 0.2)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ color: 'var(--green-glow)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.74rem', marginBottom: '4px' }}>
                  🌿 DINÂMICA DE EQUILÍBRIO
                </div>
                <p style={{ color: '#dcfce7', fontSize: '0.8rem', margin: 0, lineHeight: 1.45 }}>
                  Em uma floresta madura preservada, os fluxos de entrada e saída estão em equilíbrio dinâmico,
                  garantindo a reciclagem da água, a estocagem de carbono e a fertilidade biológica do solo.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. MODAL DE CONCEITOS GERAIS BIOGEOQUÍMICOS */}
      {showTheory && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '16px',
            right: '16px',
            maxHeight: 'calc(100vh - 170px)',
            overflowY: 'auto',
            background: 'rgba(7, 26, 20, 0.96)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--blue-tech)',
            borderRadius: '10px',
            padding: '1.5rem',
            zIndex: 35,
            color: 'var(--white-text)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--blue-tech)', margin: 0, fontSize: '1.2rem' }}>
              Fundamentos Científicos: O que são Ciclos Biogeoquímicos?
            </h3>
            <button
              onClick={() => setShowTheory(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem', lineHeight: 1.55 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(66, 191, 232, 0.2)' }}>
              <h4 style={{ color: 'var(--blue-tech)', margin: '0 0 0.4rem 0' }}>🔄 Circulação da Matéria</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                Os ciclos biogeoquímicos descrevem as vias pelas quais os elementos químicos essenciais (H₂O, C, N) se movem entre os compartimentos bióticos (seres vivos) e abióticos (atmosfera, solo e hidrosfera) da Terra.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(101, 230, 165, 0.2)' }}>
              <h4 style={{ color: 'var(--green-glow)', margin: '0 0 0.4rem 0' }}>🌲 A Floresta como Moduladora</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                A Mata Atlântica não é uma consumidora passiva: suas raízes retêm nutrientes, suas árvores estocam carbono em troncos maciços e suas folhas bombardeiam a atmosfera com umidade (bomba biótica).
              </p>
            </div>

            <div style={{ background: 'rgba(255, 113, 61, 0.08)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 113, 61, 0.3)' }}>
              <h4 style={{ color: 'var(--alert-orange)', margin: '0 0 0.4rem 0' }}>🔥 O Choque Térmico das Queimadas</h4>
              <p style={{ margin: 0, color: '#ffd6c9' }}>
                O fogo age como uma reação de oxidação descontrolada: transforma nutrientes orgânicos sólidos em gases voláteis que se perdem no ar e quebra os filtros naturais de água e carbono do solo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
