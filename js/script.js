const INTENTOS = 8,
    COLUMNAS = 3,
    SEGUNDOS_ESPERA_VOLTEAR_IMAGEN = 1.5,
    NOMBRE_IMAGEN_OCULTA = "./img/back.png";

let num1arr = [Number((Math.round(Math.random() * 3))), Number((Math.round(Math.random() * 9))), Number((Math.round(Math.random() * 8) + 1))],
    num2arr = [Number((Math.round(Math.random() * 3))), Number((Math.round(Math.random() * 9))), Number((Math.round(Math.random() * 8) + 1))],
    num3arr = [Number((Math.round(Math.random() * 3))), Number((Math.round(Math.random() * 9))), Number((Math.round(Math.random() * 8) + 1))],
    num4arr = [Number((Math.round(Math.random() * 3))), Number((Math.round(Math.random() * 9))), Number((Math.round(Math.random() * 8) + 1))],
    num5arr = [Number((Math.round(Math.random() * 3))), Number((Math.round(Math.random() * 9))), Number((Math.round(Math.random() * 8) + 1))],
    num6arr = [Number((Math.round(Math.random() * 3))), Number((Math.round(Math.random() * 9))), Number((Math.round(Math.random() * 8) + 1))],
    num1 = `${num1arr[0]}${num1arr[1]}${num1arr[2]}`,
    num2 = `${num2arr[0]}${num2arr[1]}${num2arr[2]}`,
    num3 = `${num3arr[0]}${num3arr[1]}${num3arr[2]}`,
    num4 = `${num4arr[0]}${num4arr[1]}${num4arr[2]}`,
    num5 = `${num5arr[0]}${num5arr[1]}${num5arr[2]}`,
    num6 = `${num6arr[0]}${num6arr[1]}${num6arr[2]}`,
    cry1 = new Audio(`https://pokemoncries.com/cries/${parseInt(num1, 10)}.mp3`),
    cry2 = new Audio(`https://pokemoncries.com/cries/${parseInt(num2, 10)}.mp3`),
    cry3 = new Audio(`https://pokemoncries.com/cries/${parseInt(num3, 10)}.mp3`),
    cry4 = new Audio(`https://pokemoncries.com/cries/${parseInt(num4, 10)}.mp3`),
    cry5 = new Audio(`https://pokemoncries.com/cries/${parseInt(num5, 10)}.mp3`),
    cry6 = new Audio(`https://pokemoncries.com/cries/${parseInt(num6, 10)}.mp3`)

new Vue({
    el: "#app",
    data: () => ({
        imagenes: [
            `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num1}.png`,
            `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num2}.png`,
            `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num3}.png`,
            `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num4}.png`,
            `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num5}.png`,
            `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num6}.png`,
        ],
        memotest: [],

        ultimasCoordenadas: {
            indiceFila: null,
            indiceImagen: null,
        },
        NOMBRE_IMAGEN_OCULTA: NOMBRE_IMAGEN_OCULTA,
        INTENTOS: INTENTOS,
        intentos: 0,
        esperandoTimeout: false
    }),
    methods: {
        indicarFracaso() {
            Swal.fire({
                    title: "Perdiste!",
                    html: `
                <img class="img-fluid" src="./img/perdiste.png" alt="Perdiste!"><br>
                <br><p class="h4">Agotaste tus intentos.<br>Has tardado ${crono.textContent}</p><br>
                <span><input type="button" value="Reiniciar" class="btn btn-outline-danger"
                            onclick="window.location.reload(false)"></span>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                })
                .then(this.reiniciarJuego)
        },
        indicarVictoria() {
            Swal.fire({
                    title: "Ganaste!",
                    html: `
                <img class="img-fluid" src="./img/ganaste.jpg" alt="Ganaste">
                <br><br><p class="h4">Muy bien hecho.<br>Has tardado ${crono.textContent}</p><br>
                <span><input type="button" value="Reiniciar" class="btn btn-outline-danger"
                            onclick="window.location.reload(false)"></span>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                })
                .then(this.reiniciarJuego)
        },
        haGanado() {
            return this.memotest.every(arreglo => arreglo.every(imagen => imagen.acertada));
        },
        mezclarArreglo(a) {
            let j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.round(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        },
        aumentarIntento() {
            this.intentos++;
            if (this.intentos >= INTENTOS) {
                this.indicarFracaso();
            }
        },
        voltear(indiceFila, indiceImagen) {
            if (this.esperandoTimeout) {
                return;
            }
            if (this.memotest[indiceFila][indiceImagen].acertada) {
                return;
            }
            if (this.ultimasCoordenadas.indiceFila === null && this.ultimasCoordenadas.indiceImagen === null) {
                this.memotest[indiceFila][indiceImagen].mostrar = true;
                this.ultimasCoordenadas.indiceFila = indiceFila;
                this.ultimasCoordenadas.indiceImagen = indiceImagen;
                return;
            }
            let imagenSeleccionada = this.memotest[indiceFila][indiceImagen];
            let ultimaImagenSeleccionada = this.memotest[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen];
            if (indiceFila === this.ultimasCoordenadas.indiceFila &&
                indiceImagen === this.ultimasCoordenadas.indiceImagen) {
                this.memotest[indiceFila][indiceImagen].mostrar = false;
                this.ultimasCoordenadas.indiceFila = null;
                this.ultimasCoordenadas.indiceImagen = null;
                this.aumentarIntento();
                return;
            }

            this.memotest[indiceFila][indiceImagen].mostrar = true;
            if (imagenSeleccionada.ruta === ultimaImagenSeleccionada.ruta) {
                this.memotest[indiceFila][indiceImagen].acertada = true;
                this.memotest[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen].acertada = true;
                this.ultimasCoordenadas.indiceFila = null;
                this.ultimasCoordenadas.indiceImagen = null;

                if (this.haGanado()) {
                    this.indicarVictoria();
                }
            } else {
                this.esperandoTimeout = true;
                setTimeout(() => {
                    this.memotest[indiceFila][indiceImagen].mostrar = false;
                    this.memotest[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen].mostrar = false;
                    this.ultimasCoordenadas.indiceFila = null;
                    this.ultimasCoordenadas.indiceImagen = null;
                    this.esperandoTimeout = false;
                }, SEGUNDOS_ESPERA_VOLTEAR_IMAGEN * 1000);
                this.aumentarIntento();
            }

            
        },
        reiniciarJuego() {
            let memotest = [];
            this.imagenes.forEach((imagen, indice) => {
                let imagenDeMemotest = {
                    ruta: imagen,
                    mostrar: false,
                    acertada: false,
                };
                memotest.push(imagenDeMemotest, Object.assign({}, imagenDeMemotest));
            });

            this.mezclarArreglo(memotest);

            let memotestDividido = [];
            for (let i = 0; i < memotest.length; i += COLUMNAS) {
                memotestDividido.push(memotest.slice(i, i + COLUMNAS));
            }
            this.intentos = 0;
            this.memotest = memotestDividido;
            crono.textContent = "00:00"
        },

        precargarImagenes() {
            Swal.fire({
                    title: "Cargando...",
                    html: `Buscando imágenes.`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
                .then(this.reiniciarJuego)
            Swal.showLoading();

            let total = this.imagenes.length,
                contador = 0;
            let imagenesPrecarga = Array.from(this.imagenes);
            imagenesPrecarga.push(NOMBRE_IMAGEN_OCULTA);
            imagenesPrecarga.forEach(ruta => {
                const imagen = document.createElement("img");
                imagen.src = ruta;
                imagen.addEventListener("load", () => {
                    contador++;
                    if (contador >= total) {
                        this.reiniciarJuego();
                        Swal.close();
                    }
                });
                document.body.appendChild(imagen);
                document.body.removeChild(imagen);
            });
        },
        reloj() {
            let crono = document.getElementById('crono'),
                seconds = 0,
                minutes = 0,
                t;

            function addTheChronometer() {
                seconds++;
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                    if (minutes >= 60) {
                        minutes = 0;
                    }
                }

                crono.textContent =
                    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
                    (seconds > 9 ? seconds : "0" + seconds);
                timer();
            }

            const timer = () => t = setTimeout(addTheChronometer, 1000);
            window.onload = timer();
        },
        playCry1() {
            cry1.play();
        },
        playCry2() {
            cry2.play();
        },
        playCry3() {
            cry3.play();
        },
        playCry4() {
            cry4.play();
        },
        playCry5() {
            cry5.play();
        },
        playCry6() {
            cry6.play();
        },
    },
    mounted() {
        this.precargarImagenes();
        this.reloj();
    },
});

document.getElementById("current-year").innerHTML = new Date().getFullYear();