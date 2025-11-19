// document.addEventListener("keydown", function (e) {
//     switch (e.keyCode) {
//         case 37: // ← Left
//             console.log("Seta para esquerda");
//             break;
//         case 38: // ↑ Up
//             console.log("Seta para cima");
//             break;
//         case 39: // → Right
//             console.log("Seta para direita");
//             break;
//         case 40: // ↓ Down
//             console.log("Seta para baixo");
//             break;
//         case 13: // OK/Enter
//             console.log("Botão OK");
//             break;
//         case 10009: // RETURN (Back)
//             console.log("Botão Voltar");
//             break;
//         case 415: // PLAY
//             console.log("Botão Play");
//             break;
//         case 19: // PAUSE
//             console.log("Botão Pause");
//             break;
//         case 413: // STOP
//             console.log("Botão Stop");
//             break;
//         default:
//             console.log("Tecla pressionada: ", e.keyCode);
//             break;
//     }
// });

var movies = [];
var settings = {
    "url": "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc&api_key=" + api_key,
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    movies = response;
    if (response.results[0].backdrop_path) {
        // console.log(response);
        $(".header-content").css({
            "background-image": "url('https://image.tmdb.org/t/p/original" + response.results[0].backdrop_path + "')",
        });

        $("#movie-title").text(response.results[0].title);
        $("#movie-description").text(response.results[0].overview);
        // $("#btn-more").prop('onclick', "showModalBar('more-info');moreInfo(0, "+ response.results[0].id + ")")

        $("#btn-more").attr('data-array', "0");
        $("#btn-more").attr('data-filme', response.results[0].id);

        // `<button type="button" class="btn btn-secondary" id="btn-more"
        //             onclick="showModalBar('more-info');moreInfo(0, `+ response.results[0].id + `)" tabindex="201">
        //             Mais informações
        //         </button>`);

        var images = [];
        for (let i = 0; i < 10; i++) {
            // Pré-carrega a imagem antes de usá-la
            images[i] = 'https://image.tmdb.org/t/p/original' + response.results[i].backdrop_path;
            let preloadImg = new Image();
            preloadImg.src = images[i];
        }

        let i = 0;
        setInterval(() => {
            if (i >= response.results.length) i = 1;

            let img = new Image();
            img.onload = function () {
                $(".header-content").css({
                    "background-image": "url('" + images[i] + "')",
                    "background-size": "cover",
                    "background-position": "left top",
                    "background-repeat": "no-repeat"
                });

                $("#movie-title").text(response.results[i].title);
                let overview = response.results[i].overview;
                if (overview.length > 300) {
                    overview = overview.substring(0, 300) + '...';
                }
                $("#movie-description").text(overview);

                // $("#btn-more").prop('onclick', "showModalBar('more-info');moreInfo(" + i + ", " + response.results[i].id + ")");
                $("#btn-more").attr('data-array', i);
                $("#btn-more").attr('data-filme', response.results[i].id);
                // `<button type="button" class="btn btn-secondary" id="btn-more"
                //         onclick="showModalBar('more-info');moreInfo(${i}, ` + response.results[i].id + `)" tabindex="201">
                //         Mais informações
                //     </button>`);
            };
            img.src = "https://image.tmdb.org/t/p/original" + response.results[i].backdrop_path;

            i++;
            if (i > 10) i = 0;
        }, 15000);
    }
});

function handleKeyNavigation(event) {
    const total = appElements.length;

    switch (event.key) {
        case "ArrowRight":
            if (focusedIndex + 1 < total) focusedIndex++;
            break;
        case "ArrowLeft":
            if (focusedIndex - 1 >= 0) focusedIndex--;
            break;
        case "ArrowDown":
            if (focusedIndex + cols < total) focusedIndex += cols;
            break;
        case "ArrowUp":
            if (focusedIndex - cols >= 0) focusedIndex -= cols;
            break;
        case "Enter":
        case "OK":
            appElements[focusedIndex].click();
            break;
    }

    focusApp(focusedIndex);
}

// Função para formatar o horário (ex: 12:34:56)
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Adiciona 0 à esquerda se o número for menor que 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}`;
    // return `${hours}:${minutes}:${seconds}`;
}

// Função para formatar a data (ex: 18 de Dezembro de 2024)
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para atualizar a hora e a data na tela
function updateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const now = new Date();

    timeElement.textContent = formatTime(now);
    // dateElement.textContent = formatDate(now);
}

// Atualiza a hora a cada segundo
setInterval(updateTime, 1000);

// Exibe ou esconde a hora quando o botão for clicado
// const toggleButton = document.getElementById('toggle-time-btn');
const timeContainer = document.getElementById('time-container');
let isTimeVisible = true;

// toggleButton.addEventListener('click', () => {
//     isTimeVisible = !isTimeVisible;
//     timeContainer.style.display = isTimeVisible ? 'block' : 'none';
// });

// Função para iniciar o aplicativo
function showModalBar(id) {
    const searchBar = document.getElementById(id);
    searchBar.style.display = "block";
    searchBar.focus();

    $('#search-input').val(''); // Limpa o campo de busca
    $('#search-input').focus(); // Foca no campo de busca
    $('#search-input').trigger('input'); // Dispara o evento de input para atualizar os resultados

    if (id == 'search-bar') {
        focusedIndex = 3;
        focusedRow = 2;
        focused = focusableElements.find(el => parseInt(el.getAttribute("tabindex")) === 1002);

        if (focused) {
            focused.focus();
            console.log('Focado no elemento:', focused);
        } else {
            console.log('Elemento não encontrado para o tabindex:', tabIndexMatrix[focusedIndex][focusedRow]);
        }
    }
}

// Função para ocultar o aplicativo
function hideModalBar(id) {
    const searchBar = document.getElementById(id);
    searchBar.style.display = "none";
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        $(".modal-bar").hide('slow');
    }
});

$(document).on('click', '#btn-more', function (e) {
    e.preventDefault();
    console.log("Botão Mais Informações clicado");

    const arrayId = $(this).attr('data-array');
    const filmeId = $(this).attr('data-filme');

    showModalBar('more-info');
    moreInfo(arrayId, filmeId);
});

var providersList = [];

async function moreInfo(arrayId, filmeId) {
    console.log(arrayId, filmeId);
    $("#modal-movie-title-more").html(movies.results[arrayId].title);
    $("#modal-movie-description-more").html(movies.results[arrayId].overview);
    $("#modal-movie-poster").attr("src", "https://image.tmdb.org/t/p/w500" + movies.results[arrayId].poster_path);

    // Função providers não retorna uma Promise, então precisamos adaptá-la
    // Vamos criar uma função que retorna uma Promise para usar await
    function getProviders(filmeId) {
        return new Promise((resolve, reject) => {
            var settings = {
                "url": "https://api.themoviedb.org/3/movie/" + filmeId + "/watch/providers?watch_region=BR&api_key=" + api_key,
                "method": "GET",
                "timeout": 0,
            };
            $.ajax(settings).done(function (response) {
                resolve(response.results['BR']);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                resolve(undefined);
            });
        });
    }

    const prov = await getProviders(filmeId);
    $("#modal-movie-providers").html("");

    if (!prov) {
        $("#modal-movie-providers").append("<p>Não encontrado</p>");
    } else if (prov) {
        $("#modal-movie-providers").append("<a href='" + prov.link + "' target='_blank'>" + prov.link + "</a>");
        if (prov.flatrate && prov.flatrate.length > 0) {
            $("#modal-movie-providers").append("<p>Assinatura</p>");
            prov.flatrate.forEach(provider => {
                // $("#modal-movie-providers").append("<p>" + provider.provider_name + "</p>");
                $("#modal-movie-providers").append("<img class='img-provider' src='https://image.tmdb.org/t/p/original" + provider.logo_path + "' width='50px' />");
            });
        }
        if (prov.rent && prov.rent.length > 0) {

            $("#modal-movie-providers").append("<p>Alugar</p>");
            prov.rent.forEach(provider => {
                // $("#modal-movie-providers").append("<p>" + provider.provider_name + "</p>");
                $("#modal-movie-providers").append("<img class='img-provider' src='https://image.tmdb.org/t/p/original" + provider.logo_path + "' width='50px' />");
            });
        }
        if (prov.buy && prov.buy.length > 0) {

            $("#modal-movie-providers").append("<p>Comprar</p>");
            prov.buy.forEach(provider => {
                // $("#modal-movie-providers").append("<p>" + provider.provider_name + "</p>");
                $("#modal-movie-providers").append("<img class='img-provider' src='https://image.tmdb.org/t/p/original" + provider.logo_path + "' width='50px' />");
            });
        }
    } else {
        $("#modal-movie-providers").append("<p>Não encontrado</p>");
    }
}

function providers(filmeId) {
    var settings = {
        "url": "https://api.themoviedb.org/3/movie/" + filmeId + "/watch/providers?watch_region=BR&api_key=" + api_key,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        console.log(response.results['BR']);
        providersList = response.results['BR'];
        return providersList;
    });
}

document.addEventListener('keydown', function (event) {
    // O botão "Back" em TVs LG webOS geralmente é identificado como "Backspace" ou "BrowserBack"
    if (event.key === 'Backspace' || event.key === 'BrowserBack' || event.keyCode === 461) {
        // Fecha todos os modais com a classe .modal-bar
        $(".modal-bar").hide('slow');
        $("#exampleModal").hide('slow');
        // Evita o comportamento padrão do botão de voltar (como sair do app)
        event.preventDefault();
    }
});