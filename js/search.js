$(document).ready(function () {
  const key = "api_key=80225fbb01c8c984e45fbc97dbc1e208";
  const Movie_url = "https://api.themoviedb.org/3";
  const Poster_url = "https://image.tmdb.org/t/p/original";
  $("input").keydown((e) => {
    // 監聽是否按到Enter鍵，Enter keycode = 13
    if (e.which === 13) {
      // 值要放在事件中才能抓到
      const SearchValue = $("input").val();
      // 判斷是否為空的
      if (SearchValue !== "") {
        Search(SearchValue);
      }
    }
  });

  function Search(SearchValue) {
    let RunView = "";
    const Search_url =
      Movie_url + "/search/movie?" + key + "&query=" + SearchValue;
    $(".swiper").remove();
    $(".ChangePage").remove();
    fetch(Search_url)
      .then((res) => res.json())
      .then((data) => {
        $.each(data.results, (index, movieData) => {
          const TW_url =
            Movie_url + `/movie/${movieData.id}/translations?` + key;
          fetch(TW_url)
            .then((res) => res.json())
            .then((data) => {
              $.each(data.translations, (index, movie_TW) => {
                if (
                  movie_TW.iso_639_1 === "zh" &&
                  movie_TW.iso_3166_1 === "TW"
                ) {
                  if (movie_TW.data.title.includes(SearchValue)) {
                    RunView += `
                      <div class="d-flex flex-column mb-3 movie_content">
                        <div class="movie_poster">
                          <img class="" src="${
                            Poster_url + movieData.poster_path
                          }">
                        </div>
                        <div class="d-flex justify-content-center movie_info">
                          <h4 class="fs-6 title">${movie_TW.data.title}</h4>
                        </div>
                      </div> 
                    `;
                    $(".movie_container").html(RunView);
                  }
                }
              });
            });
        });
      });
  }
});
