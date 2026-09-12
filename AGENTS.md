# Entende Lei — MVP

Mockup interativo do Entende Lei: SPA em 3 etapas (input multimodal →
processamento IA → dashboard Visual Law) conforme `LexNow-contexto.docx`.

## Arquitetura

- Sem build step: React 18 UMD + Babel standalone + Lucide UMD via unpkg.
- `index.html` — shell + CDNs
- `styles.css` — design system (paleta navy/gold de baixa saturação, WCAG)
- `mock-data.js` — `window.LEXNOW_SCENARIOS` (cenario1/2/3 no schema JSON oficial) + `LEXNOW_PROCESSING_STEPS` + `LEXNOW_DEMO_INPUTS` + `LEXNOW_PROCESSOS` (consulta CPF/CNPJ/CNJ)
- `exemplo-upload.pdf` — PDF mínimo para demo de upload → cenario3
- `GUIA-DEMO.md` — roteiro de apresentação
- `app.jsx` — componentes React (`type="text/babel"`)

## Rodar localmente

```bash
python -m http.server 8026
# abrir http://localhost:8026
```

(Não abrir index.html via file:// — Babel standalone carrega app.jsx via XHR.)

## Ambiente

- `npm install` NÃO funciona: registry.npmjs.org inacessível nesta máquina.
- unpkg.com funciona — por isso as deps são CDN/UMD.
- Sem python-docx/python-pptx: extrair texto de .docx/.pptx via zipfile+regex (XML interno).

## Verificação

```bash
node -e "const B=require('C:/Users/lcmm9/AppData/Local/Temp/babel.min.js');B.transform(require('fs').readFileSync('app.jsx','utf8'),{presets:['react']});console.log('ok')"
```

## Convenções

- Ícones: componente `<Icon name="kebab-case">` → `lucide.icons[PascalCase]` + `lucide.createElement`.
- Roteamento (app.jsx `detectScenario`): "imissão"/"astreinte" → cenario2 | "petição"/"revelia" → cenario1 | default → cenario1. Upload de qualquer arquivo → cenario3 (arquivo nunca é parseado).
- `termos_chave[].tipo` ∈ {Latinismo, Processual, Substantivo} → cores/ícones em `LEXNOW_TIPO_STYLE` e classes `.tipo-*` no CSS.
