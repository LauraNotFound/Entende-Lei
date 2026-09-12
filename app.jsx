/* ============================================================
   Entende Lei — MVP interativo (SPA em 3 etapas)
   React 18 (UMD) + Lucide UMD. Sem build step.
   ============================================================ */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const SCENARIOS = window.LEXNOW_SCENARIOS;
const PROCESSING_STEPS = window.LEXNOW_PROCESSING_STEPS;
const SAMPLE_INPUT = window.LEXNOW_SAMPLE_INPUT;
const TIPO_STYLE = window.LEXNOW_TIPO_STYLE;
const PROCESSOS = window.LEXNOW_PROCESSOS;

const MIN_CHARS = 50;

/* Detecta o tipo de identificador digitado na consulta pública */
function detectDocType(q) {
  const digits = q.replace(/\D/g, "");
  if (digits.length === 11) return "CPF";
  if (digits.length === 14) return "CNPJ";
  if (digits.length === 20 || /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/.test(q.trim())) return "Nº CNJ";
  return null;
}

/* Roteamento por palavra-chave: decide qual cenário mockado renderizar.
   "imissão"/"astreinte" → cenario2 | "petição"/"revelia" → cenario1 | default → cenario1 */
const normalize = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function detectScenario(text) {
  const t = normalize(text);
  if (t.includes("imissao") || t.includes("astreinte")) return "cenario2";
  if (t.includes("peticao") || t.includes("revelia")) return "cenario1";
  return "cenario1";
}

/* ---------- Icon: renderiza SVGs do Lucide dinamicamente ---------- */

const toPascal = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");

function Icon({ name, size = 20, strokeWidth = 2, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    try {
      const node = lucide.icons[toPascal(name)];
      if (!node) return;
      const svg = lucide.createElement(node);
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("stroke-width", strokeWidth);
      el.innerHTML = "";
      el.appendChild(svg);
    } catch (e) { /* ícone indisponível: renderiza vazio */ }
  }, [name, size, strokeWidth]);
  return <span ref={ref} className={"icon " + className} aria-hidden="true" />;
}

/* ---------- Header + Stepper ---------- */

const STEPS_LABELS = ["Seu documento", "IA trabalhando", "Resultado"];

function Header({ step }) {
  return (
    <React.Fragment>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand-mark"><Icon name="scale" size={24} /></div>
          <div>
            <div className="brand-name">Entende<span className="now"> Lei</span></div>
            <div className="brand-tagline">Justiça em linguagem simples, sem juridiquês</div>
          </div>
        </div>
      </header>
      <div className="stepper-wrap">
        <nav className="stepper" aria-label="Progresso">
          {STEPS_LABELS.map((label, i) => {
            const n = i + 1;
            const state = n < step ? "done" : n === step ? "active" : "";
            return (
              <React.Fragment key={label}>
                {i > 0 && <div className={"stepper-line" + (n <= step ? " done" : "")} />}
                <div className={"stepper-item " + state} aria-current={n === step ? "step" : undefined}>
                  <span className="stepper-dot">
                    {n < step ? <Icon name="check" size={15} strokeWidth={3} /> : n}
                  </span>
                  <span className="stepper-label">{label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </React.Fragment>
  );
}

/* ---------- Modal: Consulta pública por CPF/CNPJ/Nº CNJ ---------- */

function ConsultaModal({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const docType = useMemo(() => detectDocType(query), [query]);
  const canSearch = query.trim().length >= 3 && !loading;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const search = () => {
    if (!canSearch) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => { setResults(PROCESSOS); setLoading(false); }, 900);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal consulta-modal" role="dialog" aria-modal="true" aria-label="Consultar processos" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar consulta"><Icon name="x" size={17} /></button>
        <div className="modal-anchor" style={{ background: "var(--blue-100)", color: "var(--blue-700)" }}>
          <Icon name="file-search" size={30} />
        </div>
        <span className="modal-tipo" style={{ background: "var(--blue-100)", color: "var(--blue-700)" }}>Consulta pública</span>
        <h3>Buscar seus processos</h3>
        <p>Informe seu CPF, CNPJ ou o número do processo no formato CNJ.</p>

        <div className="consulta-field">
          <input
            className="consulta-input"
            placeholder="Ex.: 123.456.789-00 ou 5001234-56.2026.8.26.0100"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            aria-label="CPF, CNPJ ou número do processo"
            autoFocus
          />
          {docType && <span className="doc-type">{docType}</span>}
        </div>

        <button className="btn btn-primary consulta-btn" onClick={search} disabled={!canSearch}>
          {loading ? <span className="mini-spinner" /> : <Icon name="search" size={17} />}
          {loading ? "Consultando tribunais..." : "Buscar processos"}
        </button>

        {results && (
          <div className="consulta-results">
            <p className="consulta-count">
              <strong>{results.length}</strong> processos encontrados para <strong>{query}</strong>
            </p>
            <ul className="proc-results">
              {results.map((p) => (
                <li key={p.numero_cnj} className="proc-result">
                  <div className="proc-result-info">
                    <span className="proc-num">{p.numero_cnj}</span>
                    <span className="proc-titulo">{p.titulo}</span>
                    <span className="proc-trib"><Icon name="landmark" size={12} /> {p.tribunal}</span>
                  </div>
                  <div className="proc-result-side">
                    <span className={"proc-sit " + (p.situacao === "Encerrado" ? "closed" : "open")}>{p.situacao}</span>
                    <button className="btn btn-soft btn-sm" onClick={() => onSelect(p)}>
                      Interpretar <Icon name="arrow-right" size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Tela 1: Input Multimodal ---------- */

function InputScreen({ text, setText, onSubmit, onUpload, onSelectProcess }) {
  const len = text.trim().length;
  const valid = len >= MIN_CHARS;
  const words = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showConsulta, setShowConsulta] = useState(false);

  const pickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) onUpload(f);
    e.target.value = "";
  };

  const onZoneDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) onUpload(f);
  };

  const onCardDrop = (e) => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      e.preventDefault();
      onUpload(f);
    }
  };
  const onCardDragOver = (e) => {
    if (e.dataTransfer.types && e.dataTransfer.types.includes("Files")) e.preventDefault();
  };

  return (
    <section className="screen" aria-labelledby="t1">
      <h1 className="screen-title" id="t1">Cole a decisão judicial que você não entendeu</h1>
      <p className="screen-sub">
        O Entende Lei traduz o juridiquês para português claro e mostra visualmente
        onde o seu processo está — sem estresse, sem termos difíceis.
      </p>

      <div className="input-grid">
        <div className="card" onDragOver={onCardDragOver} onDrop={onCardDrop}>
          <h2 className="card-title"><Icon name="file-text" />Texto do documento</h2>
          <p className="card-desc">Copie o texto da decisão, intimação ou sentença e cole abaixo.</p>

          <textarea
            className={"textarea" + (valid ? " valid" : "")}
            placeholder="Ex.: “Vistos. Trata-se de pedido de tutela de urgência…”"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Texto do documento judicial"
            aria-describedby="input-feedback"
            autoFocus
          />

          <div className={"input-feedback" + (valid ? " ok" : "")} id="input-feedback" role="status" aria-live="polite">
            {valid ? (
              <React.Fragment>
                <Icon name="check-circle-2" size={17} />
                Documento válido — {len.toLocaleString("pt-BR")} caracteres, {words.toLocaleString("pt-BR")} palavras. Pronto para simplificar.
              </React.Fragment>
            ) : len > 0 ? (
              <React.Fragment>
                <Icon name="info" size={17} />
                Continue escrevendo — mínimo de {MIN_CHARS} caracteres ({len}/{MIN_CHARS}).
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Icon name="info" size={17} />
                Cole pelo menos {MIN_CHARS} caracteres para começar.
              </React.Fragment>
            )}
          </div>

          <div className="input-actions">
            <button className="btn btn-primary" onClick={onSubmit} disabled={!valid}>
              <Icon name="sparkles" size={18} />
              Simplificar Agora
            </button>
            <button className="btn btn-soft" onClick={() => setText(SAMPLE_INPUT)}>
              <Icon name="file-check" size={17} />
              Usar texto de exemplo
            </button>
          </div>

          <button className="consulta-link" onClick={() => setShowConsulta(true)}>
            <Icon name="search" size={16} />
            Já tem processo? Consulte por CPF, CNPJ ou Nº CNJ
          </button>
        </div>

        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.odt,.rtf"
            style={{ display: "none" }}
            onChange={pickFile}
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="alt-methods" role="group" aria-label="Outras formas de envio">
            <button
              type="button"
              className={"alt-method enabled" + (dragOver ? " dragover" : "")}
              onClick={() => fileRef.current && fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onZoneDrop}
            >
              <Icon name="file-up" size={26} />
              <span>
                <span className="alt-method-title">Enviar PDF ou DOC</span>
                <span className="alt-method-sub">Clique ou arraste o arquivo aqui</span>
              </span>
            </button>
            <span data-tip="Em breve: fale ou ouça a decisão">
              <button className="alt-method" disabled aria-disabled="true">
                <span className="soon-tag">Em breve</span>
                <Icon name="mic" size={26} />
                <span>
                  <span className="alt-method-title">Entrada por voz</span>
                  <span className="alt-method-sub">Dite o texto ou peça para ouvir</span>
                </span>
              </button>
            </span>
          </div>

          <div className="side-note">
            <Icon name="brain" size={18} />
            <span>
              <strong>Neurodesign:</strong> o Entende Lei usa a Taxonomia de Neuroaprendizagem Ânima
              para reduzir a ansiedade processual e fixar o que importa — texto + visual.
            </span>
          </div>
        </div>
      </div>

      {showConsulta && (
        <ConsultaModal
          onClose={() => setShowConsulta(false)}
          onSelect={onSelectProcess}
        />
      )}
    </section>
  );
}

/* ---------- Tela 2: Processamento (Labor Perception Bias) ---------- */

function ProcessingScreen({ onDone, subject }) {
  const [current, setCurrent] = useState(0);
  const total = PROCESSING_STEPS.length;

  useEffect(() => {
    if (current >= total) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrent((c) => c + 1), PROCESSING_STEPS[current].ms);
    return () => clearTimeout(t);
  }, [current, total, onDone]);

  const progress = Math.min(100, Math.round((current / total) * 100));

  return (
    <section className="screen" aria-labelledby="t2" aria-busy="true">
      <div className="card processing-card">
        <div className="processing-orb"><Icon name="brain" size={38} /></div>
        <h1 className="screen-title" id="t2" style={{ fontSize: "1.35rem" }}>
          Traduzindo o juridiquês para você
        </h1>
        <p className="screen-sub" style={{ margin: "0 auto", maxWidth: 440, textAlign: "center" }}>
          {subject ? (
            <React.Fragment>Analisando <strong>“{subject}”</strong> — acompanhe cada etapa em tempo real.</React.Fragment>
          ) : (
            "Nossa IA trabalha em etapas transparentes. Você acompanha tudo em tempo real."
          )}
        </p>

        <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" aria-label="Progresso da análise">
          <div className="progress-fill" style={{ width: progress + "%" }} />
        </div>
        <div className="progress-label">
          <span>Etapa {Math.min(current + 1, total)} de {total}</span>
          <span>{progress}%</span>
        </div>

        <ul className="proc-steps">
          {PROCESSING_STEPS.map((s, i) => {
            const state = i < current ? "done" : i === current ? "running" : "pending";
            return (
              <li key={s.label} className={"proc-step " + state}>
                <span className="step-state">
                  {state === "done" ? <Icon name="check-circle-2" size={19} /> :
                   state === "running" ? <span className="mini-spinner" /> :
                   <Icon name="circle" size={19} />}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                  <Icon name={s.icon} size={16} />
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="proc-note">
          <Icon name="shield-check" size={15} />
          Seus dados não saem do dispositivo nesta demonstração.
        </div>
      </div>
    </section>
  );
}

/* ---------- Tela 3: Dashboard ---------- */

function ConfidenceRing({ value }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 120);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="ring" role="img" aria-label={`Confiança da IA: ${Math.round(value * 100)}%`}>
      <svg width="74" height="74" viewBox="0 0 74 74">
        <circle className="ring-track" cx="37" cy="37" r={r} fill="none" strokeWidth="8" />
        <circle className="ring-fill" cx="37" cy="37" r={r} fill="none" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - shown)} />
      </svg>
      <div className="ring-val">{Math.round(value * 100)}<small>%</small></div>
    </div>
  );
}

function Timeline({ items }) {
  const firstPending = items.findIndex((s) => !s.concluida);
  const [selected, setSelected] = useState(firstPending);

  return (
    <div className="card">
      <h2 className="card-title"><Icon name="list-checks" />Linha do tempo do processo</h2>
      <p className="card-desc">Onde seu caso está e quais são os próximos passos obrigatórios. Toque em uma etapa para detalhes.</p>

      <div className="timeline">
        {items.map((s, i) => {
          const state = s.concluida ? "done" : i === firstPending ? "current" : "pending";
          return (
            <button
              key={s.etapa}
              className={"tl-step " + state + (selected === i ? " selected" : "")}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              <span className="tl-node">
                {s.concluida ? <Icon name="check" size={18} strokeWidth={3} /> : i + 1}
              </span>
              <span className="tl-name">{s.etapa}</span>
              <span className="tl-flags">
                {i === firstPending && <span className="tl-flag now">Etapa atual</span>}
                {s.is_critica && !s.concluida && (
                  <span className="tl-flag critical"><Icon name="alert-triangle" size={11} />Prazo</span>
                )}
                {s.concluida && <span className="tl-flag done">Concluída</span>}
              </span>
            </button>
          );
        })}
      </div>

      {selected != null && items[selected] && (
        <div className="tl-detail" role="status">
          <Icon name={items[selected].concluida ? "check-circle-2" : items[selected].is_critica ? "alert-triangle" : "info"} size={20} />
          <div>
            <strong>{items[selected].etapa}{items[selected].is_critica ? " — etapa crítica" : ""}</strong>
            <p>{items[selected].descricao}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function RightsDuties({ items }) {
  const rights = items.filter((i) => i.tipo === "direito");
  const duties = items.filter((i) => i.tipo === "dever");
  const Col = ({ title, icon, list, cls }) => (
    <div className={"rd-col " + cls}>
      <div className="rd-head"><Icon name={icon} size={17} />{title} · {list.length}</div>
      <ul className="rd-list">
        {list.map((it) => (
          <li key={it.descricao} className="rd-item">
            <span className="rd-icon"><Icon name={it.icone_id} size={17} /></span>
            <span>{it.descricao}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="card">
      <h2 className="card-title"><Icon name="scale" />Seus direitos e deveres</h2>
      <p className="card-desc">Verde = o que a lei garante a você. Âmbar = o que o processo espera de você.</p>
      <div className="rd-grid">
        <Col title="Seus direitos" icon="shield-check" list={rights} cls="rights" />
        <Col title="Seus deveres" icon="clipboard-check" list={duties} cls="duties" />
      </div>
    </div>
  );
}

function TermModal({ term, onClose }) {
  const style = TIPO_STYLE[term.tipo] || TIPO_STYLE.Substantivo;
  const anchorIcon = (term.ancora_visual || "").replace("icon:", "") || style.icon;
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className={"modal tipo-" + term.tipo} role="dialog" aria-modal="true" aria-label={"Explicação do termo " + term.termo} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar explicação"><Icon name="x" size={17} /></button>
        <div className="modal-anchor"><Icon name={anchorIcon} size={30} /></div>
        <span className="modal-tipo">{term.tipo} · {style.label}</span>
        <h3>{term.termo}</h3>
        <p>{term.explicacao}</p>
        <div className="modal-anchor-note">
          <Icon name={style.icon} size={18} />
          <span>
            <em>Âncora visual</em>
            Associe este termo ao ícone acima: a dupla codificação (texto + imagem)
            ajuda o cérebro a lembrar do significado depois.
          </span>
        </div>
        <button className="btn btn-primary" onClick={onClose}>Entendi</button>
      </div>
    </div>
  );
}

function Dictionary({ terms }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="card">
      <h2 className="card-title"><Icon name="book-open" />Dicionário visual</h2>
      <p className="card-desc">Os termos difíceis do seu documento, explicados. Toque em qualquer um para entender.</p>
      <div className="term-chips">
        {terms.map((t) => (
          <button key={t.termo} className={"term-chip tipo-" + t.tipo} onClick={() => setOpen(t)} aria-haspopup="dialog">
            <span className="tipo-dot" aria-hidden="true" />
            {t.termo}
            <Icon name="help-circle" size={15} />
          </button>
        ))}
      </div>
      <div className="side-note" style={{ marginTop: 18 }}>
        <Icon name="info" size={16} />
        <span>
          <strong>Legenda:</strong>&nbsp;
          <span style={{ color: "var(--violet-700)", fontWeight: 700 }}>●</span> Latinismo&nbsp;
          <span style={{ color: "var(--blue-700)", fontWeight: 700 }}>●</span> Processual&nbsp;
          <span style={{ color: "var(--teal-700)", fontWeight: 700 }}>●</span> Substantivo
        </span>
      </div>
      {open && <TermModal term={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ConfidenceModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label="O que significa a confiança da IA" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon name="x" size={17} /></button>
        <div className="modal-anchor" style={{ background: "var(--green-100)", color: "var(--green-700)" }}>
          <Icon name="badge-check" size={30} />
        </div>
        <span className="modal-tipo" style={{ background: "var(--green-100)", color: "var(--green-700)" }}>Transparência</span>
        <h3>O que é a confiança da IA?</h3>
        <p>
          É o grau de precisão que a inteligência artificial atribui à própria tradução,
          calculado com base em documentos oficiais e decisões judiciais semelhantes.
        </p>
        <ul className="legend-list">
          <li><span className="legend-swatch" style={{ background: "var(--green-700)" }} />90–100%: tradução muito confiável</li>
          <li><span className="legend-swatch" style={{ background: "var(--gold-500)" }} />70–89%: confiável, revise os pontos-chave</li>
          <li><span className="legend-swatch" style={{ background: "var(--red-600)" }} />Abaixo de 70%: procure um profissional</li>
        </ul>
        <p style={{ marginTop: 14, fontSize: "0.8rem" }}>
          O Entende Lei mostra essa métrica sempre — você merece saber o quanto pode confiar.
        </p>
        <button className="btn btn-primary" onClick={onClose}>Entendi</button>
      </div>
    </div>
  );
}

function Dashboard({ data, onReset }) {
  const [showConf, setShowConf] = useState(false);
  return (
    <section className="screen" aria-labelledby="t3">
      <div className="dash-head">
        <div>
          <h1 className="screen-title" id="t3" style={{ marginBottom: 10 }}>Seu documento, traduzido</h1>
          <span className="proc-id"><Icon name="landmark" size={14} />Processo {data.id_processo}</span>
        </div>
        <div className="confidence-wrap">
          <ConfidenceRing value={data.confianca_ia} />
          <div className="confidence-text">
            <strong>Confiança da IA</strong>
            <p>Precisão estimada com base em documentos oficiais da Justiça.</p>
            <button className="what" onClick={() => setShowConf(true)}>
              <Icon name="help-circle" size={13} />O que isso significa?
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <div className="card">
        <h2 className="card-title"><Icon name="columns-2" />De juridiquês para claro</h2>
        <p className="card-desc">À esquerda, o texto oficial (fonte da verdade). À direita, a tradução funcional do Entende Lei.</p>
        <div className="compare-grid">
          <div className="compare-pane original">
            <span className="compare-tag src"><Icon name="file-text" size={13} />Documento oficial</span>
            <p>{data.texto_original}</p>
          </div>
          <div className="compare-pane simplified">
            <span className="compare-tag dst"><Icon name="sparkles" size={13} />Tradução Entende Lei</span>
            <p>{data.texto_simplificado}</p>
          </div>
        </div>
      </div>

      <Timeline items={data.status_timeline} />
      <RightsDuties items={data.direitos_deveres} />
      <Dictionary terms={data.termos_chave} />

      <div className="dash-actions">
        <button className="btn btn-ghost" onClick={onReset}>
          <Icon name="rotate-ccw" size={17} />Analisar outro documento
        </button>
        <span className="mock-note">
          <Icon name="info" size={14} />
          Demonstração — dados simulados conforme o schema JSON do Entende Lei.
        </span>
      </div>

      {showConf && <ConfidenceModal onClose={() => setShowConf(false)} />}
    </section>
  );
}

/* ---------- App ---------- */

function App() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState(null);

  // Simula a chamada à API de IA: roteia o cenário pelo conteúdo do texto.
  const analyze = useCallback(() => {
    const data = SCENARIOS[detectScenario(text)];
    setFileName(null);
    setResult({
      ...data,
      texto_original: text.trim().length >= MIN_CHARS ? text.trim() : data.texto_original,
    });
    setStep(2);
  }, [text]);

  // Upload de arquivo: qualquer arquivo dispara o fluxo e roteia ao Cenário 3.
  const handleUpload = useCallback((file) => {
    if (!file) return;
    setFileName(file.name || "documento enviado");
    setResult({ ...SCENARIOS.cenario3 });
    setStep(2);
  }, []);

  // Consulta pública: o processo escolhido roteia ao cenário mapeado.
  const handleSelectProcess = useCallback((proc) => {
    const data = SCENARIOS[proc.cenario] || SCENARIOS.cenario1;
    setFileName("processo " + proc.numero_cnj);
    setResult({ ...data });
    setStep(2);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setText("");
    setFileName(null);
    setStep(1);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [step]);

  return (
    <React.Fragment>
      <Header step={step} />
      <main className="main">
        {step === 1 && <InputScreen text={text} setText={setText} onSubmit={analyze} onUpload={handleUpload} onSelectProcess={handleSelectProcess} />}
        {step === 2 && <ProcessingScreen onDone={() => setStep(3)} subject={fileName} />}
        {step === 3 && result && <Dashboard data={result} onReset={reset} />}
      </main>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
