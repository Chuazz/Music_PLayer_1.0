import { songs } from "../module/song_list.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var sliderImg = $(".slider__img");

const app = {
    songs: songs,

    renderSong: function() {
        var html = this.songs.map((songs) => {
            return `
                <li>
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
    },

    start: function() {
        this.renderSong();
    }
};

app.start();