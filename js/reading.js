async function initializePage() {
    await fetchAllData();
    renderContent();
}

function renderContent() {
    const container = document.querySelector(".resource-container");
    container.innerHTML = "";

    readings.forEach(event => {
        const linkDiv = document.createElement("div");
        linkDiv.className = "link";

        const title = document.createElement("h2");
        title.textContent = event.title;

        const author = document.createElement("h3");
        author.textContent = "Author: " + event.author;

        const published = document.createElement("h3");
        published.textContent = "Published: " + event.published;

        const description = document.createElement("p");
        description.textContent = event.description;

        const ul = document.createElement("ul");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "link-button";
        a.href = event.link;
        a.target = "_blank";
        a.textContent = "View Reading";

        li.appendChild(a);
        ul.appendChild(li);

        linkDiv.appendChild(title);
        linkDiv.appendChild(author);
        linkDiv.appendChild(published);
        linkDiv.appendChild(description);
        linkDiv.appendChild(ul);

        container.appendChild(linkDiv);
    });
}

initializePage();