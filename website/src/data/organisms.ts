/**
 * Base de Dados Científicos da Mata Atlântica
 * Informações catalogadas com base em literatura botânica e zoológica brasileira.
 */

export interface SpeciesData {
  id: string;
  popularName: string;
  scientificName?: string;
  kingdom: 'Plantae' | 'Animalia' | 'Fungi' | 'Geológico/Hídrico';
  category: 'Árvore de Grande Porte' | 'Palmeira' | 'Epífita' | 'Pteridófita' | 'Mamífero' | 'Ave' | 'Recurso Natural';
  characteristics: string;
  ecologicalImportance: string;
  curiosities: string;
  conservationStatus?: 'Criticamente em Perigo (CR)' | 'Em Perigo (EN)' | 'Vulnerável (VU)' | 'Quase Ameaçada (NT)' | 'Pouco Preocupante (LC)';
}

export const SPECIES_DATA: Record<string, SpeciesData> = {
  'jequitiba-rosa': {
    id: 'jequitiba-rosa',
    popularName: 'Jequitibá-rosa',
    scientificName: 'Cariniana legalis',
    kingdom: 'Plantae',
    category: 'Árvore de Grande Porte',
    conservationStatus: 'Vulnerável (VU)',
    characteristics: 'Considerada uma das maiores e mais longevas árvores da Mata Atlântica, podendo atingir até 50 metros de altura e troncos de mais de 3 metros de diâmetro.',
    ecologicalImportance: 'Árvore emergente que domina o dossel florestal, serve de abrigo para aves de rapina, epífitas e produz frutos piridiais que alimentam roedores e dispersores.',
    curiosities: 'Existem espécimes conhecidos com idade estimada em mais de 1.000 anos, verdadeiros monumentos vivos que antecedem o descobrimento do Brasil.'
  },

  'palmeira-jucara': {
    id: 'palmeira-jucara',
    popularName: 'Palmeira-juçara',
    scientificName: 'Euterpe edulis',
    kingdom: 'Plantae',
    category: 'Palmeira',
    conservationStatus: 'Vulnerável (VU)',
    characteristics: 'Palmeira de tronco delgado e elegante, que alcança de 10 a 20 metros. Possui estipe solitário com uma copa densa de folhas pinadas.',
    ecologicalImportance: 'Espécie-chave (keystone species): seus pequenos frutos arroxeados alimentam mais de 70 espécies de aves e mamíferos durante os meses de inverno.',
    curiosities: 'Diferente de outras palmeiras que rebrotam, a extração tradicional do palmito juçara mata a árvore inteira. Hoje promove-se o consumo sustentável de sua polpa (semelhante ao açaí), preservando a palmeira em pé.'
  },

  'samambaia': {
    id: 'samambaia',
    popularName: 'Samambaiaçu / Samambaia-arborescente',
    scientificName: 'Cyathea delgadii',
    kingdom: 'Plantae',
    category: 'Pteridófita',
    conservationStatus: 'Quase Ameaçada (NT)',
    characteristics: 'Planta vascular sem sementes, com tronco fibroso formado por raízes adventícias (conhecido antigamente como xaxim) e grandes frondes verdes.',
    ecologicalImportance: 'Comum em sub-bosques úmidos e margens de riachos. Seu caule serve de substrato para dezenas de orquídeas, bromélias e musgos.',
    curiosities: 'Pertence a uma das linhagens de plantas mais antigas da Terra, tendo surgido centenas de milhões de anos antes do aparecimento das flores e das árvores com frutos.'
  },

  'bromelia': {
    id: 'bromelia',
    popularName: 'Bromélia',
    scientificName: 'Aechmea fasciata',
    kingdom: 'Plantae',
    category: 'Epífita',
    conservationStatus: 'Pouco Preocupante (LC)',
    characteristics: 'Planta com folhas dispostas em roseta que formam um reservatório central (tanque) capaz de reter água da chuva e matéria orgânica.',
    ecologicalImportance: 'O tanque da bromélia constitui um microecossistema aquático vital no dossel, sustentando girinos de anfíbios, larvas de insetos e servindo de bebedouro para aves.',
    curiosities: 'Muitas espécies de pererecas passam toda a sua vida dependendo exclusivamente das bromélias, reproduzindo-se apenas dentro desses reservatórios suspensos.'
  },

  'capivara': {
    id: 'capivara',
    popularName: 'Capivara',
    scientificName: 'Hydrochoerus hydrochaeris',
    kingdom: 'Animalia',
    category: 'Mamífero',
    conservationStatus: 'Pouco Preocupante (LC)',
    characteristics: 'Maior roedor vivo do mundo, com peso variando de 35 a 65 kg. Possui patas com pequenas membranas interdigitais adaptadas à natação.',
    ecologicalImportance: 'Herbívoro de grande porte associado a margens de rios e várzeas. Modela a vegetação ripária e atua como presa essencial para grandes carnívoros como a onça-pintada.',
    curiosities: 'Pode permanecer submersa na água por até 5 minutos para se esconder de predadores ou se refrescar durante as horas mais quentes do dia.'
  },

  'tucano-de-bico-verde': {
    id: 'tucano-de-bico-verde',
    popularName: 'Tucano-de-bico-verde',
    scientificName: 'Ramphastos dicolorus',
    kingdom: 'Animalia',
    category: 'Ave',
    conservationStatus: 'Pouco Preocupante (LC)',
    characteristics: 'Ave de 40 a 48 cm, com plumagem predominantemente preta, papo amarelo-alaranjado, ventre vermelho e bico serrilhado de tom esverdeado.',
    ecologicalImportance: 'Excelente dispersor de sementes grandes de árvores nativas como juçaras e canelas, garantindo a regeneração contínua da floresta.',
    curiosities: 'Apesar de parecer pesado, seu enorme bico é oco e composto por uma estrutura interna trabecular semelhante a uma esponja de queratina, o que o torna incrivelmente leve e eficiente para regulação térmica.'
  },

  'rio-fluvial': {
    id: 'rio-fluvial',
    popularName: 'Rio de Floresta Ombrófila',
    kingdom: 'Geológico/Hídrico',
    category: 'Recurso Natural',
    characteristics: 'Corpo hídrico de águas límpidas e pedregosas, alimentado pela constante umidade trazida pelas massas de ar do oceano Atlântico.',
    ecologicalImportance: 'As matas ciliares ao redor do rio previnem o assoreamento, mantêm a temperatura amena da água e servem como corredores ecológicos fundamentais para a fauna.',
    curiosities: 'A Mata Atlântica abriga bacias hidrográficas que abastecem de água potável e energia elétrica mais de 100 milhões de habitantes no Brasil.'
  },

  'rocha-musgosa': {
    id: 'rocha-musgosa',
    popularName: 'Afloramento Rochoso com Briófitas',
    kingdom: 'Geológico/Hídrico',
    category: 'Recurso Natural',
    characteristics: 'Rochas de gnaisse e granito típicas da Serra do Mar e relevos da Mata Atlântica, cobertas por uma fina camada de musgos e liquens.',
    ecologicalImportance: 'As briófitas (musgos) retêm a umidade ambiental como esponjas e auxiliam na decomposição lenta da rocha, iniciando a formação de solo fértil.',
    curiosities: 'Em períodos úmidos, o tapete de musgos pode absorver até 20 vezes o seu próprio peso seco em água.'
  }
};
