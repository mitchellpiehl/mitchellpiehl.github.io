async function initializePage() {
    await fetchAllData();
    renderTimeline();
}

const eras = [
    { name: "Deep Learning Boom", start: 2000, end: 2025, color: "#32CD32" }
];

const timeline = document.getElementById('timeline');
const eraContainer = document.getElementById('eras');


let zoomLevel = 6;
let zoomTarget = 1;
let zoomStep = 0.1;
let currentEventIndex = 0;
let yearSortedEvents = [];
const minZoom = 3;
const maxZoom = 12;

const modal = document.createElement('div');
modal.classList.add('modal');
modal.style.position = 'absolute';
modal.style.right = '5%';
modal.style.top = '300px';
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
        navigateEvent(-1)
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

document.getElementById('categoryFilter').addEventListener('change', renderTimeline);

function renderTimeline() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const timeline = document.getElementById('timeline');
    const eraContainer = document.getElementById('eras');
    timeline.innerHTML = '';
    eraContainer.innerHTML = '';

    let filteredEvents = events.filter(event => {
        if (selectedCategory === 'NeuralNets') return event.NeuralNets;
        if (selectedCategory === 'SymbolicAI') return event.SymbolicAI;
        if (selectedCategory === 'GenerativeAI') return event.GenerativeAI;
        if (selectedCategory === 'NLP') return event.NLP;
        if (selectedCategory === 'ImageProcessing') return event.ImageProcessing;
        if (selectedCategory === 'FoundationalIssues') return event.FoundationalIssues;
        if (selectedCategory === 'Milestones') return event.Milestones;
        if (selectedCategory === 'TechnologicalAdvancements') return event.TechnologicalAdvancements;
        if (selectedCategory === 'Hardware') return event.Hardware;
        return true;
    });
    yearSortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year);
    yearSortedEvents2 = [...yearSortedEvents].filter(event => event.year > 2000);

    eras.forEach(era => {
        const eraElement = document.createElement('div');
        eraElement.classList.add('era');
        eraElement.style.top = `${(era.start - 2000) * 10 * zoomLevel}px`;
        eraElement.style.height = `${(era.end - era.start) * 10 * zoomLevel}px`;
        eraElement.style.backgroundColor = era.color;
        eraElement.style.width = '80%';
        eraElement.style.position = 'absolute';
        eraElement.innerText = `${era.name} (${era.start}-${era.end})`;
        eraContainer.appendChild(eraElement);
    });

    for (let year = 2000; year <= 2025; year += 5) {
        const yearLabel = document.createElement('div');
        yearLabel.classList.add('year-label');
        yearLabel.style.top = `${(year - 2000) * 10 * zoomLevel}px`;
        yearLabel.innerText = year;
        timeline.appendChild(yearLabel);
    }

    filteredEvents = filteredEvents.filter(event => event.year > 2000);
    let occupiedPositions = [];
    filteredEvents.sort((a, b) => b.priority - a.priority);
    
    filteredEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.style.top = `${(event.year - 2000) * 10 * zoomLevel}px`;
        
        let leftOffset = 20;
        let eventTop = (event.year - 2000) * 10 * zoomLevel;
        let maxOffset = 400;
        let spacing = 70;
        
        while (occupiedPositions.some(pos => Math.abs(pos.top - eventTop) < spacing && pos.left === leftOffset) && leftOffset < maxOffset) {
            leftOffset += 300;
        }
        
        if (leftOffset < maxOffset || zoomLevel > 7) {
            occupiedPositions.push({ top: eventTop, left: leftOffset });
            eventElement.style.left = `${leftOffset}px`;
            eventElement.innerHTML = `<strong>${event.year}</strong><br>${zoomLevel > 7 ? event.long : event.short}`;
            
            eventElement.addEventListener('mouseover', () => {
                eventElement.innerHTML = `<strong>${event.year}</strong><br>${event.long}`;
            });
            
            eventElement.addEventListener('mouseout', () => {
                eventElement.innerHTML = `<strong>${event.year}</strong><br>${zoomLevel > 7 ? event.long : event.short}`;
            });
            
            eventElement.addEventListener('click', () => {
                showModal(event);
            });
            
            timeline.appendChild(eventElement);
        }
    });
    showModal(yearSortedEvents2[0]);
    const startYear = 2000;
    const endYear = 2030;
    const totalYears = endYear - startYear;
    const dynamicHeight = totalYears * 10.1 * zoomLevel;

    timeline.style.height = `${dynamicHeight}px`;
    eraContainer.style.height = `${dynamicHeight}px`;
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

initializePage();