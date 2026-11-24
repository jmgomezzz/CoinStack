import Phaser from 'phaser';

const TILE = 10; //Tamaño de los tiles

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

        MAPA.forEach((fila, f) => {
            [...fila].forEach((caracter, c) => {
                //Centro de la casilla
                const x = c * TILE + TILE/2;
                const y = f * TILE + TILE/2;

                if(caracter === '#'){
                    this.muros.create(x, y, 'barrera');
                } else if (caracter === 'O'){
                    this.muros.create(x, y, 'obstaculo');
                } else if (caracter === 'A' || caracter === 'R'){
                    //con tilesprite repite la casilla 6*6 hasta llenar 18*18
                    const textura = caracter === 'A' ? 'casilla_azul' : 'casilla_roja';
                    this.add.tileSprite(x, y, 18, 18, textura);
                    this.salidas[caracter] = {x, y};
                }
            });
        });
    }
}