import React, { useEffect, useRef } from 'react';
import { ForestScene, type ForestMode } from '../scenes/ForestScene';
import { type InteractiveData } from '../components/InteractiveObject';

interface Forest3DProps {
  mode: ForestMode;
  onModeChange: (mode: ForestMode) => void;
  onSelectData: (data: InteractiveData | null) => void;
  selectedData: InteractiveData | null;
}

export const Forest3D: React.FC<Forest3DProps> = ({
  mode,
  onModeChange,
  onSelectData,
  selectedData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneInstanceRef = useRef<ForestScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new ForestScene(containerRef.current, mode, (data) => {
      onSelectData(data);
    });
    sceneInstanceRef.current = scene;

    return () => {
      scene.destroy();
      sceneInstanceRef.current = null;
    };
  }, [onSelectData]);

  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setMode(mode);
    }
  }, [mode]);

  const isBurned = mode === 'burned';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 75px)',
        overflow: 'hidden',
        background: isBurned ? '#100a07' : '#071A14',
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

      {/* 2. BARRA DE CONTROLE SUPERIOR (ORGANIZADA SEM SOBREPOSIÇÃO) */}
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
        }}
      >
        {/* Lado Esquerdo: Instruções de Navegação + Tag de Inspeção */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'auto' }}>
          <div
            style={{
              background: 'var(--panel-bg)',
              backdropFilter: 'blur(10px)',
              border: isBurned ? '1px solid rgba(255, 113, 61, 0.4)' : '1px solid var(--panel-border)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: isBurned ? 'var(--alert-orange)' : 'var(--green-glow)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>🖱 Arraste p/ girar</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Scroll p/ zoom</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ color: 'var(--white-text)' }}>Clique nos elementos</span>
          </div>

          {selectedData && (
            <div
              style={{
                background: isBurned ? 'rgba(180, 50, 20, 0.9)' : 'rgba(31, 112, 75, 0.9)',
                border: isBurned ? '1px solid var(--alert-orange)' : '1px solid var(--green-glow)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                maxWidth: '380px',
              }}
            >
              INSPECIONANDO:{' '}
              <strong style={{ color: isBurned ? '#ffc4b0' : 'var(--green-glow)' }}>
                {'popularName' in selectedData ? selectedData.popularName : selectedData.title}
              </strong>
            </div>
          )}
        </div>

        {/* Centro / Direita: Seletor ANTES & DEPOIS */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(7, 26, 20, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '5px 8px',
            borderRadius: '30px',
            border: isBurned ? '1px solid var(--alert-orange)' : '1px solid var(--green-glow)',
            boxShadow: isBurned ? '0 0 16px rgba(255, 113, 61, 0.3)' : '0 0 16px rgba(101, 230, 165, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          <button
            onClick={() => onModeChange('preserved')}
            style={{
              background: !isBurned ? 'var(--green-primary)' : 'transparent',
              color: !isBurned ? '#ffffff' : 'rgba(241, 245, 242, 0.65)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: !isBurned ? 700 : 500,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🌿</span> PRESERVADA
          </button>

          <button
            onClick={() => onModeChange('burned')}
            style={{
              background: isBurned ? 'var(--alert-orange)' : 'transparent',
              color: isBurned ? '#ffffff' : 'rgba(241, 245, 242, 0.65)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: isBurned ? 700 : 500,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🔥</span> QUEIMADAS
          </button>
        </div>
      </div>

      {/* 3. BARRA INFERIOR DE INDICADORES CIENTÍFICOS (GRID HORIZONTAL LIMPO) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          gap: '8px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {isBurned ? (
          <>
            <div
              style={{
                flex: 1,
                minWidth: '160px',
                background: 'rgba(22, 14, 10, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 113, 61, 0.35)',
                padding: '6px 10px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ color: 'var(--alert-orange)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                VEGETAÇÃO AFETADA
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.68rem', marginTop: '2px' }}>
                Colapso do dossel superior e matrizes
              </div>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: '160px',
                background: 'rgba(22, 14, 10, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 113, 61, 0.35)',
                padding: '6px 10px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ color: 'var(--alert-orange)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                HABITAT ALTERADO
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.68rem', marginTop: '2px' }}>
                Fuga forçada de aves dispersoras
              </div>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: '160px',
                background: 'rgba(22, 14, 10, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 113, 61, 0.35)',
                padding: '6px 10px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ color: 'var(--alert-orange)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                SOLO EXPOSTO
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.68rem', marginTop: '2px' }}>
                Perda da serapilheira e erosão
              </div>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: '160px',
                background: 'rgba(22, 14, 10, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 113, 61, 0.35)',
                padding: '6px 10px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ color: 'var(--alert-orange)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                EMISSÕES DE CARBONO
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.68rem', marginTop: '2px' }}>
                Liberação de séculos de biomassa
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              background: 'rgba(7, 26, 20, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(101, 230, 165, 0.25)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: 'var(--green-glow)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            BIOMA EQUILIBRADO: Dossel contínuo • Solo protegido • Cursos hídricos límpidos • Fauna ativa
          </div>
        )}
      </div>
    </div>
  );
};
