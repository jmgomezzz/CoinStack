import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Coins } from '../entities/Coins.js';

const TILE = 10; //Tamaño de los tiles
const PROB_ESPECIAL = 0.15; //Prob de moneda especial
const MAX_MONEDAS = 10; //Máximo de monedas en pantalla

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
        this.crearZonas();
        this.crearMapa();
        this.crearMonedas();
        this.crearJugadores();
        this.crearMarcador();

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
                    const muro = this.muros.create(x, y, 'barrera');
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
        jugador.sumarPuntos(moneda.valor);

        const color = moneda.especial ? '#ff6ad5' : '#ffc20e';
        this.textoFlotante(moneda.x, moneda.y - 10, '+' + moneda.valor, color);

        moneda.recoger();
        this.actualizarMarcador();
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


    crearMarcador(){
    //Provisional
    const estilo = { fontSize: '8px', fontFamily: 'Pixel', color: '#ffffff' };
    this.textoJ1 = this.add.text(14, 1, '', estilo).setDepth(1000);
    this.textoJ2 = this.add.text(306, 1, '', estilo).setOrigin(1, 0).setDepth(1000);
    this.actualizarMarcador();
}

actualizarMarcador(){
    this.textoJ1.setText('VeloX: ' + this.jugador1.puntos);
    this.textoJ2.setText('FlashY: ' + this.jugador2.puntos);
}

    update(){
        this.jugadores.forEach(jugador => jugador.update());
        
    }   
}