// Clave de la API de TMDb
const apiKey = "d700f84a51f037e35be6168fa6bb7604";

// URL base para las imágenes de las películas
const imgApi = "https://image.tmdb.org/t/p/w1280";

// URL base para la búsqueda de películas
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// Elementos del DOM
const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");

// Variables de estado
let page = 1;
let isSearching = false;

// Función para obtener datos de la API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

// Función para obtener y mostrar resultados basados en la URL
async function fetchAndShowResult(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
    }
}

// Función para crear una tarjeta de película
function createMovieCard(movie) {
    const { poster_path, original_title, release_date, overview } = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
    const formattedDate = release_date || "No release date";
    const cardTemplate = `
    <div class="column"> 
        <div class="card">
            <a class="card-media" href="./img-01.jpeg">
                <img src="${imagePath}" alt="${original_title}" width="100%" />
            </a>
            <div class="card-content">
                <div class="card-header">
                    <div class="left-content">
                        <h3 style="font-weight: 600">${truncatedTitle}</h3>
                        <span style="color: #12efec">${formattedDate}</span>
                    </div>
                    <div class="right-content">
                        <a href="${imagePath}" target="_blank" class="card-btn">Ver Portada</a>
                    </div>
                </div>
                <div class="info">
                    ${overview || "No hay descripción disponible..."}
                </div>
            </div>
        </div>
    </div>
    `;
    return cardTemplate;
}

// Función para limpiar los resultados anteriores
function clearResults() {
    result.innerHTML = "";
}

// Función para mostrar los resultados en la página
function showResults(items) {
    const newContent = items.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p>No se encontraron resultados</p>";
}

// Función para cargar más resultados
async function loadMoreResults() {
    if (isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShowResult(url);
}

// Función para detectar el final de la página y cargar más resultados
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

// Función para manejar la búsqueda
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if (searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResult(newUrl);
        query.value = "";
    }
}

// Event listeners
form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

// Inicialización de la página
async function init() {
    clearResults();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResult(url);
}

init();