/* ============================================================
   Entende Lei — Configuração do modo LIVE (Gemini API)
   ------------------------------------------------------------
   Ativação:
     - enabled: true  → análise real para todos os acessos
     - ou por URL:    ?live=1   (key daqui) / ?key=... (override)
   Se a chamada falhar, o app usa o mock automaticamente.

   IMPORTANTE: restrinja esta key por HTTP referrer no AI Studio
   (Application restrictions → lauranotfound.github.io/*).
   ============================================================ */

window.LEXNOW_LIVE = {
  enabled: true,
  apiKey: "AIzaSyAA6isLAnaTN06n4E5CXgPwACZo-AjWJ40",
  model: "gemini-3.6-flash",
};
