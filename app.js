document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:8000/api/v1/';
    const TITLES_ENDPOINT = API_BASE_URL + 'titles/';

    const BEST_MOVIE_SECTION = document.getElementById('best-movie');
    const TOP_RATED_SECTION = document.getElementById('top-rated');

    const CATEGORY_SECTIONS = [
        { id: 'category1', element: document.getElementById('category1'), genre: 'History', title: "Histoire" },
        { id: 'category2', element: document.getElementById('category2'), genre: 'Documentary', title: "Documentaire" },
        { id: 'category3', element: document.getElementById('category3'), genre: 'Sci-Fi', title: "Sci-Fi" },
        { id: 'category4', element: document.getElementById('category4'), genre: 'Action', title: "Action" },
        { id: 'category5', element: document.getElementById('category5'), genre: 'Sport', title: "Sport" },
    ];

    let categoryPages = {
        'top-rated': 1,
        'category1': 1,
        'category2': 1,
        'category3': 1,
        'category4': 1,
        'category5': 1,
    };

    fetch(TITLES_ENDPOINT + '?sort_by=-imdb_score&limit=1')
        .then(response => response.json())
        .then(data => {
            displayMovie(BEST_MOVIE_SECTION, data.results[0]);
        });

    fetchMoviesByGenre(null, TOP_RATED_SECTION, categoryPages['top-rated']);

    TOP_RATED_SECTION.querySelector('.left-arrow').addEventListener('click', () => {
        if (categoryPages['top-rated'] > 1) {
            categoryPages['top-rated']--;
            fetchMoviesByGenre(null, TOP_RATED_SECTION, categoryPages['top-rated']);
        }
    });

    TOP_RATED_SECTION.querySelector('.right-arrow').addEventListener('click', () => {
        if (categoryPages['top-rated'] < 2) {  // The check is for page 2, because we know there are only 7 top rated movies.
            categoryPages['top-rated']++;
            fetchMoviesByGenre(null, TOP_RATED_SECTION, categoryPages['top-rated']);
        }
    });

    CATEGORY_SECTIONS.forEach((section, index) => {
        fetchMoviesByGenre(section.genre, section.element, categoryPages[section.id]);

        section.element.querySelector('h2').innerText = section.title;

        section.element.querySelector('.left-arrow').addEventListener('click', () => {
            if (categoryPages[section.id] > 1) {
                categoryPages[section.id]--;
                fetchMoviesByGenre(section.genre, section.element, categoryPages[section.id]);
            }
        });

        section.element.querySelector('.right-arrow').addEventListener('click', () => {
            if (categoryPages[section.id] < 2) {
                categoryPages[section.id]++;
                fetchMoviesByGenre(section.genre, section.element, categoryPages[section.id]);
            }
        });
    });

    function fetchMoviesByGenre(genre, section, page = 1) {
        let url = genre ? 
            TITLES_ENDPOINT + `?genre_contains=${genre}&page_size=7` : 
            TITLES_ENDPOINT + `?sort_by=-imdb_score&page_size=7`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                while (section.querySelector('.movies').children.length > 0) {
                    section.querySelector('.movies').removeChild(section.querySelector('.movies').lastChild);
                }
                data.results.forEach((movie, index) => displayMovie(section.querySelector('.movies'), movie, index, page));
            });
    }

    function displayMovie(section, movie, index = 0, page = 1) {
        let startIndex = (page - 1) * 4;
        let endIndex = startIndex + 4;
        if (index >= startIndex && index < endIndex) {
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