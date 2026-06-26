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

  if (!window.Clerk) {
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
    window.Clerk.redirectToSignIn({ redirectUrl: new URL("index.html", window.location.href).href });
  });
});
