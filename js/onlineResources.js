async function initializePage() {
    await fetchAllData();
    renderContent();
}

function renderContent() {
    const container = document.querySelector(".link-container");
    container.innerHTML = "";

    resources.forEach(event => {
        const linkDiv = document.createElement("div");
        linkDiv.className = "link";

        const title = document.createElement("h2");
        title.textContent = event.title;

        const description = document.createElement("p");
        description.textContent = event.description;
        

        const ul = document.createElement("ul");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "link-button";
        a.href = event.link;
        a.target = "_blank";
        a.textContent = "View " + event.linkName;

        li.appendChild(a);
        ul.appendChild(li);

        linkDiv.appendChild(title);
        linkDiv.appendChild(description);
        if (event.embedLink != "") {
            const embedded = document.createElement("iframe");
            embedded.src = event.embedLink;
            embedded.class = 'youtube';
            linkDiv.appendChild(embedded);
        }
        linkDiv.appendChild(ul);

        container.appendChild(linkDiv);
    });
}

initializePage();