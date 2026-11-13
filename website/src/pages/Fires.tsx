import React from 'react';
import { Forest3D } from '../components/Forest3D';
import { type ForestMode } from '../scenes/ForestScene';
import { type InteractiveData } from '../components/InteractiveObject';

interface FiresProps {
  mode: ForestMode;
  onModeChange: (mode: ForestMode) => void;
  onSelectData: (data: InteractiveData | null) => void;
  selectedData: InteractiveData | null;
}

export const Fires: React.FC<FiresProps> = ({
  mode,
  onModeChange,
  onSelectData,
  selectedData,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 75px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Forest3D
        mode={mode}
        onModeChange={onModeChange}
        onSelectData={onSelectData}
        selectedData={selectedData}
      />
    </div>
  );
};
