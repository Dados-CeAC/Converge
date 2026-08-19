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

  if (loginBtn) loginBtn.disabled = true;

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

  if (loginBtn) loginBtn.disabled = false;

  if (window.Clerk.user) {
    const email = window.Clerk.user.primaryEmailAddress?.emailAddress || "";

    if (!email.endsWith("@hc.fm.usp.br")) {
      await window.Clerk.signOut();
      showError("Use apenas seu e-mail institucional @hc.fm.usp.br");
      return;
    }

    redirectToIndex();
  }

  if (!loginBtn) {
    showError("Botão de login não foi encontrado.");
    return; 
  }

  loginBtn.addEventListener("click", async () => {
    clearError();
    loginBtn.disabled = true;

    try {
      if (typeof window.Clerk.redirectToSignIn === 'function') {
        await window.Clerk.redirectToSignIn({
          signInForceRedirectUrl: new URL("index.html", window.location.href).href,
        });
        return;
      }

      if (typeof window.Clerk.openSignIn === 'function') {
        await window.Clerk.openSignIn({
          afterSignInUrl: new URL("index.html", window.location.href).href,
        });
        return;
      }

      throw new Error("O método de login do Clerk não está disponível.");
    } catch (error) {
      showError("Não foi possível iniciar o login: " + (error?.message || error));
      loginBtn.disabled = false;
    }
  });
});
