/* ============================================================
   Entende Lei — Mock de dados (MVP)
   Três cenários no schema JSON de referência do produto.
   No produto real, estes objetos viriam da API de IA.
   ============================================================ */

/* Texto de exemplo: contém "petição" e "revelia" → roteia para o Cenário 1 */
window.LEXNOW_SAMPLE_INPUT =
  "Recebo a petição inicial e defiro parcialmente os pedidos liminares. " +
  "Cite-se a parte ré para, querendo, apresentar contestação no prazo legal " +
  "de 15 (quinze) dias úteis, sob pena de revelia e confissão quanto à " +
  "matéria fática. Intime-se. Publique-se. Registre-se.";

window.LEXNOW_PROCESSING_STEPS = [
  { label: "Lendo o documento e detectando a estrutura...", icon: "file-text", ms: 1500 },
  { label: "Parseando termos em latim e juridiquês...", icon: "scroll", ms: 1900 },
  { label: "Identificando seus direitos e deveres...", icon: "scale", ms: 1700 },
  { label: "Gerando infográficos e âncoras visuais...", icon: "sparkles", ms: 1600 },
  { label: "Construindo a linha do tempo do processo...", icon: "list-checks", ms: 1500 },
  { label: "Validando a tradução com documentos oficiais...", icon: "shield-check", ms: 1400 },
];

window.LEXNOW_SCENARIOS = {

  /* ---------- Cenário 1: Início de Processo ----------
     Trigger: texto contém "petição" ou "revelia" (também é o default) */
  cenario1: {
    id_processo: "2026-SNTC-001",
    confianca_ia: 0.96,
    texto_original:
      "Recebo a petição inicial e defiro parcialmente os pedidos liminares. " +
      "Cite-se a parte ré para, querendo, apresentar contestação no prazo legal " +
      "de 15 (quinze) dias úteis...",
    texto_simplificado:
      "O juiz aceitou seu processo. A outra parte será notificada e tem 15 dias " +
      "para se defender. Se não responder, o juiz considerará que você tem razão.",
    status_timeline: [
      { etapa: "Abertura", concluida: true, descricao: "Processo iniciado", is_critica: false },
      { etapa: "Defesa", concluida: false, descricao: "Aguardando resposta em 15 dias", is_critica: true },
    ],
    direitos_deveres: [
      { tipo: "dever", descricao: "Aguardar o prazo de 15 dias", icone_id: "clock" },
    ],
    termos_chave: [
      {
        termo: "Revelia",
        tipo: "Processual",
        explicacao: "Quando a outra pessoa ignora o processo e não se defende.",
        ancora_visual: "user-x",
      },
    ],
  },

  /* ---------- Cenário 2: Imissão na posse com multa diária ----------
     Trigger: texto contém "imissão" ou "astreinte" */
  cenario2: {
    id_processo: "2026-SNTC-002",
    confianca_ia: 0.94,
    texto_original:
      "Vistos. Defiro o pedido de imissão na posse do imóvel objeto dos autos, " +
      "determinando-se a intimação dos ocupantes para desocupação voluntária no " +
      "prazo de 30 (trinta) dias, sob pena de multa diária (astreintes) de " +
      "R$ 500,00 (quinhentos reais) e, persistindo o descumprimento, de " +
      "desocupação forçada com auxílio de oficial de justiça. Intimem-se. Ex nunc.",
    texto_simplificado:
      "O juiz decidiu que o imóvel é seu. Os ocupantes foram avisados " +
      "oficialmente e têm 30 dias para sair por conta própria. Se não saírem, " +
      "pagam multa de R$ 500 por dia — e, no limite, um oficial de justiça " +
      "faz a desocupação.",
    status_timeline: [
      { etapa: "Imissão deferida", concluida: true, descricao: "O juiz reconheceu seu direito sobre o imóvel.", is_critica: false },
      { etapa: "Ocupantes intimados", concluida: true, descricao: "Os ocupantes foram avisados oficialmente da decisão.", is_critica: false },
      { etapa: "Prazo de 30 dias", concluida: false, descricao: "Período para saída voluntária. Multa de R$ 500/dia já está prevista.", is_critica: true },
      { etapa: "Desocupação ou execução", concluida: false, descricao: "Se não saírem, a multa corre e um oficial de justiça pode agir.", is_critica: true },
    ],
    direitos_deveres: [
      { tipo: "direito", descricao: "Receber a multa diária em caso de atraso na saída", icone_id: "coins" },
      { tipo: "direito", descricao: "Pedir oficial de justiça para concluir a desocupação", icone_id: "key-round" },
      { tipo: "dever", descricao: "Aguardar o prazo de 30 dias antes de qualquer medida", icone_id: "clock" },
      { tipo: "dever", descricao: "Não tentar retirar os ocupantes por conta própria", icone_id: "ban" },
    ],
    termos_chave: [
      {
        termo: "Imissão na posse",
        tipo: "Processual",
        explicacao: "Quando o juiz autoriza você a tomar posse oficial de um bem, como um imóvel.",
        ancora_visual: "icon:key-round",
      },
      {
        termo: "Astreintes",
        tipo: "Processual",
        explicacao: "Multa por dia de atraso, criada para forçar a outra parte a cumprir a decisão.",
        ancora_visual: "icon:hourglass",
      },
      {
        termo: "Ex nunc",
        tipo: "Latinismo",
        explicacao: "Em latim, 'a partir de agora': os efeitos valem daqui para frente.",
        ancora_visual: "icon:fast-forward",
      },
    ],
  },

  /* ---------- Cenário 3: Processo encerrado (upload de arquivo) ----------
     Trigger: qualquer arquivo enviado pelo upload */
  cenario3: {
    id_processo: "2026-SNTC-003",
    confianca_ia: 0.91,
    texto_original:
      "Certifico que, decorrido o prazo recursal sem interposição de recurso " +
      "pelas partes, operou-se o trânsito em julgado da sentença de procedência. " +
      "Extingo o processo com resolução de mérito, nos termos do art. 487, I, " +
      "do CPC. Custas pela parte vencida. Nada mais sendo requerido, arquivem-se " +
      "os autos com baixa na distribuição.",
    texto_simplificado:
      "O processo acabou e você venceu. O prazo para a outra parte recorrer " +
      "terminou sem recurso — então a decisão virou definitiva e não pode mais " +
      "mudar. O processo será arquivado.",
    status_timeline: [
      { etapa: "Sentença favorável", concluida: true, descricao: "O juiz decidiu a seu favor.", is_critica: false },
      { etapa: "Prazo para recurso", concluida: true, descricao: "A outra parte poderia recorrer, mas o prazo terminou.", is_critica: false },
      { etapa: "Decisão definitiva", concluida: true, descricao: "A vitória virou definitiva (trânsito em julgado).", is_critica: false },
      { etapa: "Arquivamento", concluida: false, descricao: "O processo será arquivado. Nenhuma ação sua é necessária.", is_critica: false },
    ],
    direitos_deveres: [
      { tipo: "direito", descricao: "Cobrar o que a decisão garantiu a você", icone_id: "hand-coins" },
      { tipo: "direito", descricao: "Pegar uma cópia da decisão definitiva", icone_id: "file-check" },
      { tipo: "dever", descricao: "Guardar o comprovante da decisão para o futuro", icone_id: "archive" },
    ],
    termos_chave: [
      {
        termo: "Trânsito em julgado",
        tipo: "Processual",
        explicacao: "Quando a decisão vira definitiva e ninguém mais pode recorrer.",
        ancora_visual: "icon:lock",
      },
      {
        termo: "Custas",
        tipo: "Substantivo",
        explicacao: "As taxas do processo. Quem perdeu é quem paga.",
        ancora_visual: "icon:receipt",
      },
      {
        termo: "Autos",
        tipo: "Substantivo",
        explicacao: "O nome do conjunto de todos os documentos do processo.",
        ancora_visual: "icon:folder",
      },
    ],
  },
};

/* Mapeamento tipo → ícone/âncora semântica (MVP sem imagens customizadas) */
window.LEXNOW_TIPO_STYLE = {
  Latinismo: { icon: "scroll", label: "Termo em latim" },
  Processual: { icon: "gavel", label: "Regra do processo" },
  Substantivo: { icon: "book-open", label: "Conceito jurídico" },
};
