let selectedCategory = "all";

async function initializePage() {
    await fetchAllData();
    renderContent();
}
document.getElementById("categoryFilter").addEventListener("change", function () {
    selectedCategory = this.value;
    renderContent();
});

let searchQuery = "";

document.getElementById("searchInput").addEventListener("input", function () {
    searchQuery = this.value.toLowerCase();
    renderContent();
});

function renderContent() {
    const listContainer = document.querySelector(".concepts-list");
    const detailContainer = document.querySelector(".concept-details");
    listContainer.innerHTML = "";
    detailContainer.innerHTML = "";

    let filteredConcepts = concepts.filter(concept => {
        let categoryMatch =
            selectedCategory === "all" ||
            (selectedCategory === "aiSystems" && concept.aiSystems) ||
            (selectedCategory === "logic" && concept.logic) ||
            (selectedCategory === "philosophy" && concept.philosophy) ||
            (selectedCategory === "hardware" && concept.hardware);
        let searchMatch =
            concept.title.toLowerCase().includes(searchQuery) ||
            concept.description.toLowerCase().includes(searchQuery);
    
        return categoryMatch && searchMatch;
    });

    function renderConceptDetail(concept) {
        detailContainer.innerHTML = `
            <h2>${concept.title}</h2>
            <p><img src="images/${concept.image}" alt="${concept.title}" class="img_fl"/>
            ${concept.description}</p>
            <p><strong>Image Source:</strong> <a href="${concept.imageSource}" target="_blank">${concept.sourceName}</a></p>
        `;
    }
    
    const he = document.createElement("h3");
    he.textContent ="Click on any concept to see more information!";
    listContainer.appendChild(he);
    // Create list items
    filteredConcepts.forEach((concept, index) => {
        const conceptDiv = document.createElement("div");
        conceptDiv.className = "concept";
        
        // Make the entire personDiv clickable
        conceptDiv.addEventListener("click", () => {
            renderConceptDetail(concept);
        });

        const gridDiv = document.createElement("div");
        gridDiv.className = "grid";

        const p1 = document.createElement("div");
        p1.className = "p1";

        const containerDiv = document.createElement("div");
        containerDiv.className = "container";

        const img = document.createElement("img");
        img.className = "image";
        img.src = `images/${concept.image}`;
        img.alt = concept.title;

        containerDiv.appendChild(img);
        p1.appendChild(containerDiv);

        const p2 = document.createElement("div");
        p2.className = "p2";

        const nameEl = document.createElement("h2");
        nameEl.textContent = concept.title;

        const desc = document.createElement("p");
        desc.textContent = concept.description;

        p2.appendChild(nameEl);
        p2.appendChild(desc);

        gridDiv.appendChild(p1);
        gridDiv.appendChild(p2);

        conceptDiv.appendChild(gridDiv);

        listContainer.appendChild(conceptDiv);

        if (index === 0) {
            renderConceptDetail(concept);
        }
    });
}

initializePage();