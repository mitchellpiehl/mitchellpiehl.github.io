const SHEET_URL = "https://script.google.com/macros/s/AKfycbzqEsS2rVG_ZQMWCUnYndZPZF6h2vSlnBUzuDh2o2QmHhw8SRqRXdci9AQFUBNIUd0s/exec";
let allData = {};

async function fetchAllContent() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

    const cacheKey = "cachedContent";
    const cacheTimestampKey = "cachedContentTimestamp";
    //const cacheDuration = 1000 * 60 * 10; // 10 minutes
    const cacheDuration = 1000 * 6;

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    const now = Date.now();

    if (cachedData && cachedTimestamp && (now - cachedTimestamp) < cacheDuration) {
        allData = JSON.parse(cachedData);
        spinner.style.display = "none";
        return;
    }

    try {
        const response = await fetch(SHEET_URL);
        allData = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(allData));
        localStorage.setItem(cacheTimestampKey, now.toString());
    } catch (error) {
        console.error("Error fetching content:", error);
    } finally {
        spinner.style.display = "none";
    }
}
