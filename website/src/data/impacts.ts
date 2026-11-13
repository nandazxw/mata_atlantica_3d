/**
 * Base de Dados dos Impactos das Queimadas na Mata Atlântica
 * Conteúdo qualitativo baseado em ecologia florestal e restauração de biomas tropicais.
 */

export interface FireImpactData {
  id: string;
  title: string;
  subtitle: string;
  category: 'Vegetação' | 'Solo' | 'Fauna' | 'Clima e Água' | 'Regeneração';
  severity: 'Crítica' | 'Severa' | 'Prolongada';
  description: string;
  ecologicalConsequence: string;
  regenerationChallenge: string;
}

export const FIRE_IMPACTS: Record<string, FireImpactData> = {
  'arvore-carbonizada': {
    id: 'arvore-carbonizada',
    title: 'Árvore Centenária Carbonizada',
    subtitle: 'Colapso do dossel e morte do estrato arbóreo superior',
    category: 'Vegetação',
    severity: 'Crítica',
    description: 'Árvores de grande porte e casca sensível, como jequitibás e perobas, não possuem adaptação evolutiva ao fogo frequente. O calor intenso destrói o câmbio vascular, levando à morte vegetal.',
    ecologicalConsequence: 'A perda de uma única matriz centenária interrompe a produção de centenas de milhares de sementes, além de eliminar o habitat vertical para centenas de epífitas e aves de rapina.',
    regenerationChallenge: 'Árvores clímax de crescimento lento necessitam de muitas décadas ou séculos sob sombra e umidade para atingirem novamente portes monumentais.'
  },

  'solo-queimado': {
    id: 'solo-queimado',
    title: 'Solo Exposto e Serapilheira Destruída',
    subtitle: 'Perda da camada viva e esterilização de microrganismos',
    category: 'Solo',
    severity: 'Severa',
    description: 'A queima da camada superficial de folhas mortas (serapilheira) destrói fungos micorrízicos, bactérias fixadoras e a fauna do solo, tornando a terra dura, hidrofóbica e vulnerável.',
    ecologicalConsequence: 'Sem cobertura vegetal protetora, as chuvas tropicais lavam os nutrientes (lixiviação) e causam ravinas e erosões severas nas encostas.',
    regenerationChallenge: 'A reconstrução do horizonte orgânico do solo e de sua microbiota leva anos, retardando o estabelecimento natural de novas plântulas.'
  },

  'tronco-caido': {
    id: 'tronco-caido',
    title: 'Madeira Morta e Queda Estrutural',
    subtitle: 'Interrupção mecânica e alteração de microclima',
    category: 'Vegetação',
    severity: 'Severa',
    description: 'O fogo enfraquece a base dos troncos, provocando quedas contínuas nos meses subsequentes. A abertura abrupta de clareiras expõe o sub-bosque à radiação solar direta.',
    ecologicalConsequence: 'Espécies que demandam umidade e meia-sombra secam rapidamente, enquanto plantas invasoras pioneiras de ciclo curto dominam a área.',
    regenerationChallenge: 'A matéria lenhosa carbonizada no chão pode atuar como combustível em estiagens futuras se novas faíscas alcançarem a área.'
  },

  'rio-assoreado': {
    id: 'rio-assoreado',
    title: 'Leito Hídrico Assoreado e Turvo',
    subtitle: 'Perda da mata ciliar e desregulação do fluxo de água',
    category: 'Clima e Água',
    severity: 'Prolongada',
    description: 'Sem as raízes das árvores ciliares para reter os sedimentos da margem, enxurradas carregam cinzas e terra diretamente para o leito do riacho.',
    ecologicalConsequence: 'A turbidez da água impede a entrada de luz solar, sufoca leitos de desova aquática e reduz o oxigênio dissolvido, prejudicando peixes e anfíbios.',
    regenerationChallenge: 'A recuperação das nascentes e do fluxo hídrico depende da restauração prévia de toda a bacia hidrográfica ao redor.'
  },

  'fauna-ausente': {
    id: 'fauna-ausente',
    title: 'Deslocamento e Mortalidade da Fauna',
    subtitle: 'Fuga de dispersores e colapso das teias alimentares',
    category: 'Fauna',
    severity: 'Crítica',
    description: 'Animais de menor mobilidade sucumbem ao calor e à fumaça tóxica, enquanto animais ágeis (como tucanos, mamíferos e felinos) são forçados a fugir para fragmentos florestais vizinhos.',
    ecologicalConsequence: 'A perda de animais frugívoros impede a dispersão zoocórica de sementes nativas, quebrando o ciclo natural de renovação da floresta.',
    regenerationChallenge: 'A fauna só retorna permanentemente quando a vegetação voltar a fornecer abrigo térmico seguro, frutos e água limpa.'
  },

  'foco-cinzas': {
    id: 'foco-cinzas',
    title: 'Banco de Sementes Calcinado',
    subtitle: 'Destruição do potencial genético dormente',
    category: 'Regeneração',
    severity: 'Crítica',
    description: 'O calor extremo penetra os primeiros centímetros do solo, queimando sementes que aguardavam a estação chuvosa para germinar.',
    ecologicalConsequence: 'A floresta perde a sua capacidade de autocura imediata por regeneração seminal espontânea.',
    regenerationChallenge: 'Torna obrigatória a intervenção humana com plantio de mudas e dispersão tecnológica de sementes (semeadura aérea).'
  }
};
