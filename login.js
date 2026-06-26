document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  const errorMessage = document.querySelector(".error-message");

  function showError(message) {
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function clearError() {
    if (!errorMessage) return;
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  function redirectToIndex() {
    window.location.href = "index.html";
  }

  // Aguarda até que o script do Clerk esteja disponível (evita erro por carregamento assíncrono)
  async function waitForClerk(timeoutMs = 7000) {
    // Se houver uma promise global criada no head, aguarda ela (mais rápida e confiável)
    if (window._clerkLoaded && typeof window._clerkLoaded.then === 'function') {
      try {
        const res = await Promise.race([
          window._clerkLoaded,
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs)),
        ]);
        return !!res && !!window.Clerk;
      } catch (e) {
        return !!window.Clerk;
      }
    }

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (window.Clerk) return true;
      // espera 150ms antes de checar novamente
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 150));
    }
    return false;
  }

  const clerkAvailable = await waitForClerk();
  if (!clerkAvailable) {
    showError("Clerk não foi carregado. Verifique a conexão ou a chave publishable.");
    return;
  }

  try {
    await window.Clerk.load();
  } catch (error) {
    showError("Erro ao inicializar o Clerk: " + (error?.message || error));
    return;
  }

  if (window.Clerk.user) {
    redirectToIndex();
    return;
  }

  if (!loginBtn) {
    showError("Botão de login não foi encontrado.");
    return;
  }

  loginBtn.addEventListener("click", () => {
    clearError();
    // Tenta redirecionar para a tela de login do Clerk (se disponível).
    try {
      if (typeof window.Clerk.redirectToSignIn === 'function') {
        window.Clerk.redirectToSignIn({ redirectUrl: new URL("index.html", window.location.href).href });
        return;
      }
      // fallback: tenta métodos alternativos conhecidos
      if (typeof window.Clerk.openSignIn === 'function') {
        window.Clerk.openSignIn({ afterSignInUrl: new URL("index.html", window.location.href).href });
        return;
      }
    } catch (e) {
      // continua para fallback
    }

    // Fallback local (útil para desenvolvimento): redireciona direto para o site
    window.location.href = 'index.html';
  });
});
