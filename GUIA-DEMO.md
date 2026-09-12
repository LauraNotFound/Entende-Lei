# Guía de demostración — Entende Lei (MVP)

URL en vivo: **https://lauranotfound.github.io/Entende-Lei/**

Duración sugerida: 3–4 minutos. La pantalla de procesamiento tarda ~10 s;
úsala para narrar ("la IA muestra su trabajo — Labor Perception Bias").

---

## Camino A — Texto pegado (Cenário 1: inicio de proceso)

1. En la pantalla 1, clic en el chip **"Petição inicial"** (rellena el textarea).
2. Clic en **"Simplificar Agora"**.
3. En el dashboard, destacar:
   - Anillo de **confianza 96%** + botón "O que isso significa?" (transparencia ética)
   - Comparación lado a lado juridiquês ↔ claro
   - Timeline con "Etapa atual: Defesa" + badge "Prazo" (crítica)
   - Chip de diccionario **"Revelia"** → popup con explicación

## Camino B — Texto pegado (Cenário 2: imissão na posse + astreintes)

1. "Analisar outro documento" → chip **"Imissão na posse"** → Simplificar.
2. Destacar: timeline de 4 etapas, multa de R$500/día, diccionario con
   "Imissão na posse", "Astreintes", "Ex nunc" (colores por tipo de término).

## Camino C — Upload de archivo (Cenário 3: proceso cerrado)

1. Arrastrar **`exemplo-upload.pdf`** (en la carpeta del proyecto o en
   la URL `/exemplo-upload.pdf`) sobre el botón "Enviar PDF ou DOC",
   o hacer clic y seleccionarlo. Cualquier archivo funciona — no se parsea.
2. La pantalla de procesamiento muestra el nombre del archivo.
3. Dashboard: proceso ganado y archivado — "nada que hacer" (baja ansiedad).

## Camino D — Consulta pública (CPF/CNPJ/Nº CNJ)

1. Clic en **"Já tem processo? Consulte por CPF, CNPJ ou Nº CNJ"**.
2. Escribir `123.456.789-00` → la app detecta "CPF" automáticamente.
3. "Buscar processos" → lista de 4 procesos → **"Interpretar"** en cualquiera
   (cada uno abre su escenario: los dos primeros = en curso, el tercero = cerrado).

---

## Roteamento (cómo decide el demo)

| Input | Keyword en el texto | Escenario |
|---|---|---|
| Texto | `petição` o `revelia` | 1 (default si nada coincide) |
| Texto | `imissão` o `astreinte` | 2 (tiene prioridad) |
| Archivo | cualquiera | 3 |
| Consulta CNJ/CPF | botón "Interpretar" | el mapeado en `LEXNOW_PROCESSOS` |

⚠️ `imissão` es literal: "demissão"/"admissão" NO disparan el escenario 2.
Usa siempre los chips de ejemplo o textos que contengan "imissão"/"astreinte".

## Posibles preguntas del jurado

- **¿Por qué % de confianza visible?** Requisito ético de transparencia —
  el usuario merece saber cuánto confiar en la traducción.
- **¿Por qué barra de progreso con pasos?** Labor Perception Bias — ver el
  trabajo de la IA reduce ansiedad y aumenta valor percibido.
- **¿Y las imágenes del diccionario?** MVP usa iconos Lucide como âncoras
  semánticas por tipo de término (dupla codificação → retención).
- **¿Dónde está la IA real?** Backend mock: el frontend consume el schema
  JSON oficial (`mock-data.js`), listo para enchufar la API después.
