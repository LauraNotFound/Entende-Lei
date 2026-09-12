/* ============================================================
   Entende Lei — Configuração do modo LIVE (opcional)
   ------------------------------------------------------------
   Para ativar a análise real via Gemini:
     1. Crie uma API key gratuita em https://aistudio.google.com
        (restrinja por HTTP referrer ao domínio do deploy).
     2. Cole a key abaixo em `apiKey` — OU passe via URL:
        ?live=1&key=SUA_KEY
   Com a key configurada, acesse o app com ?live=1.
   Se a chamada falhar, o app usa o mock automaticamente.
   ============================================================ */

window.LEXNOW_LIVE = {
  enabled: false,
  apiKey: "",
  model: "gemini-2.5-flash",
};
