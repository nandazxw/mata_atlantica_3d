/**
 * Base de Dados Tróficos da Mata Atlântica
 * Relações alimentares fundamentadas na ecologia de florestas tropicais úmidas.
 */

export type TrophicLevel = 
  | 'producer' 
  | 'primary_consumer' 
  | 'secondary_consumer' 
  | 'tertiary_consumer' 
  | 'decomposer';

export interface FoodWebOrganism {
  id: string;
  popularName: string;
  scientificName?: string;
  level: TrophicLevel;
  levelLabel: string;
  levelColor: string; // Cor temática do nível trófico
  diet: string;
  preysOn: string[]; // IDs dos organismos dos quais se alimenta
  predatorsOf: string[]; // IDs dos organismos que se alimentam dele
  ecologicalRole: string;
  environmentalImportance: string;
  fireImpact: {
    status: 'Destruição Imediata' | 'Fome Crítica / Fuga' | 'Perda de Presas em Cascata' | 'Sobrecarga de Matéria Morta';
    description: string;
    isDirectlyKilled: boolean;
  };
}

export const TROPHIC_COLORS: Record<TrophicLevel, string> = {
  producer: '#65E6A5',          // Verde Luminoso
  primary_consumer: '#E6C565',  // Amarelo Trófico
  secondary_consumer: '#FF9E42',// Laranja Mesopredador
  tertiary_consumer: '#FF5C7A', // Magenta / Predador de Topo
  decomposer: '#42BFE8',        // Azul Tecnológico
};

export const FOOD_WEB_ORGANISMS: Record<string, FoodWebOrganism> = {
  'embauba': {
    id: 'embauba',
    popularName: 'Embaúba & Folhagens Nativas',
    scientificName: 'Cecropia hololeuca',
    level: 'producer',
    levelLabel: 'Produtor Primário',
    levelColor: TROPHIC_COLORS.producer,
    diet: 'Fotossíntese (converte energia solar e minerais do solo em biomassa)',
    preysOn: [],
    predatorsOf: ['lagarta', 'mico-leao'],
    ecologicalRole: 'Espécie pioneira de crescimento rápido que fornece folhas para herbívoros e frutos para primatas e morcegos.',
    environmentalImportance: 'Base da pirâmide de energia da floresta; capta carbono atmosférico e produz oxigênio.',
    fireImpact: {
      status: 'Destruição Imediata',
      description: 'As folhas finas e a casca sensível queimam rapidamente, suprimindo a oferta primária de alimento para os herbívoros.',
      isDirectlyKilled: true,
    }
  },

  'palmeira-frutos': {
    id: 'palmeira-frutos',
    popularName: 'Frutos da Palmeira-Juçara',
    scientificName: 'Euterpe edulis',
    level: 'producer',
    levelLabel: 'Produtor Primário',
    levelColor: TROPHIC_COLORS.producer,
    diet: 'Fotossíntese autotrófica',
    preysOn: [],
    predatorsOf: ['mico-leao', 'ave-surucua'],
    ecologicalRole: 'Frutificação abundante no inverno quando outros alimentos escasseiam na floresta.',
    environmentalImportance: 'Recurso-chave que mantém as populações de aves e mamíferos arborícolas vivas durante a estação seca.',
    fireImpact: {
      status: 'Destruição Imediata',
      description: 'O fogo consome os cachos de frutos e mata o meristema apical da palmeira, cessando a produção de sementes.',
      isDirectlyKilled: true,
    }
  },

  'lagarta': {
    id: 'lagarta',
    popularName: 'Lagarta-da-Mata',
    scientificName: 'Morpho helenor (larva)',
    level: 'primary_consumer',
    levelLabel: 'Consumidor Primário (Herbívoro)',
    levelColor: TROPHIC_COLORS.primary_consumer,
    diet: 'Folhas tenras de árvores nativas como a embaúba',
    preysOn: ['embauba'],
    predatorsOf: ['ave-surucua'],
    ecologicalRole: 'Transforma matéria vegetal dura em proteína e biomassa animal acessível para aves e pequenos répteis.',
    environmentalImportance: 'Regulador da densidade foliar e elo crucial entre as plantas e os animais carnívoros.',
    fireImpact: {
      status: 'Destruição Imediata',
      description: 'Incapazes de fugir velozmente, morrem desidratadas pelo calor ou perecem pela queima imediata das plantas que as hospedam.',
      isDirectlyKilled: true,
    }
  },

  'mico-leao': {
    id: 'mico-leao',
    popularName: 'Mico-leão-dourado',
    scientificName: 'Leontopithecus rosalia',
    level: 'primary_consumer',
    levelLabel: 'Consumidor Primário / Frugívoro',
    levelColor: TROPHIC_COLORS.primary_consumer,
    diet: 'Frutos silvestres (juçara, embaúba), néctar e pequenos insetos',
    preysOn: ['embauba', 'palmeira-frutos'],
    predatorsOf: ['gaviao', 'jararaca'],
    ecologicalRole: 'Dispersor eficiente de sementes grandes em diferentes áreas da floresta.',
    environmentalImportance: 'Símbolo da preservação do bioma; essencial para a regeneração genética da vegetação.',
    fireImpact: {
      status: 'Fome Crítica / Fuga',
      description: 'O fogo destrói ocos de árvores onde dormem e queima as copas frutíferas, forçando-os a fugir e correr risco no chão.',
      isDirectlyKilled: false,
    }
  },

  'ave-surucua': {
    id: 'ave-surucua',
    popularName: 'Surucuá-variado / Ave Insetívora',
    scientificName: 'Trogon surrucura',
    level: 'secondary_consumer',
    levelLabel: 'Consumidor Secundário (Insetívoro/Frugívoro)',
    levelColor: TROPHIC_COLORS.secondary_consumer,
    diet: 'Lagartas, besouros, gafanhotos e pequenos frutos de palmeira',
    preysOn: ['lagarta', 'palmeira-frutos'],
    predatorsOf: ['gaviao'],
    ecologicalRole: 'Controlador biológico de populações de insetos herbívoros da folhagem.',
    environmentalImportance: 'Impede infestações de insetos que poderiam desfolhar excessivamente as árvores nativas.',
    fireImpact: {
      status: 'Perda de Presas em Cascata',
      description: 'Embora possa voar para escapar das chamas, encontra a área sem lagartas e ninhos queimados, abandonando o território.',
      isDirectlyKilled: false,
    }
  },

  'jararaca': {
    id: 'jararaca',
    popularName: 'Jararaca da Mata',
    scientificName: 'Bothrops jararaca',
    level: 'secondary_consumer',
    levelLabel: 'Consumidor Secundário (Carnívoro)',
    levelColor: TROPHIC_COLORS.secondary_consumer,
    diet: 'Pequenos roedores e filhotes de primatas ou aves terrestres',
    preysOn: ['mico-leao'],
    predatorsOf: ['gaviao'],
    ecologicalRole: 'Predadora de emboscada no solo e na vegetação rasteira; controla roedores silvestres.',
    environmentalImportance: 'Evita a superpopulação de roedores que transmitem zoonoses e consomem sementes no solo.',
    fireImpact: {
      status: 'Destruição Imediata',
      description: 'Habitando a serapilheira e o chão da floresta, sofre asfixia pela fumaça rente ao solo e queimaduras fatais.',
      isDirectlyKilled: true,
    }
  },

  'gaviao': {
    id: 'gaviao',
    popularName: 'Gavião-pega-macaco / Predador Topo',
    scientificName: 'Spizaetus tyrannus',
    level: 'tertiary_consumer',
    levelLabel: 'Consumidor Terciário (Predador de Topo)',
    levelColor: TROPHIC_COLORS.tertiary_consumer,
    diet: 'Serpentes, aves, primatas e pequenos mamíferos arborícolas',
    preysOn: ['ave-surucua', 'jararaca', 'mico-leao'],
    predatorsOf: [],
    ecologicalRole: 'Predador ápice que mantém as populações de mesocarnívoros e herbívoros em equilíbrio dinâmico.',
    environmentalImportance: 'Elimina indivíduos doentes e fracos, fortalecendo a genética populacional de suas presas.',
    fireImpact: {
      status: 'Perda de Presas em Cascata',
      description: 'Mesmo sem morrer diretamente no fogo, perde toda a teia de presas que sustentava seu território, sendo expulso da região.',
      isDirectlyKilled: false,
    }
  },

  'fungos-decompositores': {
    id: 'fungos-decompositores',
    popularName: 'Fungos Decompositores & Micobiota',
    scientificName: 'Pycnoporus sanguineus / Fungos micorrízicos',
    level: 'decomposer',
    levelLabel: 'Decompositores (Cicladores de Matéria)',
    levelColor: TROPHIC_COLORS.decomposer,
    diet: 'Matéria orgânica morta (galhos caídos, folhas secas, animais mortos)',
    preysOn: ['embauba', 'lagarta', 'mico-leao', 'ave-surucua', 'jararaca', 'gaviao'],
    predatorsOf: [],
    ecologicalRole: 'Quebra moléculas orgânicas complexas, devolvendo nitrogênio, fósforo e minerais ao solo para os produtores.',
    environmentalImportance: 'Sem os decompositores, a matéria orgânica se acumularia sem reciclar e as plantas morreriam por falta de nutrientes.',
    fireImpact: {
      status: 'Sobrecarga de Matéria Morta',
      description: 'A camada superficial de micélios é esterilizada pelo calor do solo. Apenas fungos pioneiros de carvão sobrevivem lentamente.',
      isDirectlyKilled: true,
    }
  }
};
