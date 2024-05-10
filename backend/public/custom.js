window.onload = function () {
    createHeader();

    const ui = SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: '#swagger-ui',
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
    });
    
    createFooter();
}

function createHeader() {
    const header = document.createElement("header");
    header.className = "sticky-top";

    const nav = document.createElement("nav");
    nav.className = "navbar navbar-expand-lg navbar-light bg-light";
    header.appendChild(nav);

    const containerDiv = document.createElement("div");
    containerDiv.className = "container-fluid";
    nav.appendChild(containerDiv);

    const logoLink = document.createElement("a");
    logoLink.className = "navbar-brand";
    logoLink.href = "/";
    logoLink.title = "Home";
    const logo = document.createElement("img");
    logo.src = "/favicon.ico";
    logo.width = "48";
    logo.alt = "logo";
    logoLink.appendChild(logo);
    containerDiv.appendChild(logoLink);

    const togglerButton = document.createElement("button");
    togglerButton.className = "navbar-toggler";
    togglerButton.type = "button";
    togglerButton.setAttribute("data-bs-toggle", "collapse");
    togglerButton.setAttribute("data-bs-target", "#navbarSupportedContent");
    togglerButton.setAttribute("aria-controls", "navbarSupportedContent");
    togglerButton.setAttribute("aria-expanded", "false");
    togglerButton.setAttribute("aria-label", "Toggle navigation");
    togglerButton.innerHTML = '<span class="navbar-toggler-icon"></span>';
    containerDiv.appendChild(togglerButton);

    const navbarDiv = document.createElement("div");
    navbarDiv.className = "collapse navbar-collapse";
    navbarDiv.id = "navbarSupportedContent";
    containerDiv.appendChild(navbarDiv);

    const navList = document.createElement("ul");
    navList.className = "navbar-nav";
    navbarDiv.appendChild(navList);

    const homeItem = document.createElement("li");
    homeItem.className = "nav-item";
    navList.appendChild(homeItem);

    const homeLink = document.createElement("a");
    homeLink.className = "nav-link";
    homeLink.href = "/";
    homeLink.textContent = "Home";
    homeLink.title = "Home";
    homeItem.appendChild(homeLink);

    const docsItem = document.createElement("li");
    docsItem.className = "nav-item";
    navList.appendChild(docsItem);

    const docsLink = document.createElement("a");
    docsLink.className = "nav-link";
    docsLink.href = "/docs";
    docsLink.textContent = "Documentação";
    docsLink.title = "Documentação";
    docsItem.appendChild(docsLink);

    const repoItem = document.createElement("li");
    repoItem.className = "nav-item";
    navList.appendChild(repoItem);

    const repoLink = document.createElement("a");
    repoLink.className = "nav-link";
    repoLink.target = "_blank";
    repoLink.href = "https://github.com/JeanCSF/sneakers_monitor";
    repoLink.textContent = "Repositório";
    repoLink.title = "Repositório";
    repoItem.appendChild(repoLink);

    const siteItem = document.createElement("li");
    siteItem.className = "nav-item";
    navList.appendChild(siteItem);

    const siteLink = document.createElement("a");
    siteLink.className = "nav-link";
    siteLink.target = "_blank";
    siteLink.href = "https://snkrmagnet.com.br/";
    siteLink.textContent = "Site Principal";
    siteLink.title = "Nosso Site";
    siteItem.appendChild(siteLink);

    header.appendChild(nav);
    document.body.insertBefore(header, document.body.firstChild);
}

function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "bg-light text-muted py-4";

    const container = document.createElement("div");
    container.className = "container";
    footer.appendChild(container);

    const row = document.createElement("div");
    row.className = "row";
    container.appendChild(row);

    const col = document.createElement("div");
    col.className = "col-md-6";
    row.appendChild(col);

    const h5Icons = document.createElement("h5");
    h5Icons.textContent = "Ícones por Freepik:";
    col.appendChild(h5Icons);

    const ulIcons = document.createElement("ul");
    ulIcons.className = "list-unstyled";
    col.appendChild(ulIcons);

    const liIcons = document.createElement("li");
    liIcons.innerHTML = '<a class="text-reset text-decoration-none" href="https://br.freepik.com/search?format=search&query=Siipkan%20Creative" target="_blank" rel="noreferrer">Siipkan Creative</a>';
    ulIcons.appendChild(liIcons);

    const li2Icons = document.createElement("li");
    li2Icons.innerHTML = '<a class="text-reset text-decoration-none" href="https://br.freepik.com/search?format=search&query=kerismaker" target="_blank" rel="noreferrer">kerismaker</a>';
    ulIcons.appendChild(li2Icons);

    const col2 = document.createElement("div");
    col2.className = "col-md-6";
    row.appendChild(col2);

    const h5Socials = document.createElement("h5");
    h5Socials.textContent = "Redes Sociais";
    col2.appendChild(h5Socials);

    const ulSocials = document.createElement("ul");
    ulSocials.className = "list-unstyled";
    col2.appendChild(ulSocials);

    const liSocials = document.createElement("li");
    liSocials.innerHTML = '<a href="https://www.linkedin.com/in/jean-carlos-6149a2232/" class="text-reset text-decoration-none" target="_blank" rel="noreferrer">Linkedin</a>';
    ulSocials.appendChild(liSocials);

    const li2Socials = document.createElement("li");
    li2Socials.innerHTML = '<a href="https://www.facebook.com/fookinselfish/" class="text-reset text-decoration-none" target="_blank" rel="noreferrer">Facebook</a>';
    ulSocials.appendChild(li2Socials);

    const li3Socials = document.createElement("li");
    li3Socials.innerHTML = '<a href="https://www.instagram.com/cocao.php" class="text-reset text-decoration-none" target="_blank" rel="noreferrer">Instagram</a>';
    ulSocials.appendChild(li3Socials);

    const p = document.createElement("p");
    p.className = "text-end";
    p.textContent = "Desenvolvido por: ";
    col2.appendChild(p);

    const a = document.createElement("a");
    a.href = "https://github.com/JeanCSF";
    a.className = "text-reset";
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = "JeanCSF";
    p.appendChild(a);
    p.appendChild(document.createTextNode("©"));
    p.appendChild(document.createTextNode(new Date().getFullYear()));

    document.body.appendChild(footer);
}

function createContribute() {
    const code = document.createElement("pre");
    code.id = "code";
    code.className = "d-none";
    code.textContent = "00020126580014BR.GOV.BCB.PIX0136946069f0-d048-4606-ae49-3f363f1b40475204000053039865802BR5925Jean Carlos de Santana Fe6009SAO PAULO621405101ePw3KHoui6304FE0A";

    const contibute = document.createElement("div");
    contibute.className = "col-lg-4 text-center text-lg-end mt-4 mt-lg-0 sticky-top";

    const contributeTitle = document.createElement("p");
    contributeTitle.className = "fs-1";
    contributeTitle.textContent = "Contribua com o projeto";
    contibute.appendChild(contributeTitle);

    const contributeQrContainer = document.createElement("div");
    contributeQrContainer.className = "text-lg-end d-flex flex-column align-items-center";

    const contributeQr = document.createElement("img");
    contributeQr.className = "ms-lg-auto col-lg-4 col-8";
    contributeQr.src = "/qr.png";
    contributeQr.alt = "Pix QR Code";
    contributeQrContainer.appendChild(contributeQr);

    const contributeBtn = document.createElement("button");
    contributeBtn.className = "ms-lg-auto btn btn-primary fw-bold col-lg-4 col-8 ";
    contributeBtn.id = "copyBtn";
    contributeBtn.textContent = "Copiar Código";
    contributeBtn.addEventListener("click", function () {
        const copyText = code.textContent;

        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = copyText;

        document.body.appendChild(tempTextarea);

        tempTextarea.select();
        tempTextarea.setSelectionRange(0, 99999);

        document.execCommand("copy");

        document.body.removeChild(tempTextarea);

        contributeBtn.textContent = "Código Copiado!";
        contributeBtn.classList.remove("btn-primary");
        contributeBtn.classList.add("btn-success");

        setTimeout(function () {
            contributeBtn.textContent = "Copiar Código";
            contributeBtn.classList.remove("btn-success");
            contributeBtn.classList.add("btn-primary");
        }, 3000);
    });
    contributeQrContainer.appendChild(contributeBtn);
    contibute.appendChild(contributeQrContainer);

    document.body.appendChild(code);

    return contibute;
}
