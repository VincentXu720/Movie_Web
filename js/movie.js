$(document).ready(function () {
  const key = "api_key=80225fbb01c8c984e45fbc97dbc1e208"
  const Movie_url = "https://api.themoviedb.org/3";
  const Poster_url = "https://image.tmdb.org/t/p/original";
  
  let Home_count = 1;
  HomePage(Home_count);
  
  $(".Home").click((e) => {
    e.stopPropagation();
    const SwiperContainer = ` 
        <div class="swiper mySwiper">
          <div class="swiper-wrapper bg-transparent w-100 d-flex">
          </div>
        </div>
      `;
    $(".movie_Box").prepend(SwiperContainer); // 將元素插在所選的元素前面
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

  // 處理導覽列電影 Container 內容
  async function FetchMovie(url,count){
    let MovieContent = "";
    // 讀取 Movie 資料
    const MovieContainer = await $.ajax({
      url: Movie_url + url + key + "&page=" + count,
      method:"GET",
      dataType:"JSON",
      success:function(res){
        return res
      },
      error:function(error){
        console.log(error)
      }
    })
    // 把資料按照Json中的順序放到TranslateMovie()裡
    // 防止電影的位置改變
    for( const movie of MovieContainer.results){
      await TranslateMovie(movie,count)
    }
    $(".movie_container").html(MovieContent);
    $(".page").html(count)
    
    // 讀取 Movie Translate 的資料
    async function TranslateMovie(movie,count){
      const MovieTranslate = await $.ajax({ 
        url: Movie_url+`/movie/${movie.id}/translations?`+key,
        method:"GET",
        dataType:"JSON",
        success:function(res){
          return res
        },
        error:function(error){
          console.log(error)
        }
      })
      // 配對兩筆資料並把資料放到MovieContent變數裡
      $.each(MovieTranslate.translations,(index,ID)=>{
        if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
          if(movie.poster_path && ID.data.title){
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
          }
        }
      })
    }
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
    let MovieContent = "";
    SwiperBox();
    // 當button重新放入時，由於Home_count是在外部被宣告的，所以導致這裡進來的Home_count會是undefined
    if(Home_count === undefined){
      Home_count = 1;
    }
    const Home_url ="/discover/movie?include_adult=false&include_video=false&language=en-US.desc&page=" + Home_count + "&";
    const getMovie = await $.ajax({
      url:Movie_url + Home_url + key,
      method:"GET",
      dataType:"JSON",
      success:function(res){
        if(res.results === undefined){
          count = 1;
          HomePage(Home_count);
          return res;
        }

      }
    })
    for(const movie of getMovie.results){
      await TranslateMovie(movie)
    }
    $(".movie_container").html(MovieContent);
    async function TranslateMovie(movie){
      const translate = await $.ajax({
        url:Movie_url+`/movie/${movie.id}/translations?`+key,
        method:"GET",
        dataType:"JSON",
        success:function(res){
          return res
        }
      })
      $.each(translate.translations,(index,ID)=>{
        if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
          if(movie.poster_path && ID.data.title){
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
          }
        }
      })
    }
    $('.page').html(Home_count)
    HomePageControl(Home_count);
    function HomePageControl(Home_count) {
      if(Home_count === 1){
        $(".up").click(async (e)=>{
          e.stopPropagation()
          $("html,body").animate({
            scrollTop:0
          })
        })
      }else{
        $(".up").click(async(e)=>{
          e.stopPropagation()
          await $("html,body").animate({
            scrollTop:0
          })
          Home_count --
          HomePage(Home_count)
        })
      }
      $(".down").off("click").click(async(e)=>{
        e.stopPropagation()
        await $("html,body").animate({
          scrollTop:0
        })
        Home_count ++
        HomePage(Home_count)
      })
    }
  }

  // 製造Swiper中的內容
  async function SwiperBox() {
    let SwiperContainer = "";
    let TopFive = [];
    const TopPopular_url = "/movie/popular?language=en-US&";
    const Movie = await $.ajax({
      url:Movie_url + TopPopular_url + key,
      method:"GET",
      dataType:"JSON",
      success:function(res){
        return res
      },
      error:function(err){
        console.log(err)
      }
    })
    for(let i=0;i<5;i++){
      TopFive.push(Movie.results[i])
    }
    for(let movie of TopFive){
      await SwiperView(movie)
    }
    // 再進行初始化
    initSwiper()

    async function SwiperView(movie){
      const MovieTranslate = await $.ajax({
        url:Movie_url+`/movie/${movie.id}/translations?`+key,
        method:"GET",
        dataType:"JSON",
        success:function(res){
          return res
        },
        error:function(err){
          console.log(err)
        }
      })
      $.each(MovieTranslate.translations,(index,ID)=>{
        if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
          SwiperContainer += `
            <div class="swiper-slide" style=background-image:url(${Poster_url + movie.backdrop_path})>
                <div class="black">
                    <h2>${ID.data.title}</h2>
                    <h4>${movie.original_title}</h4>
                    <span>${movie.release_date}</span>
                    <p>${ID.data.overview}</p>
                </div>
            </div> 
          `;
        }
        $(".swiper-wrapper").html(SwiperContainer);
      })
    }
  }
  async function initSwiper(){
    console.log('yes')
    // Swiper JS
    // 要放在抓取電影內容的API後面才能進行初始化
    const mySwiper = new Swiper(".mySwiper", {
      dynamicBullets: true,
      loop:true,
      autoplay: {
        delay: 1000,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }
});

