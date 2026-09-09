document.addEventListener("DOMContentLoaded", async () => {

    try {
        await Clerk.load();
    } catch (error) {
        console.warn("Clerk não carregou corretamente:", error);
        window.location.href = "login.html";
        return;
    }

    if (!Clerk.user) {
        window.location.href = "login.html";
        return;
    }

    const email = Clerk.user.primaryEmailAddress?.emailAddress || "";

    if (!email.endsWith("@hc.fm.usp.br")) {
        try {
            await Clerk.signOut();
        } catch (error) {
            console.warn("Falha ao encerrar sessão do Clerk:", error);
        }

        alert("Apenas usuários com e-mail institucional @hc.fm.usp.br podem acessar o sistema.");
        window.location.href = "login.html";
        return;
    }

    console.log("Usuário autorizado:", email);
});
