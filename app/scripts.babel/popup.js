'use strict';


// PRELOADER
class Preloader {
    constructor() {
        this.p = document.getElementById('preloader')
        this.pbg = document.getElementById('preloader-bg')
        this.limit = 10 // number of custom bgs gradients
        this.randomnumber = Math.floor(Math.random() * (this.limit))
        this.flag = false
    }

    show(cb){
        this.p.className += `bg-${this.randomnumber} active`
        document.getElementById('background-active').className = `bg-${this.randomnumber}`
        // this.p.addEventListener('transitionend', () => {
            cb()
        // }, false);
    }

    remove(cb){
        setTimeout(() => {
            this.p.classList.add('active-loaded')
            this.p.addEventListener('transitionend', () => {
                if (!this.flag){
                    this.pbg.className = 'loaded'
                        this.flag = true
                        cb()
                    }
                }, false);
        }, 0)
    }
}


// GET MOODS
class Moods {
    constructor(codes) {
        this.codes = [
            {
                'codes': [701,711,800],
                'class': 'clear',
                'keywords': [
                    'wake+up+happy',
                    'sunny',
                    'sunsets',
                ]
            },
            {
                'codes': [801,802,803,804],
                'class': 'clouds',
                'keywords': [
                  'cloudy'
                ],
            },
            {
                'codes': [701,711,721,731,741,751,761,762,771,781],
                'class': 'clouds',
                'keywords': [
                    'foggy',
                ],
            },
            {
                'codes': [500,501,502,503,504,511,520,521,522,531,300,301,302,310,311,312,313,314,321],
                'class': 'rain',
                'keywords': [
                    'rainy'
                ]
            },
            {
                'codes': [200,201,202,210,211,212,221,230,231,232],
                'class': 'thunderstorm',
                'keywords': [
                    'stormy',
                    'dark',
                    'rock'
                ]
            },
            {
                'codes': [600,601,602,611,612,615,616,620,621,622],
                'class': 'snow',
                'keywords': [
                    'snowboarding',
                    'snow+day',
                    'snow',
                    'acoustic+winter',
                ]
            },
            {
                'codes': [900,901,902,903,904,905,906],
                'class': 'extreme',
                'keywords': ['metal', 'extreme', 'rock'],
            }
        ]
    }

    getKeyword(keyword) {
        let limit, randomnumber

        for (let i=0; i<this.codes.length; i++) {
            if (this.codes[i].codes.indexOf(keyword) > -1) {
                limit = this.codes[i].keywords.length
                randomnumber = Math.floor(Math.random() * (limit))
                console.log('The keyword is:', this.codes[i].keywords[randomnumber])
                return this.codes[i].keywords[randomnumber]
            }
        }
    }

    getClass(keyword) {
        for (let i=0; i<this.codes.length; i++){
            if (this.codes[i].codes.indexOf(keyword) > -1){
                return this.codes[i].class;
            }
        }
    }
}


// GET GEOLOCATION
class Geolocation {
    getPosition(cb){
        navigator.geolocation.getCurrentPosition (
            (position) => {
                this.savePosition(`${position.coords.latitude},${position.coords.longitude}`, cb)
                console.log('position', position)
            },
            (error) => {
                this.savePosition('21.40706,149.92483', cb)
                console.log('position', error)
            }
        )
    }

    savePosition(position, cb) {
        localStorage.setItem('SWM_Position', position)
        cb()
    }

    checkPosition(cb) {
        if (localStorage.getItem('SWM_Position') === null) {
            if (cb && typeof cb === 'function') {
                this.getPosition(cb)
            }
        } else {
            if (cb && typeof cb === 'function') {
                cb()
            }
        }
    }
}

// GET USER WEATHER
class Weather {
    constructor(api_key, api_url) {
        this.api_key = 'd34287f4a61b20a089415d7d0f112bc2'
        this.api_url = 'http://api.openweathermap.org/data/2.5/weather?'
    }

    getWeather(cb) {
        const coords = localStorage.getItem('SWM_Position').split(','),
            _url = `${this.api_url}lat=${coords[0]}&lon=${coords[1]}&units=metric&appid=${this.api_key}`

        const request = new XMLHttpRequest()

        request.open('GET', _url, true)

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                const data = JSON.parse(this.response)
                cb(this.response)
            } else {
                // We reached our target server, but it returned an error
                cb(this.response)
            }
        }
        request.onerror = function() {
          // There was a connection error of some sort
        }

        request.send()
    }
}

// GET PLAYSLIST
class Song {

    getSong(cb, mood){

        let keyword = MOODS.getKeyword(mood)
        const config = {
            url: `https://www.mrosati.it/weatherymood/?search=${keyword}`
        }

        const request = new XMLHttpRequest()

        request.open('GET', config.url, true)

        request.onload = function(response) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var _data = response.target.response
                _data = JSON.parse(_data)
                const limit = _data.playlists.items.length
                const randomnumber = Math.floor(Math.random() * (0 - limit + 1)) + limit
                const playlist = _data.playlists.items[randomnumber]
                console.log('The selected playlist is:', playlist)
                cb(playlist)
            } else {
                // We reached our target server, but it returned an error
            }
        }
        request.onerror = function(response) {
            // There was a connection error of some sort
            console.log('error', response)
        }

        request.send()
    }
}








const GEOLOCATION  = new Geolocation()
const WEATHER      = new Weather()
const SONG         = new Song()
const MOODS        = new Moods()
const PRELOADER    = new Preloader()

let firstCall, secondCall, thirdCall


















// WEATHERYMOOD FUNCTIONS

const loadImg = (src, callback) => {
    const sprite = new Image()
    sprite.onload = callback
    sprite.src = src
}

const renderPlaylist = (data) => {
    let playlistCover

    if (data.images[0] == undefined){
        playlistCover = 'src/img/disc.jpg'
    } else {
        playlistCover = data.images[0].url
    }

    const track = {
        uri: data.uri,
        name: data.name,
        cover: playlistCover
    }

    loadImg(track.cover, () => {
        document.getElementById('song-details').className = 'active'
        document.getElementById('song-cover')
         .insertAdjacentHTML('beforeend',`
            <div id="card">
                <img src="${track.cover}">
                <div id="song-play">
                    <a href="${track.uri}" class="play"></a>
                    <div id="song-replay">
                        <svg class="svg-icon" viewBox="0 0 20 20">
                            <path fill="#fff" d="M3.254,6.572c0.008,0.072,0.048,0.123,0.082,0.187c0.036,0.07,0.06,0.137,0.12,0.187C3.47,6.957,3.47,6.978,3.484,6.988c0.048,0.034,0.108,0.018,0.162,0.035c0.057,0.019,0.1,0.066,0.164,0.066c0.004,0,0.01,0,0.015,0l2.934-0.074c0.317-0.007,0.568-0.271,0.56-0.589C7.311,6.113,7.055,5.865,6.744,5.865c-0.005,0-0.01,0-0.015,0L5.074,5.907c2.146-2.118,5.604-2.634,7.971-1.007c2.775,1.912,3.48,5.726,1.57,8.501c-1.912,2.781-5.729,3.486-8.507,1.572c-0.259-0.18-0.618-0.119-0.799,0.146c-0.18,0.262-0.114,0.621,0.148,0.801c1.254,0.863,2.687,1.279,4.106,1.279c2.313,0,4.591-1.1,6.001-3.146c2.268-3.297,1.432-7.829-1.867-10.101c-2.781-1.913-6.816-1.36-9.351,1.058L4.309,3.567C4.303,3.252,4.036,3.069,3.72,3.007C3.402,3.015,3.151,3.279,3.16,3.597l0.075,2.932C3.234,6.547,3.251,6.556,3.254,6.572z"></path>
                        </svg>
                    </div>
                </div>
            `);
        reload()
        document.getElementById('song-name').innerHTML = track.name
        setTimeout(() => {
            document.getElementById('card').className = 'flipped'
        }, 100)

    })
}

const reload = () => {
    const el = document.getElementById('song-replay');
    el.addEventListener('click', () =>{
        window.location.reload()
    })
}

const _renderBackground = (id_mood) => {
    var type = MOODS.getClass(id_mood)
    // d.getElementsByClassName("icon-"+type)[0].className += " active"
    // document.querySelector('.bg').classList.add(`weather-${type}`)
    document.getElementById('background-active').className += ' '+type
}

const _checkPosition = (resolve, reject) => {
    GEOLOCATION.checkPosition(() => {
        resolve()
    })
}

const _getWeather = (resolve, reject) => {
    WEATHER.getWeather((response) => {
        var _data = JSON.parse(response)
        if (_data.cod == 200){
            let temp = Math.round(_data.main.temp)
            let weatherId = _data.weather[0].id
            console.log('The weather data is:', _data)
            console.log('The weather id is:', weatherId)
            console.log('The temp is:', temp)
            _renderWeather(temp)
            resolve(weatherId)
        } else {
            _renderWeather(15)
            resolve(801)
        }
    })
}

const _renderWeather = (temp) => {
    // document.getElementById("info-meteo-text").innerHTML = temp+'°C'
}

const init = () => {

    firstCall = new Promise((resolve, reject) => {
        _checkPosition(resolve, reject)
    }).then((data) => {
        secondCall = new Promise((resolve, reject) => {
            _getWeather(resolve, reject)
        })
        .then((data) => {

            let id_mood = data
            _renderBackground(id_mood)

            thirdCall = new Promise((resolve, reject) => {

                SONG.getSong((data) => {
                    resolve(data)
                }, id_mood)

            }).then((data) => {

                PRELOADER.remove(()=>{
                    // initShareButtons(data)
                    renderPlaylist(data)
                })

            }).catch((response) => {
                console.log('error', response)
            })
        })
    })
}


if (navigator.onLine){
    new Promise((resolve, reject) => {
        PRELOADER.show(() => {
            resolve()
        })
    }).then(() => {
        init()
    })
} else {
    document.getElementById('app').className += 'offline'
}