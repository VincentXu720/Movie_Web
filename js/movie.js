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
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
    HomePage(Home_count);
  });

  $(".Now").click((e) => {
    e.stopPropagation();
    const NowPlay_url = "/movie/now_playing?language=en-USS&";
    OtherPage(NowPlay_url,Home_count);
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
  });

  $(".Popular").click((e) => {
    e.stopPropagation();
    const Popular_url = "/movie/popular?language=en-US&";
    OtherPage(Popular_url,Home_count);
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
  });

  $(".Rate").click((e) => {
    e.stopPropagation();
    const TopRated_url = "/movie/top_rated?language=en-US&";
    OtherPage(TopRated_url,Home_count);
    if($(".ChangePage").length === 0){
      clickPage(Home_count)
    }
  });

  
  async function OtherPage(url,count) {
    $(".swiper").remove();
    await FetchMovie(url,count)
    $(".up").off("click").click(async(e) => {
      // 添加捲動軸至頂動畫
      await ScrollAnimation()
      if(count!=1){
        count --;
      }
      await FetchMovie(url,count)
    });

    $(".down").off('click').click(async(e) => {
      // 添加捲動軸至頂動畫
      await ScrollAnimation()
      count ++;
      await FetchMovie(url,count) 
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
        if(res.results === undefined){
          count = 1;
          FetchMovie(url,count);
          return res;
        }else{
          return res;
        }
      },
      error:function(err){
        console.log(err)
      }
    })
    // 按照JSON的順序編排電影位置
    for(const movie of MovieContainer.results){
      await TranslateMovie(movie,count)
    }
    $(".movie_container").html(MovieContent);
    $(".page").html(count)
    

    
    
    // 讀取 Movie Translate 的資料
    async function TranslateMovie(movie,count){
      const MovieData = {
        translate:[],
        movie:[],
      }
      const MovieTranslate = await $.ajax({ 
        url: Movie_url+`/movie/${movie.id}/translations?`+key,
        method:"GET",
        dataType:"JSON",
        success:function(res){
          return res;
        },
        error:function(err){
          console.log(err)
        }
      })

      // 配對兩筆資料並把資料放到MovieContent變數裡
      await MovieTranslate.translations.map((ID)=>{
        if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
          if(!MovieData.translate.includes(ID)){
            MovieData.translate.push(ID);
          }
          if(!MovieData.movie.includes(movie)){
            MovieData.movie.push(movie);
          }
        }else if(ID.iso_639_1 === "en" && ID.iso_3166_1 === "US"){
          if(!MovieData.movie.includes(movie)){
            MovieData.movie.push(movie);
          }
        }
      })

      if(MovieData.movie.length != 0 && MovieData.translate.length != 0){
        $.each(MovieData.movie,(index,movie)=>{
          $.each(MovieData.translate,(index,ID)=>{
            if(movie.title && ID.data.title){
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
          })
        })
      }else{
        $.each(MovieData.movie,(index,movie)=>{
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
        })
      }
    }
  }
  
  function clickPage(Home_count){
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
    if($(".swiper-slide").length===0){
      SwiperBox()
    }
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
        return res
      }
    })
    // 按照Json的順序放到TranslateMovie()中，防止電影位置改變
    for(const movie of getMovie.results){
      await TranslateMovie(movie)
    }
    // 顯示電影
    await $(".movie_container").html(MovieContent);
    $('.page').html(Home_count)
    async function TranslateMovie(movie,count){
      const MovieData = {
        translate:[],
        movie:[],
      }
      const translate = await $.ajax({
        url:Movie_url+`/movie/${movie.id}/translations?`+key,
        method:"GET",
        dataType:"JSON",
        success:function(res){
          return res;
        }
      })
      // 過濾有無中文名稱
      await $.each(translate.translations,(index,ID)=>{
        if(ID.iso_639_1 === "zh" && ID.iso_3166_1 === "TW"){
          // 不抓到重複的資料
          if(!MovieData.translate.includes(ID)){
            MovieData.translate.push(ID)
          }
          // 不抓到重複的資料
          if(!MovieData.movie.includes(movie)){
            MovieData.movie.push(movie)
          }
        }else if(ID.iso_3166_1 === "US" && ID.iso_639_1 === "en"){
          // 如果上下都符合，也不抓到重複的資料
          if(!MovieData.movie.includes(movie)){
            MovieData.movie.push(movie)
          }
        }
      })
      // 判斷電影是否有中文名稱
      if(MovieData.movie.length!=0 && MovieData.translate.length!=0){
        await $.each(MovieData.movie,(index,movie)=>{
          $.each(MovieData.translate,(index,ID)=>{
            if(movie.title && ID.data.title){
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
          })
        })
      // 沒有就顯示英文
      }else{
        await $.each(MovieData.movie,(index,movie)=>{
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
        })
      }

      $(".up").off("click").click(async(e)=>{
        await ScrollAnimation()
        if(Home_count!=1){
          Home_count --
        }
        await HomePage(Home_count)
      })

      $(".down").off("click").click(async(e)=>{
        await ScrollAnimation()
        Home_count ++
        await HomePage(Home_count)
      })
    }
  }
  
  function ScrollAnimation(){
    return new Promise((resolve)=>{
      $("html,body").animate({
        scrollTop:0,
      },50)
      resolve()
    })
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
      await $.each(MovieTranslate.translations,(index,ID)=>{
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
      })
      $(".swiper-wrapper").html(SwiperContainer);
    }
  }
  async function initSwiper(){
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




