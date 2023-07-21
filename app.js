document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:8000/api/v1/';
    const TITLES_ENDPOINT = API_BASE_URL + 'titles/';

    const BEST_MOVIE_SECTION = document.getElementById('best-movie');
    const TOP_RATED_SECTION = document.getElementById('top-rated');

    const CATEGORY_SECTIONS = [
        { element: document.getElementById('category1'), genre: 'History', title: "Histoire" },
        { element: document.getElementById('category2'), genre: 'Documentary', title: "Documentaire" },
        { element: document.getElementById('category3'), genre: 'Sci-Fi', title: "Sci-Fi" },
        { element: document.getElementById('category4'), genre: 'Action', title: "Action" },
        { element: document.getElementById('category5'), genre: 'Sport', title: "Sport" },
    ];

    let categoryPages = [1, 1, 1, 1, 1];

    fetch(TITLES_ENDPOINT + '?sort_by=-imdb_score&limit=1')
        .then(response => response.json())
        .then(data => {
            displayMovie(BEST_MOVIE_SECTION, data.results[0]);
        });

    fetch(TITLES_ENDPOINT + '?sort_by=-imdb_score&limit=7')
        .then(response => response.json())
        .then(data => {
            data.results.slice(1).forEach(movie => displayMovie(TOP_RATED_SECTION, movie));
        });

    CATEGORY_SECTIONS.forEach((section, index) => {
        fetchMoviesByGenre(section.genre, section.element, categoryPages[index]);

        section.element.querySelector('h2').innerText = section.title;

        section.element.querySelector('.left-arrow').addEventListener('click', () => {
            if (categoryPages[index] > 1) {
                categoryPages[index]--;
                fetchMoviesByGenre(section.genre, section.element, categoryPages[index]);
            }
        });

        section.element.querySelector('.right-arrow').addEventListener('click', () => {
            categoryPages[index]++;
            fetchMoviesByGenre(section.genre, section.element, categoryPages[index]);
        });
    });

    function fetchMoviesByGenre(genre, section, page = 1) {
        fetch(TITLES_ENDPOINT + `?genre_contains=${genre}&page_size=5&page=${page}`)
            .then(response => response.json())
            .then(data => {
                while (section.querySelector('.movies').children.length > 0) {
                    section.querySelector('.movies').removeChild(section.querySelector('.movies').lastChild);
                }
                data.results.forEach(movie => displayMovie(section.querySelector('.movies'), movie));
            });
    }

    function displayMovie(section, movie) {
        let movieElement = document.createElement('div');
        movieElement.className = 'movie';
        movieElement.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="${movie.image_url}" alt="Affiche de ${movie.title}">
        `;
        section.appendChild(movieElement);
        movieElement.addEventListener('click', function() {
            displayMovieDetails(movie.id);
        });
    }

    function displayMovieDetails(movieId) {
        fetch(TITLES_ENDPOINT + movieId)
            .then(response => response.json())
            .then(data => {
                let modal = document.getElementById('modal');
                let modalContent = modal.querySelector('.modal-content');

                modalContent.innerHTML = `
                    <img src="${data.image_url}" alt="Affiche de ${data.title}">
                    <h3>${data.title}</h3>
                    <p>Genre : ${data.genres}</p>
                    <p>Date de sortie : ${data.dates_published}</p>
                    <p>Rated : ${data.rated}</p>
                    <p>Score IMDB : ${data.imdb_score}</p>
                    <p>Réalisateur : ${data.directors}</p>
                    <p>Acteurs : ${data.actors.join(', ')}</p>
                    <p>Durée : ${data.duration} minutes</p>
                    <p>Pays d'origine : ${data.countries}</p>
                    <p>Résultat au Box Office : ${data.box_office}</p>
                    <p>Résumé : ${data.description}</p>
                `;
                modal.style.display = 'block';
                modal.addEventListener('click', function(event) {
                    if(event.target == modal) {
                        modal.style.display = 'none';
                    }
                });
            });
    }

    let modal = document.getElementById('modal');
    let closeButton = modal.querySelector('.close-button');

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    var headerElement = document.getElementById('header');

    headerElement.addEventListener('mouseover', function() {
        headerElement.style.opacity = '1';  // Visible
    });

    headerElement.addEventListener('mouseout', function() {
        headerElement.style.opacity = '0';  // Transparent
    });
});