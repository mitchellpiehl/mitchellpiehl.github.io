let selectedCategory = "all";

async function initializePage() {
    await fetchAllData();
    renderContent();
}
document.getElementById("categoryFilter").addEventListener("change", function () {
    selectedCategory = this.value;
    renderContent();
});

function renderContent() {
    const listContainer = document.querySelector(".people-list");
    const detailContainer = document.querySelector(".person-details");
    listContainer.innerHTML = "";
    detailContainer.innerHTML = "";

    let filteredPeople = people.filter(person => {
        if (selectedCategory === 'aiEngineers') return person.aiEngineer;
        if (selectedCategory === 'philosophers') return person.philosopher;
        if (selectedCategory === 'mathematicians') return person.mathematician;
        return true;
    });

    // Sort by birth year
    const sortedPeople = [...filteredPeople].sort((a, b) => parseInt(a.birth) - parseInt(b.birth));

    // Helper to render detailed view
    function renderPersonDetail(person) {
        detailContainer.innerHTML = `
            <h2>${person.name}</h2>
            <h3>${person.birth} - ${person.death}</h3>
            <p><img src="images/${person.image}" alt="${person.name}" class="img_fl"/>
            ${person.long}</p>
            <p><strong>Image Source:</strong> <a href="${person.imageSource}" target="_blank">${person.sourceName}</a></p>
        `;
    }
    
    const he = document.createElement("h3");
    he.textContent ="Click on any person to see more information!";
    listContainer.appendChild(he);
    // Create list items
    sortedPeople.forEach((person, index) => {
        const personDiv = document.createElement("div");
        personDiv.className = "person";
        
        // Make the entire personDiv clickable
        personDiv.addEventListener("click", () => {
            renderPersonDetail(person);
        });

        const gridDiv = document.createElement("div");
        gridDiv.className = "grid";

        const p1 = document.createElement("div");
        p1.className = "p1";

        const containerDiv = document.createElement("div");
        containerDiv.className = "container";

        const img = document.createElement("img");
        img.className = "image";
        img.src = `images/${person.image}`;
        img.alt = person.name;

        containerDiv.appendChild(img);
        p1.appendChild(containerDiv);

        const p2 = document.createElement("div");
        p2.className = "p2";

        const nameEl = document.createElement("h2");
        nameEl.textContent = person.name;

        const yearsEl = document.createElement("h3");
        yearsEl.textContent = `${person.birth}-${person.death}`;

        const desc = document.createElement("p");
        desc.textContent = person.short;

        p2.appendChild(nameEl);
        p2.appendChild(yearsEl);
        p2.appendChild(desc);

        gridDiv.appendChild(p1);
        gridDiv.appendChild(p2);

        personDiv.appendChild(gridDiv);

        listContainer.appendChild(personDiv);

        if (index === 0) {
            renderPersonDetail(person);
        }
    });
}

initializePage();