$(document).ready(function () {
  const key = "api_key=80225fbb01c8c984e45fbc97dbc1e208";
  const Movie_url = "https://api.themoviedb.org/3";
  const Poster_url = "https://image.tmdb.org/t/p/original";
  
  let Home_count = 1;
  HomePage(Home_count);
  
  $(".Home").click((e) => {
    e.stopPropagation();
    const SwiperBox = ` 
        <div class="swiper mySwiper">
          <div class="swiper-wrapper bg-transparent w-100 d-flex">
          </div>
        </div>
      `;
    $(".movie_Box").prepend(SwiperBox); // 將元素插在所選的元素前面
    if($('.ChangePage').length === 0){
      const changeButton = `
        <div class="d-flex justify-content-center w-100 ChangePage">
          <button type="button" class="btn up">上一頁</button>
          <p class="d-flex flex-wrap justify-content-center align-content-center page"></p>
          <button type="button" class="btn down">下一頁</button>
        </div>
      `
      $(".movie_Box").append(changeButton)
      $(".page").html(Home_count)
    }
    HomePage();
  });

  $(".Now").click((e) => {
    e.stopPropagation();
    const NowPlay_url = "/movie/now_playing?language=en-USS&";
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
    OtherPage(NowPlay_url);
  });
  $(".Popular").click((e) => {
    e.stopPropagation();
    const Popular_url = "/movie/popular?language=en-US&";
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
    OtherPage(Popular_url);
  });
  $(".Rate").click((e) => {
    e.stopPropagation();
    const TopRated_url = "/movie/top_rated?language=en-US&";
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
    OtherPage(TopRated_url);
  });

  
  function OtherPage(url) {
    let count = 1;
    FetchMovie(url,count)
    $(".swiper").remove();
      if (count === "1") {
        $(".up").click((e) => {
          e.stopPropagation();
          // 添加捲動軸至頂動畫
          $("html , body").animate({
            scrollTop: 0
          },0);
        });
      } else {
        $(".up").click((e) => {
          e.stopPropagation();
          // 添加捲動軸至頂動畫
          $("html , body").animate({
            scrollTop: 0
          },0);
          count -= 1;
          FetchMovie(url,count)
        });
      }
      $(".down").off('click').click((e) => {
        e.stopPropagation();
        // 添加捲動軸至頂動畫
        $("html , body").animate({
          scrollTop: 0
        },0);
        count += 1;
        FetchMovie(url,count)
      });
  }

  async function FetchMovie(url,count){
    await fetch(Movie_url + url + key + "&page=" + count)
    .then((res) => res.json())
    .then((data) => {
      let MovieContent = "";
      $.each(data.results, (index, movie) => {
        // 要有電影海報才執行
        fetch(Movie_url+`/movie/${movie.id}/translations?`+key).then(res=>res.json()).then(ID_Data=>{
          $.each(ID_Data.translations,(index,ID)=>{
            if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
              if(movie.poster_path){
                if(ID.data.title){
                  MovieContent += `
                    <div class="d-flex flex-column mb-3 movie_content">
                      <div class="movie_poster">
                        <img class="" src="${Poster_url + movie.poster_path}">
                      </div>
                      <div class="d-flex justify-content-center movie_info">
                        <h4 class="fs-6 title">${ID.data.title}</h4>
                      </div>
                    </div>      
                  `;
                  $(".movie_container").html(MovieContent);
                  $(".page").html(count)
                }
              }
            }
          })
        })
      });
    });
  }

  function clickPage(){
    const changeButton = `
      <div class="d-flex justify-content-center w-100 ChangePage">
        <button type="button" class="btn up">上一頁</button>
        <p class="d-flex flex-wrap justify-content-center align-content-center page"></p>
        <button type="button" class="btn down">下一頁</button>
      </div>
    `
    $(".movie_Box").append(changeButton)
    $(".page").html(Home_count)
  }
  async function HomePage(Home_count) {
    // 當button重新放入時，由於Home_count是在外部被宣告的，所以導致這裡進來的Home_count會是undefined
    if(Home_count === undefined){
      Home_count = 1;
    }
    const Home_url ="/discover/movie?include_adult=false&include_video=false&language=en-US.desc&page=" + Home_count + "&";
    SwiperBox();
    await fetch(Movie_url + Home_url + key)
      .then((res) => res.json())
      .then((Data) => {
        // 判定是否還能抓到資料，如果不行就是undefined
        if (Data.results === undefined) {
          count = 1;
          HomePage(Home_count);
          return;
        }
        let MovieContent = "";
        $.each(Data.results, (index, movie) => {
          if(movie){
            // 抓取電影的翻譯名稱
            fetch(Movie_url+`/movie/${movie.id}/translations?`+key).then(res=>res.json()).then(ID_Data=>{
              $.each(ID_Data.translations,(index,ID)=>{
                // 使用資料中電影的語言分類，抓到翻譯後的名稱
                if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
                  // 要有電影海報才執行
                  if(movie.poster_path){
                    if(ID.data.title){
                      MovieContent += `
                        <div class="d-flex flex-column mb-3 movie_content">
                          <div class="movie_poster">
                            <img class="" src="${Poster_url + movie.poster_path}">
                          </div>
                          <div class="d-flex justify-content-center movie_info">
                            <h4 class="fs-6 title">${ID.data.title}</h4>
                          </div>
                        </div>      
                      `;
                      $(".movie_container").html(MovieContent);
                    }
                  }
                }
              })
            })
          }
        });
        $('.page').html(Home_count)
        HomePageControl(Home_count);
      });
    function HomePageControl(Home_count) {
      if(Home_count === 1){
        $(".up").click((e)=>{
          e.stopPropagation()
          $("html,body").animate({
            scrollTop:0
          })
        })
      }else{
        $(".up").click((e)=>{
          e.stopPropagation()
          $("html,body").animate({
            scrollTop:0
          })
          Home_count --
          HomePage(Home_count)
        })
      }
      $(".down").off("click").click((e)=>{
        e.stopPropagation()
        $("html,body").animate({
          scrollTop:0
        })
        Home_count ++
        HomePage(Home_count)
      })
    }
  }

  // 製造Swiper中的內容
  async function SwiperBox() {
    const TopPopular_url = "/movie/popular?language=en-US&";
    await fetch(Movie_url + TopPopular_url + key)
      .then((res) => res.json())
      .then((data) => {
        const TopFiveMovie = data.results;
        SwiperView(TopFiveMovie)
      });
  }
  // 
  async function SwiperView(TopFiveMovie){
    let SwiperContainer = "";
    for (let i = 0; i < 5; i++) {
      // 會先完成抓取的部分
      await fetch(Movie_url+`/movie/${TopFiveMovie[i].id}/translations?`+key).then(res=>res.json()).then(ID_Data=>{
        $.each(ID_Data.translations,(index,movie)=>{
          if(movie.iso_639_1 === "zh" && movie.iso_3166_1 === "TW"){
            SwiperContainer += `
              <div class="swiper-slide" style=background-image:url(${
                Poster_url + TopFiveMovie[i].backdrop_path
              })>
                  <div class="black">
                      <h2>${movie.data.title}</h2>
                      <h4>${TopFiveMovie[i].original_title}</h4>
                      <span>${TopFiveMovie[i].release_date}</span>
                      <p>${movie.data.overview}</p>
                  </div>
              </div> 
            `;
            $(".swiper-wrapper").html(SwiperContainer);
          }
        })
      })
    }
    // 再進行初始化
    initSwiper()
  }

  function initSwiper(){
    // Swiper JS
    // 要放在抓取電影內容的API後面才能進行初始化
    const mySwiper = new Swiper(".mySwiper", {
      dynamicBullets: true,
      loop: true,
      autoplay: {
        delay: 1000,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }

});

