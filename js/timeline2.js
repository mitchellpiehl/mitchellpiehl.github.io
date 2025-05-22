async function initializePage() {
    await fetchAllData();
    renderTimeline();
    renderTimeline2();
}

const timeline = document.getElementById('timeline');
const eraContainer = document.getElementById('eras');

let zoomLevel = 0.5;
let zoomTarget = 1.5;
let zoomStep = 0.1;
let currentEventIndex = 0;
let yearSortedEvents = [];
let yearSortedEvents2 = [];
const minZoom = 0.1;
const maxZoom = 2;

const modal = document.createElement('div');
modal.classList.add('modal');
modal.style.position = 'absolute';
modal.style.right = '5%';
modal.style.top = '350px';
modal.style.transform = '';
modal.style.width = '30%';
modal.style.minWidth = '150px';
modal.style.background = 'white';
modal.style.padding = '10px';
modal.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
modal.style.borderRadius = '10px';
modal.style.border = '1px solid #ccc';
modal.style.display = 'none';
modal.style.zIndex = '1000';
modal.style.maxHeight = '60%'; 
modal.style.overflowY = 'auto';
document.body.appendChild(modal);

function showModal(event) {
    currentEventIndex = yearSortedEvents2.findIndex(e => e.year === event.year && e.short === event.short);
    modal.innerHTML = `
        <button id="prev-event" style="float: left;">&#9664;</button>
        <button id="next-event" style="float: right;">&#9654;</button>
        <h3>${event.year}</h3>
        <p>${event.description}</p>
    `;
    if (event.image) {
        modal.innerHTML += `<img src="images/${event.image}" style="width:100%">`;
    }
    if (event.link) {
        modal.innerHTML += `<p><a href="${event.link}" target="_blank">More Info</a></p>`;
    }
    modal.style.display = 'block';

    document.getElementById("prev-event").addEventListener("click", (e) => {
        e.stopPropagation();
        navigateEvent(-1);
    });
    document.getElementById("next-event").addEventListener('click', (e) => {
        e.stopPropagation();
        navigateEvent(1);
    });
}

function navigateEvent(direction) {
    currentEventIndex += direction;
    if (currentEventIndex < 0) {
        currentEventIndex = yearSortedEvents2.length - 1;
    } else if (currentEventIndex >= yearSortedEvents2.length) {
        currentEventIndex = 0;
    }
    showModal(yearSortedEvents2[currentEventIndex]);
}

function hideModal() {
    modal.style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !e.target.classList.contains('event')) {
        hideModal();
    }
});

function renderTimeline() {
    const timeline = document.getElementById('timeline');
    const eraContainer = document.getElementById('eras');
    timeline.innerHTML = '';
    eraContainer.innerHTML = '';

    const filteredEvents = events.filter(event => event.year < 1950);
    yearSortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year);
    yearSortedEvents2 = [...filteredEvents].filter(event => event.year < 1950);

    for (let year = 1600; year <= 1950; year += 50) {
        const yearLabel = document.createElement('div');
        yearLabel.classList.add('year-label');
        yearLabel.style.top = `${(year - 1600) * 10 * zoomLevel}px`;
        yearLabel.innerText = year;
        timeline.appendChild(yearLabel);
    }

    let occupiedPositions = [];

    filteredEvents.sort((a, b) => b.priority - a.priority);

    filteredEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.style.top = `${(event.year - 1600) * 10 * zoomLevel}px`;

        let leftOffset = 20;
        let eventTop = (event.year - 1600) * 10 * zoomLevel;
        let maxOffset = 500;
        let spacing = 70;

        while (occupiedPositions.some(pos => Math.abs(pos.top - eventTop) < spacing && pos.left === leftOffset) && leftOffset < maxOffset) {
            leftOffset += 300;
        }

        if (leftOffset < maxOffset || zoomLevel > 1.5) {
            occupiedPositions.push({ top: eventTop, left: leftOffset });
            eventElement.style.left = `${leftOffset}px`;
            eventElement.innerHTML = `<strong>${event.year}</strong><br>${zoomLevel > 5 ? event.long : event.short}`;
            
            eventElement.addEventListener('mouseover', () => {
                eventElement.innerHTML = `<strong>${event.year}</strong><br>${event.long}`;
            });
            
            eventElement.addEventListener('mouseout', () => {
                eventElement.innerHTML = `<strong>${event.year}</strong><br>${zoomLevel > 5 ? event.long : event.short}`;
            });
            
            eventElement.addEventListener('click', () => {
                showModal(event);
            });
            
            timeline.appendChild(eventElement);
        }
        const startYear = 1600;
        const endYear = 1950;
        const totalYears = endYear - startYear;
        const dynamicHeight = totalYears * 10.1 * zoomLevel;

        timeline.style.height = `${dynamicHeight}px`;
        eraContainer.style.height = `${dynamicHeight}px`;
    });

    if (yearSortedEvents2.length > 0) {
        showModal(yearSortedEvents2[0]);
    }
    const eras = [
        { name: "Enlightenment", start: 1600, end: 1800, color: "#bfdbfe" },
        { name: "Industrial Revolution", start: 1800, end: 1900, color: "#c7d2fe" },
        { name: "Age of Machines", start: 1900, end: 1950, color: "#fca5a5" }
    ];

    eras.forEach(era => {
        const eraElement = document.createElement('div');
        eraElement.classList.add('era');
        eraElement.style.top = `${(era.start - 1600) * 10 * zoomLevel}px`;
        eraElement.style.height = `${(era.end - era.start) * 10 * zoomLevel}px`;
        eraElement.style.backgroundColor = era.color;
        eraElement.style.width = '80%';
        eraElement.style.position = 'absolute';
        eraElement.innerText = `${era.name} (${era.start}-${era.end})`;
        eraContainer.appendChild(eraElement);
    });
}

function renderTimeline2() {
    const timeline = document.getElementById('ancient-timeline');
    const eraContainer = document.getElementById('ancient-eras');
    timeline.innerHTML = '';
    eraContainer.innerHTML = '';

    const filteredEvents = events.filter(event => event.year < 500);

    for (let year = -400; year <= -300; year += 50) {
        const yearLabel = document.createElement('div');
        yearLabel.classList.add('year-label');
        yearLabel.style.top = `${(year + 400) * 10 * zoomLevel}px`;
        yearLabel.innerText = year;
        timeline.appendChild(yearLabel);
    }

    let occupiedPositions = [];

    filteredEvents.sort((a, b) => b.priority - a.priority);

    filteredEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.style.top = `${(event.year + 400) * 10 * zoomLevel}px`;

        let leftOffset = 20;
        let eventTop = (event.year - 300) * 10 * zoomLevel;
        let maxOffset = 500;
        let spacing = 70;

        while (occupiedPositions.some(pos => Math.abs(pos.top - eventTop) < spacing && pos.left === leftOffset) && leftOffset < maxOffset) {
            leftOffset += 300;
        }

        if (leftOffset < maxOffset || zoomLevel > 1.5) {
            occupiedPositions.push({ top: eventTop, left: leftOffset });
            eventElement.style.left = `${leftOffset}px`;
            eventElement.innerHTML = `<strong>${event.year}</strong><br>${zoomLevel > 5 ? event.long : event.short}`;
            
            eventElement.addEventListener('mouseover', () => {
                eventElement.innerHTML = `<strong>${event.year}</strong><br>${event.long}`;
            });
            
            eventElement.addEventListener('mouseout', () => {
                eventElement.innerHTML = `<strong>${event.year}</strong><br>${zoomLevel > 5 ? event.long : event.short}`;
            });
            
            eventElement.addEventListener('click', () => {
                showModal(event);
            });
            
            timeline.appendChild(eventElement);
        }
        const startYear = -400;
        const endYear = -300;
        const totalYears = endYear - startYear;
        const dynamicHeight = totalYears * 10.1 * zoomLevel;

        timeline.style.height = `${dynamicHeight}px`;
        eraContainer.style.height = `${dynamicHeight}px`;
    });

    const eras = [
        { name: "Ancient (BCE)", start: -400, end: -300, color: "#cccccc" }
    ];

    eras.forEach(era => {
        const eraElement = document.createElement('div');
        eraElement.classList.add('era');
        eraElement.style.top = `${(era.start + 400) * 10 * zoomLevel}px`;
        eraElement.style.height = `${(era.end - era.start) * 10 * zoomLevel}px`;
        eraElement.style.backgroundColor = era.color;
        eraElement.style.width = '80%';
        eraElement.style.position = 'absolute';
        eraElement.innerText = `${era.name} (${era.start}-${era.end})`;
        eraContainer.appendChild(eraElement);
    });
}

function animateZoom() {
    if (Math.abs(zoomLevel - zoomTarget) > 0.01) {
        zoomLevel += (zoomTarget - zoomLevel) * 0.2;
        renderTimeline();
        requestAnimationFrame(animateZoom);
    }
}

function zoomIn() {
    zoomTarget = Math.min(zoomTarget * 1.2, maxZoom);
    animateZoom();
}

function zoomOut() {
    zoomTarget = Math.max(zoomTarget / 1.2, minZoom);
    animateZoom();
}

const zoomSlider = document.createElement('input');
zoomSlider.type = 'range';
zoomSlider.min = minZoom;
zoomSlider.max = maxZoom;
zoomSlider.step = zoomStep;
zoomSlider.value = zoomLevel;
zoomSlider.style.position = 'fixed';
zoomSlider.style.bottom = '20px';
zoomSlider.style.left = '50%';
zoomSlider.style.transform = 'translateX(-50%)';
zoomSlider.addEventListener('input', (e) => {
    zoomTarget = parseFloat(e.target.value);
    animateZoom();
});
document.body.appendChild(zoomSlider);

document.getElementById("show-ancient").addEventListener("click", function(event) {
    const timeline = document.querySelector(".ancient-timeline");
    if (timeline.style.display === "none" || timeline.style.display === "") {
        document.querySelector(".ancient-timeline").style.display = "block";
        this.textContent = "Hide Ancient Timeline";
    } else {
        document.querySelector(".ancient-timeline").style.display = "none";
        this.textContent = "Display Ancient Timeline";
    }
});

initializePage();