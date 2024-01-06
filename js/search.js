$(document).ready(function(){
  const key = "api_key=80225fbb01c8c984e45fbc97dbc1e208";
  const Movie_url = "https://api.themoviedb.org/3";
  const Poster_url = "https://image.tmdb.org/t/p/original";
  // Search
  $('input').keydown((e)=>{
    // 監聽是否按到Enter鍵，Enter keycode = 13
    if(e.which == 13){
      // 值要放在事件中才能抓到
      const SearchValue = $('input').val()
      // 判斷是否為空的
      if(SearchValue!==''){
        Search(SearchValue)
      }
    }
  })
  $('.search-button').click(()=>{
    // 值要放在事件中才能抓到 .val()可以抓取元素值
    const SearchValue = $('input').val()
    // 判斷是否為空的
    if(SearchValue!==''){
      Search(SearchValue)
    }
  })
  function Search (SearchValue){
    console.log(SearchValue)
    const Search_url = Movie_url + "/search/movie?"+key+"&query="+SearchValue;
    $(".swiper").remove();
    let SearchPage = '';
    fetch(Search_url).then(res=>res.json()).then(data=>{
      // const MovieData = data.results;
      $.each(data.results,(index,data)=>{
        if(data.poster_path){
          // 要有"+"才不會遍歷時被覆蓋過去
          SearchPage +=`
            <div class="d-flex flex-column mb-3 movie_content">
              <div class="movie_poster">
                  <img class="" src="${Poster_url + data.poster_path}">
              </div>
              <div class="d-flex justify-content-center movie_info">
                  <h4 class="fs-6 title">${data.title}</h4>
              </div>
            </div>
          `;
          $(".movie_container").html(SearchPage);
        }
      })
    })
  }
})