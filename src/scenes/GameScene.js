import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Coins } from '../entities/Coins.js';
import { Ghost } from '../entities/Ghost.js';
import { PowerUp } from '../entities/PowerUp.js';


const TILE = 10; //Tamaño de los tiles
const PROB_ESPECIAL = 0.15; //Prob de moneda especial
const MAX_MONEDAS = 10; //Máximo de monedas en pantalla
const DURACION = 120; //Duración de la partida en segundos
const INTERVALO_FANTASMA = 15000;//Cada cuánto aparece un fantasma (ms)
const PENALIZACION_FANTASMA = 6;//Puntos que quita
const INTERVALO_BATERIA = 15000; //cada 15 s
const MAX_BATERIAS_MAPA = 3; //Máximo de pilas a la vez en el suelo

// # = barrera, O = obstáculo, A = salida J1, R = salida J2, . = suelo

const MAPA = [
    '################################',
    '#..............................#',
    '#..............................#',
    '#..####......A....R......####..#',
    '#........##..........##........#',
    '#........##..........##........#',
    '#........##..........##........#',
    '#........##..........##........#',
    '#....O....................O....#',
    '#..............................#',
    '#..............................#',
    '#..##.....O..........O.....##..#',
    '#..##......................##..#',
    '#..#####....##....##....#####..#',
    '#...........##....##...........#',
    '#..............................#',
    '#..............................#',
    '################################'
];

export class GameScene extends Phaser.Scene{
    constructor(){
        super('GameScene');
    }

    create(){
        this.tiempoRestante = DURACION;
        this.partidaTerminada = false;
        this.crearZonas();
        this.crearMapa();
        this.crearMonedas();
        this.crearFantasmas();
        this.crearObjetos();
        this.crearJugadores();
        this.crearTemporizador();


        //HUD encima del juego funcionando a la vez
        this.scene.launch('HUDScene');
        //Si el juego se cierra, el HUD también
        this.events.once('shutdown', () => this.scene.stop('HUDScene'));
        //Transición suave de entrada
        this.cameras.main.fadeIn(400);
    }

    crearZonas(){
        //Mitad izquierda = zona azuk, derecha = roja
        //Ponemos rectangulos semitransparentes
        this.add.rectangle(0, 0, 160, 180, 0x00b7ef, 0.15).setOrigin(0);
        this.add.rectangle(160, 0, 160, 180, 0xed1c24, 0.15).setOrigin(0);
    }

    crearMapa(){
        //Estáticos
        this.muros = this.physics.add.staticGroup();
        this.salidas = {}; //guardamos donde empieza el jugador
        this.celdasLibres = []; //guardamos las celdas libres para poner monedas
        MAPA.forEach((fila, f) => {
            [...fila].forEach((caracter, c) => {
                //Centro de la casilla
                const x = c * TILE + TILE/2;
                const y = f * TILE + TILE/2;

                if(caracter === '#'){
                    const esBorde = f === 0 || f === MAPA.length - 1 || c === 0 || c === fila.length - 1; //Verifica si es un borde
                    const muro = this.muros.create(x, y, esBorde ? 'barrera' : 'barrera_2');
                    muro.setDepth(muro.y + muro.height / 2);
                } else if (caracter === 'O'){
                    const muro = this.muros.create(x, y, 'obstaculo');
                    muro.setDepth(muro.y + muro.height / 2);
                } else if (caracter === 'A' || caracter === 'R'){
                    //con tilesprite repite la casilla 6*6 hasta llenar 18*18
                    const textura = caracter === 'A' ? 'casilla_azul' : 'casilla_roja';
                    this.add.tileSprite(x, y, 18, 18, textura);
                    this.salidas[caracter] = {x, y};
                } else if(caracter === '.'){
                    this.celdasLibres.push({x, y});
                }
            });
        });
    }

    crearJugadores(){
        const controles = this.registry.get('controles');
        //+9 para que se queden en el borde inferior de la casilla
        this.jugador1 = new Player(this, 'j1', this.salidas.A.x, this.salidas.A.y + 9, controles.j1, 'velox');
        this.jugador2 = new Player(this, 'j2', this.salidas.R.x, this.salidas.R.y + 9, controles.j2, 'flashy');
        this.jugadores = [this.jugador1, this.jugador2];


        //Colisiones con paredes
        this.jugadores.forEach(jugador => {
            this.physics.add.collider(jugador.sprite, this.muros);

            //overlap con monedas
            this.physics.add.overlap(jugador.sprite, this.monedas, (sprite, moneda) => {
                this.recogerMoneda(jugador, moneda);
            });
            //overlap con fantasmas
            this.physics.add.overlap(jugador.sprite, this.fantasmas, (sprite, fantasma) => {
                this.tocarFantasma(jugador, fantasma);
            });
            //overlap con objetos (pilas y altavoces)
            this.physics.add.overlap(jugador.sprite, this.objetos, (sprite, objeto) => {
                this.recogerObjeto(jugador, objeto);
            });
        });
    }

    crearMonedas(){
        this.monedas = this.physics.add.group();

        //Cada segundo generamos una moneda
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => this.generarMoneda()
        });
    }

    generarMoneda(){
        if(this.monedas.countActive() >= MAX_MONEDAS) return; //no generamos más de 10 monedas

        const celda = Phaser.Utils.Array.GetRandom(this.celdasLibres);
        const especial = Math.random() < PROB_ESPECIAL;

        //Para que la base de la moneda quede cerca del fondo de la casilla
        this.monedas.add(new Coins(this, celda.x, celda.y + 4, especial));
    }

    recogerMoneda(jugador, moneda){
        const ganados = jugador.sumarPuntos(moneda.valor);

        const color = moneda.especial ? '#ff6ad5' : '#ffc20e';
        this.textoFlotante(moneda.x, moneda.y - 10, '+' + ganados, color);

        moneda.recoger();
        this.events.emit('puntos', jugador.id, jugador.puntos);
    }

    textoFlotante(x, y, texto, color){
    const t = this.add.text(x, y, texto, { fontSize: '8px', fontFamily: 'Pixel', color: color })
        .setOrigin(0.5)
        .setDepth(1000);//Siempre por encima de todo

    this.tweens.add({
        targets: t,
        y: y - 10,
        alpha: 0,
        duration: 600,
        onComplete: () => t.destroy()
    });
}
    crearTemporizador(){
        //Cada segundo restamos uno.
        this.time.addEvent({
            delay: 1000,
            repeat: DURACION - 1,
            callback: () => {
                this.tiempoRestante--;
                this.events.emit('tiempo', this.tiempoRestante);

                if (this.tiempoRestante === 0){
                    this.terminarPartida();
                }
            }
        });
    }

    terminarPartida(){
        //Provisional
        this.partidaTerminada = true;
        this.physics.pause();
        this.time.removeAllEvents();   //para de generar monedas
        this.jugadores.forEach(j => j.sprite.anims.stop());

        this.add.text(160, 90, '¡TIEMPO!', { fontFamily: 'Pixel', fontSize: '16px', color: '#ffc20e' })
            .setOrigin(0.5)
            .setDepth(1000);
        this.fantasmas.getChildren().forEach(f => f.desaparecer());
        this.jugadores.forEach(j => j.terminarSobrecarga());
    }
    crearFantasmas(){
        this.fantasmas = this.physics.add.group();

        this.time.addEvent({
            delay: INTERVALO_FANTASMA,
            loop: true,
            callback: () => this.generarFantasma()
        });
    }

    generarFantasma(){
        //Casillas a más de 60 px de los dos robots, para que no aparezca encima de nadie
        const lejos = this.celdasLibres.filter(c =>
            this.jugadores.every(j => Phaser.Math.Distance.Between(c.x, c.y, j.sprite.x, j.sprite.y) > 60)
        );
        //Por si acaso no hubiera ninguna lejos, usamos cualquiera
        const celda = Phaser.Utils.Array.GetRandom(lejos.length > 0 ? lejos : this.celdasLibres);

        this.fantasmas.add(new Ghost(this, celda.x, celda.y + 5));
    }

    tocarFantasma(jugador, fantasma){
        if (!fantasma.activo) return;   //Mientras aparece o desaparece no hace daño
        fantasma.desaparecer();

        jugador.sumarPuntos(-PENALIZACION_FANTASMA);
        this.events.emit('puntos', jugador.id, jugador.puntos);
        this.textoFlotante(jugador.sprite.x, jugador.sprite.y - 40, '-' + PENALIZACION_FANTASMA, '#ffffff');

        //Feedback: tiembla la cámara y el robot parpadea
        this.cameras.main.shake(150, 0.01);
        this.tweens.add({
            targets: jugador.sprite,
            alpha: 0.3,
            duration: 80,
            yoyo: true,
            repeat: 3
        });
    }
    crearObjetos(){
        this.objetos = this.physics.add.group();

        this.time.addEvent({
            delay: INTERVALO_BATERIA,
            loop: true,
            callback: () => this.generarObjeto('bateria', MAX_BATERIAS_MAPA)
        });
    }

    generarObjeto(tipo, maximo){
        //Contamos solo los objetos de ese tipo
        const cuantos = this.objetos.getChildren().filter(o => o.tipo === tipo && o.body.enable).length;
        if (cuantos >= maximo) return;

        const celda = Phaser.Utils.Array.GetRandom(this.celdasLibres);
        this.objetos.add(new PowerUp(this, celda.x, celda.y + 4, tipo));
    }

    recogerObjeto(jugador, objeto){
        if (objeto.tipo === 'bateria'){
            if (!jugador.recogerBateria()) return;//Lleno: no la recoge
            objeto.recoger();

            const texto = jugador.baterias === 4 ? '¡LISTA!' : jugador.baterias + '/4';
            this.textoFlotante(objeto.x, objeto.y - 10, texto, '#20c47e');
        }
        //TODO: altavoz
    }


    update(){
        if(this.partidaTerminada) return;
        this.jugadores.forEach(jugador => jugador.update());
        this.fantasmas.getChildren().forEach(fantasma => fantasma.perseguir(this.jugadores)); //cada fotograma persigue al mas cercano
        
    }   
}