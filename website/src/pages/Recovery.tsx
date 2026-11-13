import React, { useEffect, useRef, useState } from 'react';
import { RecoveryScene } from '../scenes/RecoveryScene';
import {
  SUCCESSION_STAGES,
  LIMITING_FACTORS,
  RECOVERY_TECHNOLOGIES,
  type SuccessionalStageId,
  type LimitingFactor,
  type RecoveryTechnology,
  type StageElementData,
} from '../data/recoveryData';

export const Recovery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RecoveryScene | null>(null);

  const [activeStage, setActiveStage] = useState<SuccessionalStageId>('fase1');
  const [droneActive, setDroneActive] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<StageElementData | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<LimitingFactor | null>(null);
  const [selectedTech, setSelectedTech] = useState<RecoveryTechnology | null>(null);
  const [showTheory, setShowTheory] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new RecoveryScene(containerRef.current, activeStage, (element) => {
      setSelectedFactor(null);
      setSelectedTech(null);
      setSelectedElement(element);
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  const handleStageSelect = (stageId: SuccessionalStageId) => {
    setActiveStage(stageId);
    setSelectedElement(null);
    if (sceneRef.current) {
      sceneRef.current.setStage(stageId);
    }
  };

  const handleToggleDrone = () => {
    const newState = !droneActive;
    setDroneActive(newState);
    if (sceneRef.current) {
      sceneRef.current.setDroneVisible(newState);
    }
  };

  const currentStageData = SUCCESSION_STAGES[activeStage];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 75px)',
        overflow: 'hidden',
        background: '#071A14',
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

      {/* 2. LINHA DO TEMPO FUTURISTA DE SUCESSÃO (4 FASES DIDÁTICAS) */}
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
        {/* Seletor de Fases da Linha do Tempo */}
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
          {Object.values(SUCCESSION_STAGES).map((stg) => {
            const isActive = activeStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => handleStageSelect(stg.id)}
                style={{
                  background: isActive ? 'var(--green-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(241, 245, 242, 0.7)',
                  border: isActive ? '1px solid var(--green-glow)' : '1px solid transparent',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{stg.icon}</span>
                <span>FASE {stg.number}</span>
              </button>
            );
          })}
        </div>

        {/* Botões de Ação Direita: Drone & Teoria */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleToggleDrone}
            style={{
              background: droneActive ? 'var(--blue-tech)' : 'rgba(7, 26, 20, 0.92)',
              color: droneActive ? '#071A14' : 'var(--blue-tech)',
              border: '1px solid var(--blue-tech)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)',
              boxShadow: droneActive ? '0 0 15px rgba(66, 191, 232, 0.5)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <span>🚁</span> {droneActive ? 'DESATIVAR DRONE' : 'ATIVAR BIO-DRONE'}
          </button>

          <button
            onClick={() => setShowTheory(!showTheory)}
            style={{
              background: showTheory ? 'var(--green-glow)' : 'rgba(7, 26, 20, 0.92)',
              color: showTheory ? '#071A14' : 'var(--green-glow)',
              border: '1px solid var(--green-glow)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}
          >
            {showTheory ? '✕ FECHAR' : '📖 CONCEITOS CIENTÍFICOS'}
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
          background: 'rgba(7, 26, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--panel-border)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          color: 'var(--green-glow)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}
      >
        <span>🔍 Clique em qualquer elemento 3D da fase atual para inspecioná-lo</span>
      </div>

      {/* 4. BARRA INFERIOR: FATORES QUE DIFICULTAM & TECNOLOGIAS */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', pointerEvents: 'auto', paddingBottom: '2px' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--alert-orange)', padding: '4px 6px', alignSelf: 'center', whiteSpace: 'nowrap' }}>
            FATORES LIMITANTES:
          </span>
          {LIMITING_FACTORS.map((fac) => (
            <button
              key={fac.id}
              onClick={() => {
                setSelectedElement(null);
                setSelectedTech(null);
                setSelectedFactor(fac);
              }}
              style={{
                background: selectedFactor?.id === fac.id ? 'var(--alert-orange)' : 'rgba(22, 14, 10, 0.88)',
                color: selectedFactor?.id === fac.id ? '#fff' : '#f87171',
                border: '1px solid rgba(255, 113, 61, 0.35)',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
              }}
            >
              {fac.icon} {fac.title}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', pointerEvents: 'auto' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--blue-tech)', padding: '4px 6px', alignSelf: 'center', whiteSpace: 'nowrap' }}>
            TECNOLOGIAS DE APOIO:
          </span>
          {RECOVERY_TECHNOLOGIES.map((tech) => (
            <button
              key={tech.id}
              onClick={() => {
                setSelectedElement(null);
                setSelectedFactor(null);
                setSelectedTech(tech);
              }}
              style={{
                background: selectedTech?.id === tech.id ? 'var(--blue-tech)' : 'rgba(10, 20, 28, 0.88)',
                color: selectedTech?.id === tech.id ? '#071A14' : 'var(--blue-tech)',
                border: '1px solid rgba(66, 191, 232, 0.35)',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
              }}
            >
              {tech.icon} {tech.name}
            </button>
          ))}
        </div>
      </div>

      {/* 5. PAINEL LATERAL DIREITO: DIAGNÓSTICO DO ELEMENTO 3D CLICADO OU DA FASE */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          right: '16px',
          width: '350px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(14px)',
          border: '1px solid var(--panel-border)',
          borderRadius: '10px',
          padding: '1.2rem',
          zIndex: 25,
          color: 'var(--white-text)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* CASO 1: ELEMENTO 3D CLICADO DIRETAMENTE NA CENA */}
        {selectedElement ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--green-glow)', border: '1px solid var(--green-glow)', padding: '2px 6px', borderRadius: '4px' }}>
                {selectedElement.category}
              </span>
              <button
                onClick={() => setSelectedElement(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ✕ Fechar
              </button>
            </div>

            <h3 style={{ color: 'var(--white-text)', fontSize: '1.2rem', margin: '0.6rem 0 0.15rem 0' }}>
              {selectedElement.name}
            </h3>
            {selectedElement.scientificName && (
              <p style={{ fontStyle: 'italic', color: 'var(--green-glow)', margin: 0, fontSize: '0.82rem' }}>
                {selectedElement.scientificName}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.83rem', marginTop: '0.8rem' }}>
              <div>
                <strong style={{ color: 'var(--blue-tech)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  DESCRIÇÃO MORFOLÓGICA:
                </strong>
                <p style={{ margin: '2px 0 0 0', color: '#e2e8f0', lineHeight: 1.45 }}>{selectedElement.description}</p>
              </div>

              <div style={{ background: 'rgba(101, 230, 165, 0.08)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(101, 230, 165, 0.2)' }}>
                <strong style={{ color: 'var(--green-glow)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  PAPEL NA SUCESSÃO ECOLÓGICA:
                </strong>
                <p style={{ margin: '2px 0 0 0', color: '#dcfce7', lineHeight: 1.45 }}>{selectedElement.roleInSuccession}</p>
              </div>

              <div style={{ background: 'rgba(66, 191, 232, 0.08)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(66, 191, 232, 0.2)' }}>
                <strong style={{ color: 'var(--blue-tech)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  SIGNIFICADO AMBIENTAL:
                </strong>
                <p style={{ margin: '2px 0 0 0', color: '#e0f2fe', lineHeight: 1.45 }}>{selectedElement.ecologicalSignificance}</p>
              </div>
            </div>
          </div>
        ) : selectedFactor ? (
          /* CASO 2: FATOR LIMITANTE CLICADO */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--alert-orange)', border: '1px solid var(--alert-orange)', padding: '2px 6px', borderRadius: '4px' }}>
                FATOR QUE DIFICULTA A RECUPERAÇÃO
              </span>
              <button onClick={() => setSelectedFactor(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <h3 style={{ color: '#fed7aa', fontSize: '1.15rem', margin: '0.6rem 0 0.3rem 0' }}>
              {selectedFactor.icon} {selectedFactor.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.82rem', marginTop: '0.6rem' }}>
              <div>
                <strong style={{ color: 'var(--alert-orange)' }}>Como Atua:</strong>
                <p style={{ margin: '2px 0 0 0', color: '#e2e8f0' }}>{selectedFactor.mechanism}</p>
              </div>
              <div style={{ background: 'rgba(255, 113, 61, 0.1)', padding: '8px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--alert-orange)' }}>Consequência Ecológica:</strong>
                <p style={{ margin: '2px 0 0 0', color: '#fed7aa' }}>{selectedFactor.ecologicalConsequence}</p>
              </div>
              <div style={{ background: 'rgba(101, 230, 165, 0.1)', padding: '8px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--green-glow)' }}>Ação Mitigadora:</strong>
                <p style={{ margin: '2px 0 0 0', color: '#dcfce7' }}>{selectedFactor.mitigation}</p>
              </div>
            </div>
          </div>
        ) : selectedTech ? (
          /* CASO 3: TECNOLOGIA CLICADA */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--blue-tech)', border: '1px solid var(--blue-tech)', padding: '2px 6px', borderRadius: '4px' }}>
                TECNOLOGIA & BIOENGENHARIA
              </span>
              <button onClick={() => setSelectedTech(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <h3 style={{ color: 'var(--blue-tech)', fontSize: '1.15rem', margin: '0.6rem 0 0.3rem 0' }}>
              {selectedTech.icon} {selectedTech.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.82rem', marginTop: '0.6rem' }}>
              <div>
                <strong style={{ color: 'var(--blue-tech)' }}>Aplicação Prática:</strong>
                <p style={{ margin: '2px 0 0 0', color: '#e2e8f0' }}>{selectedTech.application}</p>
              </div>
              <div style={{ background: 'rgba(66, 191, 232, 0.1)', padding: '8px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--blue-tech)' }}>Benefício na Restauração:</strong>
                <p style={{ margin: '2px 0 0 0', color: '#d0f0fd' }}>{selectedTech.benefit}</p>
              </div>
            </div>
          </div>
        ) : (
          /* CASO 4: VISÃO GERAL DA FASE ATIVA */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.4rem' }}>{currentStageData.icon}</span>
              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--green-glow)', letterSpacing: '1px' }}>
                  FASE {currentStageData.number} DE 4 // SUCESSÃO ECOLÓGICA
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--white-text)', margin: 0 }}>
                  {currentStageData.title}
                </h3>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--blue-tech)', fontSize: '0.8rem', margin: '0.4rem 0 0.8rem 0' }}>
              {currentStageData.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.82rem' }}>
              <div>
                <div style={{ color: 'var(--green-glow)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  CARACTERÍSTICAS DA FASE:
                </div>
                <ul style={{ margin: '4px 0 0 16px', padding: 0, color: '#e2e8f0', lineHeight: 1.4 }}>
                  {currentStageData.characteristics.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--blue-tech)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  CONDIÇÃO DO SOLO & COBERTURA:
                </div>
                <p style={{ margin: '2px 0 0 0', color: '#cbd5e0' }}>{currentStageData.soilCondition}</p>
                <p style={{ margin: '4px 0 0 0', color: 'var(--green-glow)', fontWeight: 600 }}>{currentStageData.vegetationCover}</p>
              </div>

              <div>
                <div style={{ color: 'var(--alert-orange)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  FAUNA ASSOCIADA:
                </div>
                <p style={{ margin: '2px 0 0 0', color: '#e2e8f0' }}>{currentStageData.wildlifePresence}</p>
              </div>

              <div style={{ background: 'rgba(101, 230, 165, 0.08)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(101, 230, 165, 0.2)' }}>
                <div style={{ color: 'var(--green-glow)', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  DINÂMICA ECOLÓGICA:
                </div>
                <p style={{ margin: '2px 0 0 0', color: '#dcfce7', fontSize: '0.8rem' }}>{currentStageData.ecologicalProcess}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. MODAL DE CONCEITOS CIENTÍFICOS */}
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
            border: '1px solid var(--green-glow)',
            borderRadius: '10px',
            padding: '1.5rem',
            zIndex: 35,
            color: 'var(--white-text)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--green-glow)', margin: 0, fontSize: '1.2rem' }}>
              Fundamentos da Sucessão Ecológica e Resiliência na Mata Atlântica
            </h3>
            <button
              onClick={() => setShowTheory(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem', lineHeight: 1.55 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(101, 230, 165, 0.2)' }}>
              <h4 style={{ color: 'var(--green-glow)', margin: '0 0 0.4rem 0' }}>🌱 Sucessão Primária vs. Secundária</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                A <strong>sucessão primária</strong> ocorre em terrenos estéreis sem solo prévio. 
                Áreas queimadas passam por <strong>sucessão secundária</strong>, pois ainda retêm o substrato mineral de solo e parte do banco biológico remanescente.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(66, 191, 232, 0.2)' }}>
              <h4 style={{ color: 'var(--blue-tech)', margin: '0 0 0.4rem 0' }}>☀️ O Papel Crucial das Pioneiras</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                Plantas pioneiras (como embaúbas e aroeiras) toleram a insolação direta e crescem velozmente, criando a sombra fresca necessária para as espécies secundárias e clímax.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(66, 191, 232, 0.2)' }}>
              <h4 style={{ color: 'var(--blue-tech)', margin: '0 0 0.4rem 0' }}>🕊️ A Fauna como Motor de Dispersão</h4>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                Mais de 80% das árvores da Mata Atlântica dependem de animais para dispersar sementes (zoocoria). O retorno precoce de aves acelera em anos a restauração de áreas degradadas.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 113, 61, 0.08)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 113, 61, 0.3)' }}>
              <h4 style={{ color: 'var(--alert-orange)', margin: '0 0 0.4rem 0' }}>⚠️ Variabilidade Pós-Fogo</h4>
              <p style={{ margin: 0, color: '#ffd6c9' }}>
                Nenhuma queimada gera o mesmo cenário: a intensidade térmica, o tempo de estiagem, a proximidade com fragmentos preservados e a sobrevivência do solo definem a velocidade de regeneração.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
