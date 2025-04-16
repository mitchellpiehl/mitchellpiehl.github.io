let papers = [];
let resources = [];
let readings = [];
let events = [];

const SHEET_URL_PAPERS = "https://script.google.com/macros/s/AKfycbwqNXj4iMMebpXALpmfOYc-wwGZ7p7b5iKIFizMCcZHesB9VV78bSCg-uIdXHFhqio/exec";
const SHEET_URL_RESOURCES = "https://script.google.com/macros/s/AKfycby7npKo05jy-mtPzFl70hxs7PSjhenEUQIUrkIoxPUIpPTXorbaMqyC8QSUk7vxjmZqDQ/exec";
const SHEET_URL_READINGS = "https://script.google.com/macros/s/AKfycbwDp4Yzns7xZQGImgVTfGeGUKGY2NPV9PRAhgX-Wf2e7ohzklEUid-THwVM189uehKu3A/exec";
const SHEET_URL_EVENTS = "https://script.google.com/macros/s/AKfycbwg-gX4zaLv8YYkQApeD5YRRmxps3s1s3X3tqwpifwmCIpqVw74aQbgrNTFW9K-EnuD/exec";

function toggleSpinner(show = true) {
    const spinner = document.getElementById("spinner");
    if (spinner) {
        spinner.style.display = show ? "block" : "none";
    }
}

async function fetchWithCache(url, cacheKey, durationMinutes, transform) {
    const cacheTimestampKey = `${cacheKey}Timestamp`;
    const cacheDuration = 1000 * 60 * durationMinutes;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    const now = Date.now();

    if (cachedData && cachedTimestamp && (now - cachedTimestamp) < cacheDuration) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(url);
    const data = await response.json();
    const transformed = transform(data);

    localStorage.setItem(cacheKey, JSON.stringify(transformed));
    localStorage.setItem(cacheTimestampKey, now.toString());

    return transformed;
}

async function fetchAllData() {
    toggleSpinner(true);

    try {
        const [fetchedPapers, fetchedResources, fetchedReadings, fetchedEvents] = await Promise.all([
            fetchWithCache(SHEET_URL_PAPERS, "cachedPapers", 10, data =>
                data.map(p => ({
                    title: p.Title,
                    description: p.Description,
                    author: p.Author,
                    link: p.Link
                }))
            ),
            fetchWithCache(SHEET_URL_RESOURCES, "cachedResources", 10, data =>
                data.map(r => ({
                    title: r.Title,
                    description: r.Description,
                    link: r.Link,
                    linkName: r.LinkName
                }))
            ),
            fetchWithCache(SHEET_URL_READINGS, "cachedReadings", 10, data =>
                data.map(re => ({
                    title: re.Title,
                    author: re.Author,
                    published: re.Published,
                    description: re.Description,
                    link: re.Link
                }))
            ),
            fetchWithCache(SHEET_URL_EVENTS, "cachedEvents", 10, data =>
                data.map(event => ({
                    year: Number(event.Year),
                    short: event.Short,
                    long: event.Long,
                    description: event.Description,
                    image: event.Image || "",
                    link: event.Link || "",
                    priority: Number(event.Priority),
                    NeuralNets: Boolean(event.NeuralNets),
                    SymbolicAI: Boolean(event.SymbolicAI),
                    GenerativeAI: Boolean(event.GenerativeAI),
                    NLP: Boolean(event.NLP),
                    ImageProcessing: Boolean(event.ImageProcessing),
                    FoundationalIssues: Boolean(event.FoundationalIssues),
                    Milestones: Boolean(event.Milestones),
                    TechnologicalAdvancements: Boolean(event.TechnologicalAdvancements),
                    Hardware: Boolean(event.Hardware)
                }))
            )
        ]);

        papers = fetchedPapers;
        resources = fetchedResources;
        readings = fetchedReadings;
        events = fetchedEvents;

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        toggleSpinner(false);
    }
}


function toggleMobileMenu() {
    var nav = document.getElementById("main-nav");
    nav.classList.toggle("show-mobile");
}