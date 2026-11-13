/**
 * Base de Dados Científicos dos Ciclos Biogeoquímicos da Mata Atlântica
 * Conteúdo validado de biogeoquímica florestal e ecologia de ecossistemas.
 */

export type CycleType = 'water' | 'carbon' | 'nitrogen';

export interface CycleStepData {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  color: string;
  naturalProcess: string;
  biologicalImportance: string;
  fireAlteration: string; // Alteração qualitativa provocada pelas queimadas
}

export interface BiogeochemicalCycle {
  id: CycleType;
  title: string;
  subtitle: string;
  accentColor: string;
  description: string;
  steps: CycleStepData[];
  fireImpactSummary: {
    title: string;
    description: string;
    keyPoints: string[];
  };
}

export const BIOGEOCHEMICAL_CYCLES: Record<CycleType, BiogeochemicalCycle> = {
  // 1. CICLO DA ÁGUA (HIDROLÓGICO)
  water: {
    id: 'water',
    title: 'Ciclo Hidrológico Florestal',
    subtitle: 'A Bomba Biótica de Água da Mata Atlântica',
    accentColor: '#42BFE8',
    description: 'A floresta atua como uma esponja reguladora gigantesca: absorve chuvas oceânicas, alimenta aquíferos e devolve vapor d’água para a atmosfera através da transpiração contínua das árvores.',
    steps: [
      {
        id: 'evaporacao',
        name: '1. Evaporação',
        category: 'Físico / Térmico',
        position: [-6, 0.5, 2],
        color: '#42BFE8',
        naturalProcess: 'A energia solar aquece rios, córregos e a serapilheira úmida, transformando água líquida em vapor que sobe para a atmosfera.',
        biologicalImportance: 'Mantém a umidade atmosférica necessária para a sobrevivência de anfíbios e epífitas no sub-bosque.',
        fireAlteration: 'Com rios assoreados e margens desmatadas, a água escoa mais rápido e o leito seca prematuramente nas secas.'
      },
      {
        id: 'transpiracao',
        name: '2. Transpiração Vegetal',
        category: 'Biológico / Fisiológico',
        position: [-3.5, 3.2, 0],
        color: '#65E6A5',
        naturalProcess: 'As árvores de grande porte bombeiam centenas de litros de água do subsolo por dia, liberando vapor pelos estômatos das folhas (evapotranspiração).',
        biologicalImportance: 'Cria os "rios voadores" da costa brasileira, resfriando a temperatura regional e gerando chuvas orográficas na Serra do Mar.',
        fireAlteration: 'A queima e perda da copa arbórea suprime a transpiração, tornando o microclima local muito mais quente e árido.'
      },
      {
        id: 'condensacao',
        name: '3. Condensação & Nuvens',
        category: 'Atmosférico',
        position: [0, 6.0, 0],
        color: '#F1F5F2',
        naturalProcess: 'O vapor resfria em altitudes mais elevadas e se condensa ao redor de aerossóis biológicos (pólen e terpenos emitidos pela floresta), formando nuvens densas.',
        biologicalImportance: 'Garante a nebulosidade constante que dá o nome à "Floresta Ombrófila Densa" (floresta das chuvas).',
        fireAlteration: 'A fumaça e fuligem em excesso alteram o tamanho das microgotas de nuvens, podendo suprimir chuvas leves regulares.'
      },
      {
        id: 'precipitacao',
        name: '4. Precipitação Filtrada',
        category: 'Meteorológico',
        position: [3.5, 3.2, 0],
        color: '#42BFE8',
        naturalProcess: 'A chuva atinge o dossel de árvores centenárias, que amortecem a queda das gotas antes que elas toquem o chão com suavidade.',
        biologicalImportance: 'Evita a desagregação do solo e permite que a água escorra pelos troncos alimentando bromélias e musgos.',
        fireAlteration: 'Sem dossel protetor, gotas pesadas impactam diretamente a terra nua, compactando os poros do solo.'
      },
      {
        id: 'infiltracao',
        name: '5. Infiltração & Aquíferos',
        category: 'Edafológico / Subterrâneo',
        position: [6, 0.5, 2],
        color: '#1F704B',
        naturalProcess: 'A serapilheira de folhas mortas e as galerias de raízes agem como um filtro poroso, permitindo que a água infiltre lentamente até os lençóis freáticos.',
        biologicalImportance: 'Alimenta nascentes permanentes que abastecem bacias hidrográficas vitais do Sul e Sudeste brasileiro.',
        fireAlteration: 'O calor esteriliza a matéria orgânica e torna a superfície hidrofóbica (repele água), reduzindo drasticamente a recarga freática.'
      },
      {
        id: 'escoamento',
        name: '6. Escoamento Superficial',
        category: 'Hidrológico',
        position: [0, -1.2, 3],
        color: '#2892b0',
        naturalProcess: 'O excedente da água corre lentamente pelo chão retido pelas raízes das matas ciliares até retornar aos riachos de águas limpas.',
        biologicalImportance: 'Mantém o fluxo equilibrado dos corpos hídricos sem causar inundações violentas nem ressecamento dos leitos.',
        fireAlteration: 'Sem vegetação ciliar, enxurradas violentas lavam o solo (erosão laminar) e carregam lama e cinzas para o rio (assoreamento).'
      }
    ],
    fireImpactSummary: {
      title: 'Desequilíbrio Hidrológico Pós-Queimada',
      description: 'A queima da cobertura florestal quebra a capacidade de amortecimento e reciclagem da água na bacia.',
      keyPoints: [
        'Redução severa da evapotranspiração foliar',
        'Solo compactado com perda da capacidade de infiltração',
        'Enxurradas rápidas e assoreamento de nascentes de água potável',
        'Aumento do risco de estiagens prolongadas e secas no microclima'
      ]
    }
  },

  // 2. CICLO DO CARBONO
  carbon: {
    id: 'carbon',
    title: 'Ciclo do Carbono & Regulação Climática',
    subtitle: 'Do Sequestro Fotossintético à Estocagem na Biomassa',
    accentColor: '#65E6A5',
    description: 'A Mata Atlântica é um dos reservatórios terrestres de carbono mais importantes do continente. Retira dióxido de carbono da atmosfera e o fixa em madeira viva por séculos.',
    steps: [
      {
        id: 'fotossintese',
        name: '1. Fotossíntese & Sequestro',
        category: 'Bioquímico',
        position: [-6, 3.0, 0],
        color: '#65E6A5',
        naturalProcess: 'Cloroplastos nas folhas utilizam a luz solar para capturar CO₂ da atmosfera e sintetizar glicose e celulose.',
        biologicalImportance: 'Retira gases de efeito estufa da atmosfera e gera oxigênio essencial para os seres vivos.',
        fireAlteration: 'A destruição da área foliar interrompe imediatamente a taxa fotossintética local.'
      },
      {
        id: 'armazenamento',
        name: '2. Estocagem na Biomassa',
        category: 'Estrutural',
        position: [-2.5, 0.8, -1.5],
        color: '#1F704B',
        naturalProcess: 'O carbono é incorporado em troncos densos (como jequitibás e perobas), raízes profundas e folhas permanentes.',
        biologicalImportance: 'Árvores centenárias acumulam toneladas de carbono por hectare, funcionando como gigantescos "cofres de carbono".',
        fireAlteration: 'O fogo consome o estoque de madeira construído lentamente ao longo de décadas e séculos.'
      },
      {
        id: 'cadeia-trofica-carbono',
        name: '3. Transferência Trófica',
        category: 'Ecológico',
        position: [2.5, 0.8, -1.5],
        color: '#E6C565',
        naturalProcess: 'Herbívoros consomem folhas e frutos; carnívoros se alimentam de herbívoros, transferindo carbono orgânico pela teia alimentar.',
        biologicalImportance: 'Permite a construção de tecidos musculares, ossos e estruturas biológicas de toda a fauna.',
        fireAlteration: 'Com a morte ou fuga de animais, a rota de fixação biológica animal na área é rompida.'
      },
      {
        id: 'respiracao',
        name: '4. Respiração Celular',
        category: 'Metabólico',
        position: [0, 4.0, 1.5],
        color: '#42BFE8',
        naturalProcess: 'Plantas, animais e microrganismos respiram oxigênio para quebrar glicose, liberando uma fração de CO₂ equilibrada de volta ao ar.',
        biologicalImportance: 'Processo universal de obtenção de energia celular em equilíbrio com a taxa de fotossíntese.',
        fireAlteration: 'A perda da biomassa viva altera a taxa de respiração autotrófica da floresta.'
      },
      {
        id: 'decomposicao-solo',
        name: '5. Carbono no Solo (Húmus)',
        category: 'Edafológico',
        position: [-3.5, -1.5, 2],
        color: '#8d5b4c',
        naturalProcess: 'Folhas caídas e galhos mortos são decompostos por fungos e bactérias, formando o húmus escuro que estoca carbono no solo.',
        biologicalImportance: 'Aumenta a fertilidade da terra e a retenção de água nas raízes por longos períodos.',
        fireAlteration: 'O fogo calcina a serapilheira e expõe o carbono orgânico do solo à mineralização rápida e perda para a atmosfera.'
      },
      {
        id: 'combustao-queimadas',
        name: '6. Emissão por Queimadas',
        category: 'Combustão / Perturbação',
        position: [3.5, -1.5, 2],
        color: '#FF713D',
        naturalProcess: 'A combustão rápida quebra as moléculas de celulose e lignina na presença de oxigênio, oxidando a biomassa.',
        biologicalImportance: 'Em florestas não adaptadas ao fogo como a Mata Atlântica, a queima não é um processo ecológico natural regular.',
        fireAlteration: 'Liberação maciça e abrupta de CO₂, monóxido de carbono e fuligem, transformando a floresta de "sumidouro" em "fonte emissora" de carbono.'
      }
    ],
    fireImpactSummary: {
      title: 'Inversão Climática: Do Sumidouro à Emissão',
      description: 'O fogo converte séculos de estoque de carbono vegetal em gases de efeito estufa na atmosfera.',
      keyPoints: [
        'Interrupção imediata da captura fotossintética de CO₂',
        'Liberação maciça do carbono acumulado nos troncos antigos',
        'Oxidação e perda do carbono orgânico armazenado no solo',
        'Aceleração do efeito estufa e aumento das temperaturas regionais'
      ]
    }
  },

  // 3. CICLO DO NITROGÊNIO
  nitrogen: {
    id: 'nitrogen',
    title: 'Ciclo do Nitrogênio & Microbiota do Solo',
    subtitle: 'A Circulação Química Invisível dos Nutrientes Vitais',
    accentColor: '#A78BFA',
    description: 'O nitrogênio é o nutriente fundamental para a formação de proteínas, enzimas e DNA de plantas e animais. Embora abundante no ar como gás N₂, precisa de bactérias para ser aproveitado.',
    steps: [
      {
        id: 'fixacao',
        name: '1. Fixação Biológica de N₂',
        category: 'Microbiológico',
        position: [-6, -0.5, 0],
        color: '#A78BFA',
        naturalProcess: 'Bactérias simbióticas (como Rhizobium) alojadas nas raízes de árvores leguminosas nativas (ingás, jacarandás) capturam o N₂ do ar e o transformam em amônia.',
        biologicalImportance: 'É a porta de entrada primária do nitrogênio inorgânico na biosfera viva.',
        fireAlteration: 'O aquecimento extremo dos primeiros centímetros do solo incinera as raízes superficiais e destrói os nódulos bacterianos fixadores.'
      },
      {
        id: 'amonificacao',
        name: '2. Amonificação (Decomposição)',
        category: 'Bioquímico',
        position: [-2.5, -1.5, 2],
        color: '#65E6A5',
        naturalProcess: 'Fungos e bactérias saprófitas degradam fezes de animais e folhas caídas, convertendo proteínas mortas em amônio (NH₄⁺).',
        biologicalImportance: 'Recicla os compostos nitrogenados presentes na serapilheira de volta para o solo fértil.',
        fireAlteration: 'A queima da matéria orgânica volatiliza grande parte do nitrogênio em gases (NOx) que se perdem no ar.'
      },
      {
        id: 'nitrificacao',
        name: '3. Nitrificação (2 Etapas)',
        category: 'Bacteriano Quimiossintético',
        position: [2.5, -1.5, 2],
        color: '#38BDF8',
        naturalProcess: 'Bactérias Nitrosomonas oxidam a amônia em nitrito (NO₂⁻); em seguida, bactérias Nitrobacter oxidam o nitrito em nitrato solúvel (NO₃⁻).',
        biologicalImportance: 'O nitrato é a forma química de nitrogênio que as raízes das árvores conseguem absorver eficientemente com facilidade.',
        fireAlteration: 'As bactérias nitrificantes são altamente vulneráveis ao calor do fogo, desacelerando a formação de nitrato no solo calcinado.'
      },
      {
        id: 'assimilacao',
        name: '4. Assimilação Vegetal',
        category: 'Fisiológico Vegetal',
        position: [6, 1.2, 0],
        color: '#10B981',
        naturalProcess: 'As raízes das árvores absorvem o nitrato da solução do solo e o transportam até as folhas para construir clorofila, proteínas e novas folhas.',
        biologicalImportance: 'Permite o rápido crescimento vegetal e a regeneração de galhos e frutos que nutrirão a fauna.',
        fireAlteration: 'Sem raízes ativas e sem microbiota funcional, as mudas sofrem carência nutricional severa de nitrogênio.'
      },
      {
        id: 'cadeia-trofica-nitrogenio',
        name: '5. Consumo pelos Animais',
        category: 'Ecológico',
        position: [2.5, 3.8, 0],
        color: '#FBBF24',
        naturalProcess: 'Os animais obtêm nitrogênio orgânico exclusivamente alimentando-se de plantas ou de outros animais herbívoros.',
        biologicalImportance: 'Indispensável para o desenvolvimento de músculos, anticorpos e reprodução de toda a fauna.',
        fireAlteration: 'A morte ou fuga da fauna interrompe a ciclagem de dejetos e nutrientes no interior da floresta.'
      },
      {
        id: 'desnitrificacao',
        name: '6. Desnitrificação',
        category: 'Microbiológico Anaeróbio',
        position: [-2.5, 4.5, 0],
        color: '#C084FC',
        naturalProcess: 'Bactérias desnitrificantes no solo profundo convertem nitratos residuais de volta em gás N₂, fechando o ciclo natural na atmosfera.',
        biologicalImportance: 'Mantém o equilíbrio da composição gasosa da atmosfera e evita o acúmulo excessivo e tóxico de nitratos nos rios.',
        fireAlteration: 'Desregula o equilíbrio biológico do solo, acelerando perdas químicas de nutrientes vitais.'
      }
    ],
    fireImpactSummary: {
      title: 'Perda e Volatilização de Nutrientes',
      description: 'Diferente de nutrientes minerais pesados, o nitrogênio é termossensível e evapora com facilidade sob temperaturas de fogo florestal.',
      keyPoints: [
        'Volatilização de grande parte do nitrogênio da serapilheira para a fumaça',
        'Morte das bactérias benéficas fixadoras de nitrogênio (Rhizobium)',
        'Esterilização dos microrganismos nitrificantes essenciais às plantas',
        'Dificuldade prolongada de nutrição para novas mudas nativas no solo'
      ]
    }
  }
};
