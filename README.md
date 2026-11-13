# 🌿 MATA ATLÂNTICA 3D — Museu Científico Virtual

Uma experiência interativa, futurista e cientificamente fundamentada sobre a biodiversidade da Mata Atlântica, os impactos das queimadas antrópicas e os processos de restauração ecológica assistida por tecnologia.

---

## 🏛️ Seções do Museu Virtual

1. **Início (Floresta Preservada 3D):**
   - Experiência tridimensional imersiva com árvores de grande porte (*Jequitibá-Rosa*), palmeiras nativas (*Palmito-Juçara*), bromélias, samambaias e fauna representativa (*Tucano-de-Bico-Preto*, *Capivara*).
   - Elementos 100% clicáveis com inspeção botânica/zoológica detalhada.

2. **O Bioma (Biodiversidade & Taxonomia):**
   - Catálogo das espécies-chave da Mata Atlântica com filtros dinâmicos por categoria (Flora, Fauna, Recursos Hídricos).
   - Funções ecológicas, nomes científicos e status de conservação (ICMBio / Livro Vermelho).
   - Atalhos de navegação rápida para as experiências tridimensionais.

3. **Queimadas (Área Atingida & Comparação Antes/Depois):**
   - Modo de impacto severo com árvores centenárias calcinadas, solo exposto, névoa densa de fuligem e fuligem dispersa.
   - Botão interativo para alternar instantaneamente entre a **Floresta Preservada** e a **Área Devastada** a partir do mesmo ângulo de câmera.
   - HUD de métricas de impacto (perda de serapilheira, emissões de CO₂ e colapso de micro-habitats).

4. **Cadeia & Teia Alimentar 3D:**
   - Representação tridimensional holográfica de níveis tróficos: Produtores, Consumidores Primários, Secundários, Terciários e Decompositores.
   - Alternância entre visualização linear didática (**Cadeia Trófica**) e rede multidirecional complexa (**Teia Trófica**).
   - Simulador interativo do **Impacto das Queimadas**, demonstrando o efeito cascata da remoção de produtores e predadores no ecossistema.

5. **Sucessão Ecológica & Recuperação 3D:**
   - Linha do tempo interativa navegável em 4 fases da recuperação secundária:
     - *Fase 1:* Solo calcinado e matéria orgânica residual.
     - *Fase 2:* Surgimento de pioneiras rasteiras, gramíneas e decompositores.
     - *Fase 3:* Floresta jovem com arbustos e pioneiras de rápido crescimento (*Embaúba*).
     - *Fase 4:* Floresta madura estratificada com dossel fechado e retorno da fauna.
   - Bio-Drone de monitoramento ambiental ativo em voo autônomo sobre o relevo.
   - Todos os elementos 3D de todas as fases são clicáveis e possuem fichas científicas integradas.

6. **Ciclos Biogeoquímicos 3D:**
   - Visualização holográfica de alta performance para os ciclos da **Água**, do **Carbono** e do **Nitrogênio**.
   - Animação suave com fluxo luminoso de matéria e energia.
   - Simulação de impacto das queimadas em cada ciclo (redução da evapotranspiração, liberação massiva de carbono e volatilização do nitrogênio do solo).

7. **Tecnologia a Favor da Natureza:**
   - Painel de comando futurista com 5 módulos tridimensionais:
     - 🛰️ **Satélites Orbitais:** Feixe multiespectral varrendo a bacia com mapa de camadas ativáveis (NDVI, NBR de queimadas, hidrografia e corredores ecológicos).
     - 🚁 **Bio-Drones:** Semeadura direta de precisão em encostas acentuadas da Serra do Mar e inspeção de focos termais subterrâneos.
     - 🧠 **Inteligência Artificial:** Rede neural 3D demonstrando segmentação automática de clareiras e modelagem de conectividade de fragmentos.
     - 📊 **Sistemas de Alerta & Telemetria:** Sensores IoT no solo e monitoramento de estresse hídrico com dados pedagógicos claramente identificados.
     - 🌱 **Restauração Ecológica:** Viveiros inteligentes com bioengenharia e inoculação de fungos micorrízicos nativos.

---

## 💻 Otimização de Hardware (4 GB de RAM & GPU Integrada)

O projeto foi inteiramente desenhado e calibrado para rodar com fluidez em configurações modestas (ex: processador **Intel Core i3-N305, 4 GB de memória RAM e gráficos integrados Intel UHD**):

- **Geometrias Procedurais Leves:** Zero arquivos pesados `.gltf`/`.glb` ou texturas de alta resolução. Todos os modelos utilizam primitivas matemáticas Three.js (`BufferGeometry`).
- **Gerenciamento Estrito de Memória:** Ao trocar de aba no museu, o componente desmontado executa a rotina `destroy()`, liberando geometrias, materiais e listeners da GPU e do navegador via `dispose()`.
- **Pixel Ratio Limitado:** `Math.min(window.devicePixelRatio, 1.25)` em todos os renderizadores para evitar gargalos na taxa de quadros da GPU integrada.
- **Isolamento de Cenas:** Apenas uma cena 3D é renderizada por vez, impedindo picos de consumo de memória RAM.

---

## 🔬 Referências Científicas & Fontes Confiáveis

- **INPE (Instituto Nacional de Pesquisas Espaciais):** Programa Queimadas e sistemas PRODES/DETER para sensoriamento remoto de cobertura vegetal e detecção de anomalias térmicas.
- **MapBiomas:** Mapeamento histórico e anual do uso da terra e cicatrizes de fogo no Brasil.
- **Embrapa (Empresa Brasileira de Pesquisa Agropecuária):** Práticas de bioengenharia de solos, recuperação de áreas degradadas (RAD) e dinâmica de nutrientes (Ciclos do Carbono e Nitrogênio).
- **Fundação SOS Mata Atlântica & Pacto pela Restauração:** Metas de restauração ecológica, diretrizes de corredores de biodiversidade e inventários de conservação do bioma.
- **ICMBio / Jardim Botânico do Rio de Janeiro:** Livro Vermelho da Fauna e Flora e Funga do Brasil para classificação taxonômica e status de conservação.

> ⚠️ **Nota Pedagógica:** As métricas exibidas nos painéis de telemetria e nos simuladores interativos são modelos matemáticos didáticos para fins de conscientização ambiental e demonstração de conceitos ecológicos.

---

## 🎨 Identidade Visual Futurista

- **Fundo Espacial/Laboratório:** `#071A14` / `#050E09`
- **Verde Primário Florestal:** `#1F704B`
- **Verde Luminoso (Glow):** `#65E6A5`
- **Azul Tecnológico (Ciano):** `#42BFE8`
- **Branco Puro/Gelo:** `#F1F5F2`
- **Laranja de Alerta Térmico:** `#FF713D`

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Navegador moderno (Google Chrome, Edge, Firefox ou Safari)

### Passo a Passo

1. **Acessar a pasta da aplicação web:**
   ```bash
   cd website
   ```

2. **Instalar as dependências (caso seja a primeira execução):**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O terminal exibirá a URL local: `http://localhost:5173/`.

4. **Gerar a compilação de produção e checagem de tipos (opcional):**
   ```bash
   npm run build
   ```

---

## 🧪 Roteiro de Testes Recomendado

1. Abra `http://localhost:5173/` no seu navegador.
2. Navegue sequencialmente pelas abas do topo:
   - **Início:** Clique no Jequitibá, na Capivara, no Tucano e no Rio. Arraste com o botão esquerdo para orbitar a câmera e use a roda do mouse para dar zoom.
   - **O Bioma:** Use os filtros de categoria e clique nos atalhos para pular direto para as cenas tridimensionais.
   - **Queimadas:** Use o botão *"Comparar Floresta Preservada / Área Devastada"* para observar o efeito do fogo a partir do mesmo ângulo de visão.
   - **Cadeia Alimentar:** Alterne entre *"Cadeia Alimentar"* e *"Teia Trófica"*. Ative o botão *"Simular Queimadas"* e veja as quebras nas conexões de energia.
   - **Recuperação:** Selecione as fases 1, 2, 3 e 4 na linha do tempo. Clique em troncos queimados, ervas pioneiras, árvores jovens e no bio-drone.
   - **Ciclos Naturais:** Explore os botões de navegação para alternar entre os ciclos da Água, Carbono e Nitrogênio, ativando a simulação de queimadas.
   - **Tecnologia:** Teste os 5 módulos orbitais e acione/desative as camadas do mapa orbital à direita.
   - Clique no logotipo do museu no canto superior esquerdo a qualquer momento para retornar à tela inicial.
