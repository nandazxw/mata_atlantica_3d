import * as THREE from 'three';
import { type SpeciesData } from '../data/organisms';
import { type FireImpactData } from '../data/impacts';

export type InteractiveData = SpeciesData | FireImpactData;

export interface ClickableObjectMeta {
  id: string;
  data: InteractiveData;
  isBurnedMode?: boolean;
}

/**
 * Utilitário para marcar um objeto 3D e seus filhos como clicáveis,
 * suportando tanto dados de espécies saudáveis quanto dados de impactos de queimadas.
 */
export function markAsClickable(root: THREE.Object3D, meta: ClickableObjectMeta) {
  root.userData = {
    isInteractive: true,
    isRootInteractive: true,
    ...meta,
  };

  root.traverse((child) => {
    child.userData = {
      isInteractive: true,
      rootInteractive: root,
      ...meta,
    };
  });
}
