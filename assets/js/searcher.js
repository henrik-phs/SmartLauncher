var movieSearhs = [];

function searcher() {
    var searchInput = $("#search-input").val().toLowerCase();

    if (searchInput.length >= 3) {
        // const regex = new RegExp(searchInput, "i");
        // var resultado = apps.filter(item => regex.test(item));
        // var resultado = apps.filter(item => item.toLowerCase().includes(searchInput.toLowerCase()));
        var resultado = Object.entries(apps).filter(([chave, app]) => app.nome.toLowerCase().includes(searchInput));
        var resultadoFormatado = resultado.map(([chave, app]) => ({ chave, ...app }));

        console.log(resultadoFormatado);

        if (resultadoFormatado.length > 0) {
            $("#results_apps").show();
            $("#results_apps").html("");

            resultadoFormatado.forEach((i) => {
                $("#results_apps").append(`
            <div class="col-2">
                <div class="card_app">
                    <img src="assets/imgs/logos/${i.imagem}" class="card-img-top" alt="${i.nome}"><br>
                    <span>${i.nome}</span>
                </div>
            </div>
        `);
            });
        } else {
            $("#results_apps").hide();
        }

        searchMoviesAndTvs(searchInput);
    } else {
        $("#results_apps").hide();
    }
}

function searchMoviesAndTvs(search) {
    var settings = {
        "url": "https://api.themoviedb.org/3/search/movie?query=" + search + "&include_adult=false&language=pt-BR&page=1&sort_by=popularity.desc&api_key=" + api_key,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        movieSearhs = response;
        console.log(response);
        let results = 0;

        $("#results_movies_tv").show();
        $("#results_movies_tv").html("");

        response.results.forEach((i) => {
            console.log(i);
            if (i.poster_path) {
                $("#results_movies_tv").append(`
                <div class="col-2" style="margin-bottom: 20px;">
                <img src="https://image.tmdb.org/t/p/original` + i.poster_path + `" width="100%" alt="" onclick="searchInfo(${results},` + i.id + `)" data-bs-toggle="modal" data-bs-target="#exampleModal">
            </div>
            `);
            }
            results++;
        });
    });

}

async function searchInfo(arrayId, filmeId) {
    $("#modal-movie-title").html(movieSearhs.results[arrayId].title);
    $("#modal-movie-description").html(movieSearhs.results[arrayId].overview);
    $("#modal-movie-poster2").attr("src", "https://image.tmdb.org/t/p/w500" + movieSearhs.results[arrayId].poster_path);

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
    $("#modal-movie-providers2").html("");

    if (!prov) {
        $("#modal-movie-providers2").append("<p>Não encontrado</p>");
    } else if (prov) {
        $("#modal-movie-providers2").append("<a href='" + prov.link + "' target='_blank'>" + prov.link + "</a>");
        if (prov.flatrate && prov.flatrate.length > 0) {
            $("#modal-movie-providers2").append("<p>Assinatura</p>");
            prov.flatrate.forEach(provider => {
                // $("#modal-movie-providers").append("<p>" + provider.provider_name + "</p>");
                $("#modal-movie-providers2").append("<img class='img-provider' src='https://image.tmdb.org/t/p/original" + provider.logo_path + "' width='50px' />");
            });
        }
        if (prov.rent && prov.rent.length > 0) {

            $("#modal-movie-providers2").append("<p>Alugar</p>");
            prov.rent.forEach(provider => {
                // $("#modal-movie-providers").append("<p>" + provider.provider_name + "</p>");
                $("#modal-movie-providers2").append("<img class='img-provider' src='https://image.tmdb.org/t/p/original" + provider.logo_path + "' width='50px' />");
            });
        }
        if (prov.buy && prov.buy.length > 0) {

            $("#modal-movie-providers2").append("<p>Comprar</p>");
            prov.buy.forEach(provider => {
                // $("#modal-movie-providers").append("<p>" + provider.provider_name + "</p>");
                $("#modal-movie-providers2").append("<img class='img-provider' src='https://image.tmdb.org/t/p/original" + provider.logo_path + "' width='50px' />");
            });
        }
    } else {
        $("#modal-movie-providers2").append("<p>Não encontrado</p>");
    }
}