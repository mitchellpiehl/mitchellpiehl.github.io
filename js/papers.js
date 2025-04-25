async function initializePage() {
    await fetchAllData();
    renderContent();
}
function renderContent() {
    const container = document.querySelector(".paper-container");
    container.innerHTML = "";

    papers.forEach(paper => {
        const paperDiv = document.createElement("div");
        paperDiv.className = "paper";

        const title = document.createElement("h2");
        title.textContent = paper.title;

        const author = document.createElement("h3");
        author.textContent = "Author: " + paper.author;

        const description = document.createElement("p");
        description.textContent = paper.description;

        const ul = document.createElement("ul");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "link-button";
        a.href = paper.link;
        a.target = "_blank";
        a.textContent = "View Paper";

        li.appendChild(a);
        ul.appendChild(li);

        paperDiv.appendChild(title);
        paperDiv.appendChild(author);
        paperDiv.appendChild(description);
        paperDiv.appendChild(ul);

        container.appendChild(paperDiv);
    });
}

initializePage();