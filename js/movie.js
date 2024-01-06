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
    HomePage();
  });

  $(".Now").click((e) => {
    e.stopPropagation();
    const NowPlay_url = "/movie/now_playing?language=en-USS&";
    OtherPage(NowPlay_url);
  });
  $(".Popular").click((e) => {
    e.stopPropagation();
    const Popular_url = "/movie/popular?language=en-US&";
    OtherPage(Popular_url);
  });
  $(".Rate").click((e) => {
    e.stopPropagation();
    const TopRated_url = "/movie/top_rated?language=en-US&";
    OtherPage(TopRated_url);
  });

  
  function OtherPage(url) {
    let count = 1;
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
      FetchMovie(url,count)
  }

  function FetchMovie(url,count){
    fetch(Movie_url + url + key + "&page=" + count)
    .then((res) => res.json())
    .then((data) => {
      let MovieContent = "";
      $.each(data.results, (index, content) => {
        if(content.poster_path){
          MovieContent += `
            <div class="d-flex flex-column mb-3 movie_content">
                <div class="movie_poster">
                    <img class="" src="${Poster_url + content.poster_path}">
                </div>
                <div class="d-flex justify-content-center movie_info">
                    <h4 class="fs-6 title">${content.title}</h4>
                </div>
            </div>
            `;
          $(".movie_container").html(MovieContent);
          $(".page").html(count)
        }
      });
    });
  }

  async function HomePage(Home_count) {
    const Home_url ="/discover/movie?include_adult=false&include_video=false&language=en-US.desc&page=" + Home_count + "&";
    SwiperBox();
    fetch(Movie_url + Home_url + key)
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
          if(movie.poster_path){
            MovieContent += `
              <div class="d-flex flex-column mb-3 movie_content">
                <div class="movie_poster">
                  <img class="" src="${Poster_url + movie.poster_path}">
                </div>
                <div class="d-flex justify-content-center movie_info">
                  <h4 class="fs-6 title">${movie.title}</h4>
                </div>
              </div>      
            `;
            $(".movie_container").html(MovieContent);
          }
        });
        HomePageControl();
      });
    function HomePageControl() {
      $(".page").html(Home_count);
      if (Home_count === "1") {
        $(".up").click((e) => {
          e.stopPropagation()
          // 添加捲動軸至頂動畫
          $("html , body").animate({
              scrollTop: 0
          },0);
        });
      } else {
        $(".up").click((e) => {
          e.stopPropagation()
          // 添加捲動軸至頂動畫
          $("html , body").animate({
              scrollTop: 0
            },0);
          Home_count -= 1;
          HomePage(Home_count);
        });
      }
      $(".down").click((e) => {
        e.stopPropagation()
        // 添加捲動軸至頂動畫
        $("html , body").animate({
            scrollTop: 0,
        },0);
        Home_count += 1;
        HomePage(Home_count);
      });
    }
  }

  // 製造Swiper中的內容
  async function SwiperBox() {
    let SwiperContainer = "";
    const TopPopular_url = "/movie/popular?language=en-US&";
    await fetch(Movie_url + TopPopular_url + key)
      .then((res) => res.json())
      .then((data) => {
        const TopFiveMovie = data.results;
        for (let i = 0; i < 5; i++) {
          SwiperContainer += `
                <div class="swiper-slide" style=background-image:url(${
                  Poster_url + TopFiveMovie[i].backdrop_path
                })>
                    <div class="black">
                        <h2>${TopFiveMovie[i].title}</h2>
                        <h4>${TopFiveMovie[i].original_title}</h4>
                        <span>${TopFiveMovie[i].release_date}</span>
                        <p>${TopFiveMovie[i].overview}</p>
                    </div>
                </div> 
            `;
        }
        $(".swiper-wrapper").html(SwiperContainer);
      });

    // Swiper JS
    // 要放在抓取電影內容的API後面才能進行初始化
    const mySwiper = await new Swiper(".mySwiper", {
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

