import { songs } from "../module/song_list.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const slider = $("#slider");
const webHeader = $(".web__header");
const togglePlay = $(".toggle__play");
const sliderHeight = slider.offsetHeight;
const nameMusic = $(".header__name-music");
const sliderImg = $(".slider__img");
const audio = $("#audio");
const songProgress = $("input[type=range]");
const oldSong = $(".old__song");
const newSong = $(".new__song");
const randomBtn = $(".fa-shuffle");
const repeatBtn = $(".fa-arrow-rotate-right");

function playSong(){
    return audio.play();
}

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: songs,

    //Các thuộc tính mặc định
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    // Hiển thị danh sách nhạc
    renderSong: function() {
        const html = this.songs.map((songs, index) => {
            return `
                <li data-index="${index}">
                    <div class="row ali-center content__song">
                        <img src="${songs.image}" 
                        alt=""
                        class="content__img content__item">

                        <div class="content__body content__item">
                            <p class="header__name-music">${songs.name}</p>
                            <p class="content__singer">${songs.singer}</p>
                        </div>

                        <div class="content__item">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                </li>
            `;
        });

        $("ul").innerHTML = html.join("");
        $("li").classList.add("active");
    },

    // Xử lý sự kiện
    handleEvents: function() {
        const _this = this;
        //Xoay ảnh bài hát bị bài hát chạy
        const imgRotate = slider.animate(
            [
                {transform: "rotate(360deg)"},
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        imgRotate.pause();

        //Ảnh to nhỏ khi cuộn lên, xuống
        window.addEventListener("scroll", () => {
            const windowHeight = document.documentElement.scrollTop || window.scrollY;
            const sliderNewHeight = sliderHeight - windowHeight;
            const opacity = sliderNewHeight / sliderHeight;
            
            slider.style.height = sliderNewHeight + 'px';
            slider.style.width = sliderNewHeight + 'px';
            slider.style.opacity = `${opacity}`;
        });

        //Xử lý trình duyệt không cho dùng phương thức play()
        playSong().then(function() {

        }).catch((error) => {
            togglePlay.addEventListener("click", () => {
                if(this.isPlaying === false){
                    playSong();
                }
                else{
                    audio.pause();
                }
            });
        });

        //Khi bài hát được chạy
        audio.addEventListener("play", () => {
            _this.isPlaying = true;
            imgRotate.play();
            webHeader.classList.add("playing");
            this.addActiveToCurrentSong();
        });

        //Khi bài hát được dừng
        audio.addEventListener("pause", () => {
            _this.isPlaying = false;
            imgRotate.pause();
            webHeader.classList.remove("playing");
        });

        //Khi bài hát được tua
        songProgress.addEventListener("input", (e) => {
            const seekTime = Math.floor((audio.duration) / 100 * e.target.value);
            audio.currentTime = seekTime + 1;
        });

        // Thời lượng bài hát
        audio.addEventListener("timeupdate", () => {
            if(audio.duration){
                const rangePercent = Math.floor(audio.currentTime / audio.duration * 100);
                songProgress.value = rangePercent;
            }
        });

        //Chuyển bài hát tiếp theo
        newSong.addEventListener("click", () => {
            if(this.isRandom){
                this.randomSong();
            }
            else{
                this.nextSong();
            }
            this.loadCurrentSong();
            playSong();
        });

        //Chuyển bài hát vừa phát
        oldSong.addEventListener("click", () => {
            if(this.isRandom){
                this.randomSong();
            }
            else{
                this.prevSong();
            }
            playSong();
        });

        //Xử lý khi bài hát kết thúc
        audio.addEventListener("ended", () => {
            if(this.isRandom){
                this.randomSong();
            }
            else if(this.isRepeat){
                playSong();
            }
            else{
                this.nextSong();
            }
            playSong();
        });

        //Nhấp để phát bài hát ngẫu nhiên
        randomBtn.addEventListener("click", () => {
            this.isRandom = !this.isRandom;
            randomBtn.classList.toggle("active", this.isRandom);
        });

        //Nhấp để lặp lại 1 bài hát
        repeatBtn.addEventListener("click", () => {
            this.isRepeat = !this.isRepeat;
            repeatBtn.classList.toggle("active");
        });
    },

    //Bài hát mới
    nextSong: function() {
        this.currentIndex += 1;
        if(this.currentIndex === this.songs.length){
            this.currentIndex = 0;
        }
        songProgress.value = 0;
    },

    //Lùi lại 1 bài
    prevSong: function() {
        this.currentIndex -= 1;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        songProgress.value = 0;
        this.loadCurrentSong();
    },

    //Phát 1 bài hát ngẫu nhiên
    randomSong: function() {
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
    },

    //Lặp lại 1 bài hát
    repeatSong: function() {
        if(this.isRepeat){
            playSong();
        }
    },

    //Thêm lớp active cho bài hát hiện tại
    addActiveToCurrentSong: function() {
        const liItem = $$("li");
        liItem.forEach((Element) => {
            Element.classList.remove("active");
        });

        if(liItem[this.currentIndex].dataset.index == this.currentIndex){
            liItem[this.currentIndex].classList.add("active");
            liItem[this.currentIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
    },

    //Nhấp bài nào hát bài đó
    clickToPlaySong: function() {
        const _this = this
        const liItem = $$("li");
        liItem.forEach(element => {
            element.addEventListener("click", () => {
                if(!element.classList.contains("active")){
                    this.currentIndex = Number(element.dataset.index);
                    this.addActiveToCurrentSong();
                    this.loadCurrentSong();
                    playSong();
                }
            });
        });
    },

    //Hiển thị bài hát hiện tại
    loadCurrentSong: function () {
        nameMusic.innerHTML = `${this.currentSong.name}`;
        sliderImg.src = `${this.currentSong.image}`;
        audio.src = `${this.currentSong.path}`;
    },

    // Main
    start: function() {
        this.defineProperties();
        this.handleEvents(); 
        this.loadCurrentSong();
        this.renderSong();
        this.clickToPlaySong();
    }
};

// 
app.start();