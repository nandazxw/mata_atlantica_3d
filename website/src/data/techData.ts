/**
 * Base de Dados Científicos: Tecnologia a Favor da Natureza
 * Fontes de Referência: INPE (Programa Queimadas/Deter), MapBiomas, Embrapa e SOS Mata Atlântica.
 */

export type TechSectionId = 'satelites' | 'drones' | 'ia' | 'alertas' | 'restauracao';

export interface TechSection {
  id: TechSectionId;
  title: string;
  subtitle: string;
  icon: string;
  officialSources: string[];
  description: string;
  practicalApplications: {
    title: string;
    description: string;
  }[];
  scientificNote: string;
}

export interface MapLayer {
  id: string;
  name: string;
  color: string;
  active: boolean;
  description: string;
}

export interface SimulatedAlertMetric {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'alerta' | 'otimo';
  description: string;
}

export const TECH_SECTIONS: Record<TechSectionId, TechSection> = {
  satelites: {
    id: 'satelites',
    title: 'Monitoramento Orbital por Satélites',
    subtitle: 'Sensoriamento Remoto & Detecção de Cicatrizes de Queimadas',
    icon: '🛰️',
    officialSources: ['INPE (Instituto Nacional de Pesquisas Espaciais)', 'MapBiomas', 'NASA / ESA (Satélites Sentinel e Landsat)'],
    description: 'Constelações de satélites em órbita polar e geoestacionária registram imagens contínuas da Mata Atlântica em múltiplos comprimentos de onda (óptico, infravermelho próximo e termal).',
    practicalApplications: [
      {
        title: 'Cálculo de Índices de Vegetação (NDVI & EVI)',
        description: 'Mede a quantidade de clorofila ativa e o vigor fotossintético da copa das árvores, permitindo mapear áreas desmatadas ou em estresse hídrico agudo.'
      },
      {
        title: 'Mapeamento de Cicatrizes de Fogo (NBR)',
        description: 'O índice Normalized Burn Ratio compara imagens de antes e depois da passagem do fogo para calcular a extensão exata da área calcinada e a severidade da queima.'
      },
      {
        title: 'Histórico Temporal de Regeneração (MapBiomas)',
        description: 'Séries temporais de mais de 35 anos permitem acompanhar se uma área queimada está conseguindo se recuperar ou se foi convertida em pastagem degradada.'
      }
    ],
    scientificNote: 'Os dados do INPE e MapBiomas são as referências oficiais para o monitoramento de cobertura vegetal e detecção de anomalias térmicas no território brasileiro.'
  },

  drones: {
    id: 'drones',
    title: 'Bio-Drones & Sensoriamento de Proximidade',
    subtitle: 'Inspeção de Encostas Íngremes & Semeadura Direta de Precisão',
    icon: '🚁',
    officialSources: ['Embrapa Instrumentação', 'Iniciativas de Restauração da Mata Atlântica'],
    description: 'Veículos aéreos não tripulados (VANTs) complementam os satélites voando sob as nuvens com câmeras de altíssima resolução espacial (centimétrica) e sensores LiDAR.',
    practicalApplications: [
      {
        title: 'Dispersão de Cápsulas de Sementes (Muvuca Aérea)',
        description: 'Drones agrícolas adaptados lançam esferas de hidrogel e nutrientes contendo sementes nativas em encostas acentuadas da Serra do Mar onde equipes humanas não chegam.'
      },
      {
        title: 'Acompanhamento Individual de Mudas',
        description: 'Fotogrametria de alta resolução conta e mede a taxa de sobrevivência e crescimento de mudas recém-plantadas nas áreas de restauração florestal.'
      },
      {
        title: 'Inspeção Térmica de Focos Residuais',
        description: 'Sensores termais detectam raízes e troncos subterrâneos ainda em brasa após o controle de incêndios florestais, prevenindo o reacendimento do fogo.'
      }
    ],
    scientificNote: 'O uso de drones em relevos montanhosos reduz em até 70% o tempo necessário para o diagnóstico inicial de áreas atingidas por desastres ou deslizamentos.'
  },

  ia: {
    id: 'ia',
    title: 'Inteligência Artificial & Visão Computacional',
    subtitle: 'Reconhecimento de Padrões de Risco & Otimização Ecológica',
    icon: '🧠',
    officialSources: ['Projetos de Pesquisa em Computação Aplicada ao Meio Ambiente (INPE / Universidades)'],
    description: 'Modelos de Machine Learning e Redes Neurais Convolucionais (CNNs) processam terabytes de dados geoespaciais em minutos para detectar anomalias sutis na vegetação.',
    practicalApplications: [
      {
        title: 'Segmentação Automática de Clareiras',
        description: 'Algoritmos de visão computacional identificam pequenas aberturas no dossel causadas por fogo rasteiro ou cortes seletivos antes invisíveis a olho nu.'
      },
      {
        title: 'Modelagem de Corredores de Menor Custo',
        description: 'Algoritmos de grafos espaciais analisam a topografia, estradas e rios para planejar as rotas mais eficientes para conectar fragmentos florestais para a fauna.'
      },
      {
        title: 'Predição de Vulnerabilidade à Seca',
        description: 'Modelos combinam dados de umidade do ar, vento e histórico de chuvas para indicar microbacias que correm maior risco de incêndios no inverno.'
      }
    ],
    scientificNote: 'A IA atua como ferramenta de triagem e auxílio à tomada de decisão para biólogos e brigadistas, exigindo sempre validação por especialistas em campo.'
  },

  alertas: {
    id: 'alertas',
    title: 'Centro de Alertas & Telemetria Ambiental',
    subtitle: 'Indicadores Demonstrativos de Saúde do Ecossistema',
    icon: '📊',
    officialSources: ['Sistemas de Alerta Precoce (INPE / CEMADEN / SOS Mata Atlântica)'],
    description: 'Painel integrado que consolida índices biofísicos da vegetação, focos de calor detectados e status de regeneração de microbacias monitoradas.',
    practicalApplications: [
      {
        title: 'Integração de Sensores IoT no Solo',
        description: 'Pequenos sensores sem fio medem umidade e condutividade elétrica do solo em tempo real na raiz de matrizes arbóreas.'
      },
      {
        title: 'Alertas Antecipados de Estresse Hídrico',
        description: 'Avisos imediatos quando a vegetação atinge níveis críticos de dessecação propícios à queima rápida.'
      },
      {
        title: 'Transparência Pública e Educação',
        description: 'Painéis públicos que permitem à sociedade civil acompanhar o status de conservação das Unidades de Conservação do bioma.'
      }
    ],
    scientificNote: 'Demonstração pedagógica simulada baseada nas estruturas reais de telemetria ambiental utilizadas por agências de monitoramento.'
  },

  restauracao: {
    id: 'restauracao',
    title: 'Restauração Ecológica Tecnológica',
    subtitle: 'Bioengenharia, Genômica de Sementes & Viveiros Inteligentes',
    icon: '🌱',
    officialSources: ['Pacto pela Restauração da Mata Atlântica', 'SOS Mata Atlântica', 'Embrapa Florestas'],
    description: 'A tecnologia aplicada ao plantio inteligente garante que cada muda nativa seja plantada no local com microclima e solo mais favoráveis à sua sobrevivência.',
    practicalApplications: [
      {
        title: 'Mapeamento Prioritário de Áreas de Preservação Permanente (APPs)',
        description: 'Foco inicial da restauração nas margens de riachos e topos de morro para proteger nascentes de água potável.'
      },
      {
        title: 'Inoculação Biotecnológica com Micorrizas',
        description: 'Mudas são inoculadas em viveiro com fungos micorrízicos nativos, multiplicando por 5 a capacidade das raízes de absorver água e fósforo.'
      },
      {
        title: 'Gêmeos Digitais 3D para Acompanhamento de Dossel',
        description: 'Simulações computacionais calculam o ganho de altura e sombra da floresta ao longo de 5, 10 e 20 anos.'
      }
    ],
    scientificNote: 'O Pacto pela Restauração da Mata Atlântica visa recuperar 15 milhões de hectares até 2050, aliando ciência, viveiros comunitários e tecnologias digitais.'
  }
};

// CAMADAS CARTOGRÁFICAS INTERATIVAS PARA O MODO SATÉLITE
export const MAP_LAYERS: MapLayer[] = [
  {
    id: 'vegetacao',
    name: 'Cobertura Vegetal Nativa (NDVI)',
    color: '#65E6A5',
    active: true,
    description: 'Destaque em verde luminoso das áreas com biomassa foliar densa e fotossíntese ativa.'
  },
  {
    id: 'queimadas',
    name: 'Cicatrizes Térmicas Mapeadas (NBR)',
    color: '#FF713D',
    active: true,
    description: 'Polígonos em tom âmbar/laranja indicando áreas atingidas pelo fogo em período recente.'
  },
  {
    id: 'hidrografia',
    name: 'Cursos Hídricos & Matas Ciliares',
    color: '#42BFE8',
    active: true,
    description: 'Rede de riachos, nascentes e faixas de preservação permanente ao longo da bacia.'
  },
  {
    id: 'corredores',
    name: 'Corredores Ecológicos Planejados',
    color: '#FBBF24',
    active: false,
    description: 'Trajetos de conectividade propostos por algoritmos para unir fragmentos florestais isolados.'
  }
];

// MÉTRICAS DEMONSTRATIVAS DO CENTRO DE COMANDO (SIMULADAS PEDAGOGICAMENTE)
export const SIMULATED_METRICS: SimulatedAlertMetric[] = [
  {
    label: 'ÁREA MONITORADA (DEMONSTRAÇÃO)',
    value: '12.450',
    unit: 'hectares',
    status: 'normal',
    description: 'Área da bacia hidrográfica coberta por monitoramento orbital multiespectral simulado.'
  },
  {
    label: 'VIGOR MÉDIO DE VEGETAÇÃO (NDVI)',
    value: '0,74',
    unit: 'índice (0 a 1)',
    status: 'otimo',
    description: 'Indica dossel denso com fotossíntese ativa nos fragmentos florestais preservados.'
  },
  {
    label: 'CICATRIZES TÉRMICAS DETECTADAS',
    value: '3',
    unit: 'polígonos',
    status: 'alerta',
    description: 'Áreas com anomalias de queima mapeadas para intervenção prioritária de semeadura.'
  },
  {
    label: 'MUDAS EM ACOMPANHAMENTO VANT',
    value: '45.000',
    unit: 'indivíduos',
    status: 'otimo',
    description: 'Plantio de enriquecimento com pioneiras sendo monitorado periodicamente por drones.'
  }
];
