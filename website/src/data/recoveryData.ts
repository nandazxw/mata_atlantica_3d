/**
 * Base de Dados da Sucessão Ecológica e Recuperação da Mata Atlântica
 * Contém dados científicos de cada fase e os elementos 3D clicáveis individuais por fase.
 */

export type SuccessionalStageId = 'fase1' | 'fase2' | 'fase3' | 'fase4';

export interface StageElementData {
  id: string;
  stageId: SuccessionalStageId;
  name: string;
  scientificName?: string;
  category: 'Solo / Resíduo' | 'Vegetação Pioneira' | 'Fungos / Solo' | 'Árvore em Crescimento' | 'Árvore Clímax / Epífita' | 'Tecnologia';
  description: string;
  roleInSuccession: string;
  ecologicalSignificance: string;
}

export interface SuccessionalStage {
  id: SuccessionalStageId;
  number: number;
  title: string;
  subtitle: string;
  characteristics: string[];
  soilCondition: string;
  vegetationCover: string;
  wildlifePresence: string;
  ecologicalProcess: string;
  icon: string;
}

export interface LimitingFactor {
  id: string;
  title: string;
  icon: string;
  mechanism: string;
  ecologicalConsequence: string;
  mitigation: string;
}

export interface RecoveryTechnology {
  id: string;
  name: string;
  icon: string;
  application: string;
  benefit: string;
}

// ELEMENTOS 3D CLICÁVEIS EM CADA UMA DAS 4 FASES
export const STAGE_ELEMENTS: Record<string, StageElementData> = {
  // --- FASE 1: ÁREA RECENTEMENTE QUEIMADA ---
  'tronco-calcinado-f1': {
    id: 'tronco-calcinado-f1',
    stageId: 'fase1',
    name: 'Tronco de Madeira Carbonizada',
    category: 'Solo / Resíduo',
    description: 'Resto de árvore de casca fina que sucumbiu ao calor das chamas. A queima do câmbio vascular impede a circulação de seiva.',
    roleInSuccession: 'Atua como fonte lenta de matéria orgânica calcinada que será gradativamente decomposta ao longo dos anos.',
    ecologicalSignificance: 'Simboliza a perda estrutural imediata do dossel e a morte da biomassa aérea que sustentava os estratos superiores.'
  },
  'tronco-caido-f1': {
    id: 'tronco-caido-f1',
    stageId: 'fase1',
    name: 'Madeira Caída & Detritos Carbonizados',
    category: 'Solo / Resíduo',
    description: 'Tronco tombado no solo após perder a sustentação basal calcinada pelas chamas rasteiras.',
    roleInSuccession: 'Cria micro-barreiras físicas contra o escoamento rápido da água da chuva, retendo sedimentos na encosta.',
    ecologicalSignificance: 'Embora morto, servirá como futuro substrato úmido para fungos pioneiros e insetos xilófagos.'
  },
  'foco-cinzas-f1': {
    id: 'foco-cinzas-f1',
    stageId: 'fase1',
    name: 'Depósito de Cinzas & Solo Queimado',
    category: 'Solo / Resíduo',
    description: 'Camada de resíduos minerais provenientes da queima completa da serapilheira e folhas secas.',
    roleInSuccession: 'Promove uma alcalinização temporária do pH do solo com liberação rápida de potássio, cálcio e magnésio.',
    ecologicalSignificance: 'Nutrientes que não forem rapidamente absorvidos por pioneiras ou fixados no solo correm alto risco de lixiviação pelas primeiras chuvas.'
  },

  // --- FASE 2: INÍCIO DA REGENERAÇÃO ---
  'broto-verde-f2': {
    id: 'broto-verde-f2',
    stageId: 'fase2',
    name: 'Brotos Rasteiros & Ervas Anuais',
    scientificName: 'Gramíneas nativas e ervas pioneiras',
    category: 'Vegetação Pioneira',
    description: 'Plantas herbáceas de rápido crescimento originadas de sementes leves trazidas pelo vento ou de raízes subterrâneas sobreviventes.',
    roleInSuccession: 'Cobrem rapidamente a superfície nua da terra, funcionando como um cobertor vivo que reduz a temperatura do solo.',
    ecologicalSignificance: 'Criam a primeira barreira anti-erosiva e produzem o primeiro aporte de matéria orgânica fresca pós-incêndio.'
  },
  'rebrota-tronco-f2': {
    id: 'rebrota-tronco-f2',
    stageId: 'fase2',
    name: 'Toco em Rebrota Basal',
    scientificName: 'Rebrota vegetativa pós-fogo',
    category: 'Vegetação Pioneira',
    description: 'Espécies arbóreas com sistema radicular profundo sobrevivente que emitem brotos vigorosos diretamente do colo da raiz.',
    roleInSuccession: 'Aproveitam a estrutura de raízes já instalada para crescer muito mais rápido do que plântulas que partem de sementes.',
    ecologicalSignificance: 'Acelera a restauração da estrutura vertical sem depender exclusivamente do banco de sementes externo.'
  },
  'fungos-pioneiros-f2': {
    id: 'fungos-pioneiros-f2',
    stageId: 'fase2',
    name: 'Fungos Decompositores Pioneiros',
    scientificName: 'Fungos saprófitos e pirófilos',
    category: 'Fungos / Solo',
    description: 'Macrofungos que colonizam rapidamente a madeira morta e os carvões superficiais no início da sucessão secundária.',
    roleInSuccession: 'Digerem a lignina e a celulose dos troncos queimados, transformando madeira dura em matéria orgânica assimilável.',
    ecologicalSignificance: 'Sem os decompositores, os nutrientes aprisionados na madeira calcinada levariam décadas a mais para retornar às plantas.'
  },

  // --- FASE 3: FLORESTA EM DESENVOLVIMENTO ---
  'arvore-pioneira-f3': {
    id: 'arvore-pioneira-f3',
    stageId: 'fase3',
    name: 'Árvore Pioneira Jovem (Embaúba)',
    scientificName: 'Cecropia pachystachya / C. hololeuca',
    category: 'Árvore em Crescimento',
    description: 'Árvores de caule delgado, madeira leve e folhas largas que demandam sol direto e crescem metros por ano.',
    roleInSuccession: 'Criam o primeiro dossel contínuo sombreado, diminuindo a radiação direta e amenizando a temperatura do chão.',
    ecologicalSignificance: 'Sob a sombra fresca das pioneiras, germinam as sementes de espécies secundárias e clímax que morreriam no sol escaldante.'
  },
  'arbusto-subbosque-f3': {
    id: 'arbusto-subbosque-f3',
    stageId: 'fase3',
    name: 'Arbustos do Sub-bosque em Expansão',
    scientificName: 'Piperáceas e Melastomatáceas nativas',
    category: 'Vegetação Pioneira',
    description: 'Arbustos densos que formam uma camada intermediária de vegetação entre 1 e 3 metros de altura.',
    roleInSuccession: 'Protegem as margens de riachos e produzem pequenas bagas que alimentam aves e morcegos dispersores.',
    ecologicalSignificance: 'Atraem a fauna frugívora que traz no trato digestivo sementes de árvores nobres de florestas vizinhas.'
  },

  // --- FASE 4: FLORESTA MAIS MADURA ---
  'jequitiba-maduro-f4': {
    id: 'jequitiba-maduro-f4',
    stageId: 'fase4',
    name: 'Jequitibá-rosa & Árvores Clímax',
    scientificName: 'Cariniana legalis',
    category: 'Árvore Clímax / Epífita',
    description: 'Árvores de madeira densa, grande porte e alta longevidade que dominam o estrato superior do dossel maduro.',
    roleInSuccession: 'Representam a consolidação da sucessão ecológica tardia, conferindo estabilidade estrutural ao bioma.',
    ecologicalSignificance: 'Estocam toneladas de carbono por séculos e servem de abrigo para aves de rapina e mamíferos arborícolas.'
  },
  'bromelia-epifita-f4': {
    id: 'bromelia-epifita-f4',
    stageId: 'fase4',
    name: 'Bromélia Epífita no Tronco',
    scientificName: 'Aechmea sp. / Bromeliaceae',
    category: 'Árvore Clímax / Epífita',
    description: 'Planta epífita que vive apoiada no tronco de grandes árvores maduras sem parasitá-las, retendo água da chuva nas folhas.',
    roleInSuccession: 'Bioindicador de floresta madura e úmida; não consegue sobreviver nas fases iniciais ensolaradas e secas.',
    ecologicalSignificance: 'Cria micro-aquários suspensos que servem de bebedouro e berçário reprodutivo para anfíbios e insetos do dossel.'
  },
  'palmeira-jucara-f4': {
    id: 'palmeira-jucara-f4',
    stageId: 'fase4',
    name: 'Palmeira-juçara em Frutificação',
    scientificName: 'Euterpe edulis',
    category: 'Árvore Clímax / Epífita',
    description: 'Palmeira esbelta de sub-bosque que necessita de sombra durante a juventude e umidade contínua no solo.',
    roleInSuccession: 'Espécie-chave que sinaliza a reconexão dos ciclos tróficos de inverno na floresta restaurada.',
    ecologicalSignificance: 'Seus frutos abundantes alimentam tucanos, jacus, antas e roedores, fechando o ciclo reprodutivo do bioma.'
  },

  // --- DRONE BIOLÓGICO (QUANDO ATIVO) ---
  'bio-drone': {
    id: 'bio-drone',
    stageId: 'fase1',
    name: 'Bio-Drone Autônomo de Restauração',
    category: 'Tecnologia',
    description: 'Veículo aéreo não tripulado equipado com sensores multiespectrais e compartimento de cápsulas de sementes nativas.',
    roleInSuccession: 'Intervenção tecnológica para acelerar a transição entre a Fase 1 (queimada) e as Fases 2 e 3 em terrenos íngremes.',
    ecologicalSignificance: 'Permite semear encostas perigosas ou isoladas onde o ser humano não consegue caminhar com segurança.'
  }
};

export const SUCCESSION_STAGES: Record<SuccessionalStageId, SuccessionalStage> = {
  fase1: {
    id: 'fase1',
    number: 1,
    title: 'Área Recentemente Queimada',
    subtitle: 'Fase Inicial Pós-Perturbação',
    characteristics: [
      'Solo desprovido de vegetação viva',
      'Troncos calcinados e restos de madeira carbonizada',
      'Camada de cinzas e serapilheira destruída',
      'Ausência temporária de fauna nativa'
    ],
    soilCondition: 'Solo compactado, hidrofóbico e suscetível à lixiviação por enxurradas.',
    vegetationCover: 'Cobertura vegetal quase nula (0 a 5%).',
    wildlifePresence: 'Ausência temporária de abrigo e alimento para a maioria dos vertebrados.',
    ecologicalProcess: 'Estágio pós-perturbação. O calor severo eliminou a maior parte da biomassa viva acima do solo.',
    icon: '🔥'
  },

  fase2: {
    id: 'fase2',
    number: 2,
    title: 'Início da Regeneração',
    subtitle: 'Estabelecimento de Herbáceas & Pioneiras Iniciais',
    characteristics: [
      'Rebrota de raízes profundas e tubérculos que resistiram ao calor',
      'Colonização rápida por gramíneas nativas e ervas anuais',
      'Aparecimento de briófitas (musgos) e fungos decompositores',
      'Início da recomposição de matéria orgânica no solo'
    ],
    soilCondition: 'O solo começa a receber raízes finas que ajudam a conter os primeiros sinais de erosão superficial.',
    vegetationCover: 'Cobertura baixa e rasteira, cobrindo gradualmente o solo exposto.',
    wildlifePresence: 'Retorno de pequenos insetos do solo, formigas e primeiros polinizadores atraídos pelas flores de ervas.',
    ecologicalProcess: 'Sucessão secundária inicial. Espécies de ciclo de vida curto com sementes leves dispersadas pelo vento começam a sombrear a terra.',
    icon: '🌱'
  },

  fase3: {
    id: 'fase3',
    number: 3,
    title: 'Floresta em Desenvolvimento',
    subtitle: 'Domínio de Arbustos & Árvores Pioneiras Lenhosas',
    characteristics: [
      'Crescimento rápido de árvores pioneiras heliófilas (ex: embaúbas e aroeiras)',
      'Sub-bosque denso de arbustos tolerantes a sol pleno',
      'Acúmulo progressivo de nova serapilheira e folhas caídas',
      'Multiplicação de micro-habitats'
    ],
    soilCondition: 'O solo torna-se mais úmido, fresco e aerado pela decomposição contínua de folhas e raízes.',
    vegetationCover: 'Dossel jovem fechando progressivamente entre 3 e 8 metros de altura.',
    wildlifePresence: 'Retorno de aves frugívoras, morcegos e pequenos mamíferos atraídos pelos frutos de pioneiras.',
    ecologicalProcess: 'As espécies pioneiras criam sombra e microclima ameno, condições indispensáveis para que as sementes de árvores clímax (como o jequitibá) possam germinar.',
    icon: '🌿'
  },

  fase4: {
    id: 'fase4',
    number: 4,
    title: 'Floresta Mais Madura',
    subtitle: 'Complexidade Estrutural & Retorno da Biodiversidade',
    characteristics: [
      'Substituição gradual das pioneiras por espécies secundárias tardias e clímax',
      'Estratificação vertical completa: dossel alto, sub-bosque e chão úmido',
      'Presença de epífitas como bromélias e orquídeas sobre os galhos',
      'Teias ecológicas repletas de predadores e dispersores de topo'
    ],
    soilCondition: 'Solo rico em matéria orgânica com horizonte escuro e micorrizas ativas.',
    vegetationCover: 'Dossel alto contínuo, reduzindo a incidência de vento e calor extremo no interior.',
    wildlifePresence: 'Presença estável de primatas, aves de rapina, grandes felinos e répteis.',
    ecologicalProcess: 'Estado de maturidade avançada. Embora leve décadas ou séculos, o bioma restabelece seus fluxos hidrológicos e genéticos.',
    icon: '🌳'
  }
};

export const LIMITING_FACTORS: LimitingFactor[] = [
  {
    id: 'queimadas-recorrentes',
    title: 'Queimadas Recorrentes',
    icon: '⚠️',
    mechanism: 'Incêndios frequentes impedem que os brotos e árvores jovens cheguem à fase reprodutiva, reiniciando o ciclo de degradação.',
    ecologicalConsequence: 'A área fica presa em um estágio permanente de pasto ou capoeira pobre, sem nunca recuperar o porte florestal.',
    mitigation: 'Criação de aceiros, brigadas comunitárias de incêndio e monitoramento por satélite em tempo real.'
  },
  {
    id: 'erosao-solo',
    title: 'Erosão e Perda de Nutrientes',
    icon: '⛰️',
    mechanism: 'Chuvas fortes em encostas sem raízes lavam o horizonte superficial fértil e abrem ravinas.',
    ecologicalConsequence: 'O subsolo pobre e pedregoso exposto dificulta a fixação de novas mudas nativas.',
    mitigation: 'Técnicas de bioengenharia como terraceamento, hidrossemeadura e contenção com biomantas vegetais.'
  },
  {
    id: 'perda-sementes',
    title: 'Perda do Banco de Sementes',
    icon: '🌾',
    mechanism: 'O calor penetra os primeiros centímetros do solo e incinera o banco de sementes dormentes nativas.',
    ecologicalConsequence: 'A regeneração natural espontânea se torna impossível sem a introdução de sementes externas.',
    mitigation: 'Plantio de enriquecimento e semeadura direta (muvuca de sementes nativas).'
  },
  {
    id: 'fragmentacao',
    title: 'Fragmentação Florestal',
    icon: '🧩',
    mechanism: 'A área degradada fica isolada a quilômetros de distância de fragmentos preservados.',
    ecologicalConsequence: 'Animais dispersores (como tucanos e antas) não conseguem cruzar pastagens abertas para trazer sementes.',
    mitigation: 'Criação de corredores ecológicos conectando os remanescentes de floresta.'
  },
  {
    id: 'especies-invasoras',
    title: 'Gramíneas Invasoras',
    icon: '🌾',
    mechanism: 'Capins africanos agressivos (ex: braquiária) crescem com rapidez e sufocam a luz solar das plântulas de árvores nativas.',
    ecologicalConsequence: 'Monocultura de pasto inflamável que aumenta o risco de novos incêndios no inverno.',
    mitigation: 'Controle mecânico prévio, consórcio com adubação verde e sombreamento rápido com mudas pioneiras.'
  },
  {
    id: 'mudancas-climaticas',
    title: 'Alterações no Regime de Chuvas',
    icon: '☀️',
    mechanism: 'Períodos de seca mais longos e temperaturas extremas causam estresse hídrico em mudas recém-plantadas.',
    ecologicalConsequence: 'Alta mortalidade de mudas nas primeiras semanas após o plantio.',
    mitigation: 'Uso de hidrogel retentor de umidade no momento do plantio e seleção de espécies nativas resilientes ao estresse hídrico.'
  }
];

export const RECOVERY_TECHNOLOGIES: RecoveryTechnology[] = [
  {
    id: 'satelites',
    name: 'Monitoramento Orbital por Satélite',
    icon: '🛰️',
    application: 'Imagens multiespectrais e índices de vegetação (NDVI) medem a densidade de biomassa e o estresse hídrico da copa.',
    benefit: 'Permite acompanhar a recuperação de centenas de hectares em escala regional sem custo de deslocamento constante.'
  },
  {
    id: 'drones',
    name: 'Bio-Drones & Dispersão Aérea',
    icon: '🚁',
    application: 'Drones programados por GPS lançam cápsulas nutritivas de sementes nativas em encostas íngremes e áreas inacessíveis.',
    benefit: 'Acelera a semeadura em relevos montanhosos da Serra do Mar e monitora o crescimento de dossel.'
  },
  {
    id: 'mapeamento-3d',
    name: 'Gêmeos Digitais & Mapeamento 3D',
    icon: '🗺️',
    application: 'Modelagem tridimensional de relevo e microbacias hidrográficas para simular o escoamento de água e definir corredores.',
    benefit: 'Garante que os recursos de restauração sejam aplicados nos pontos de maior impacto hidrológico e biológico.'
  },
  {
    id: 'plantio-inteligente',
    name: 'Plantio de Alta Precisão & Viveiros Bio-automatizados',
    icon: '🌱',
    application: 'Produção automatizada de mudas inoculadas com micorrizas nativas e acompanhamento por sensores de solo IoT.',
    benefit: 'Aumenta a taxa de sobrevivência das mudas jovens de árvores nativas no campo.'
  }
];
