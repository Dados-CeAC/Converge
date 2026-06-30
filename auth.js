document.addEventListener("DOMContentLoaded", async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = "login.html";
        return;
    }

    const email = Clerk.user.primaryEmailAddress?.emailAddress || "";

    if (!email.endsWith("@hc.fm.usp.br")) {

        await Clerk.signOut();

        alert("Apenas usuários com e-mail institucional @hc.fm.usp.br podem acessar o sistema.");

        window.location.href = "login.html";
        return;
    }

    console.log("Usuário autorizado:", email);
});