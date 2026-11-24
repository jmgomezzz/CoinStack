import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene');
    }

    preload(){
        //--Barra de carga--
        const ancho = 200;
        this.add.text(160, 78, 'Cargando...', {fontsize: '8px', color: '#ffffff'}).setOrigin(0.5);
        this.add.rectangle(160, 90, ancho + 4, 10).setStrokeStyle(1, 0xffffff);
        const barra = this.add.rectangle(160 - ancho/2, 90, 0, 6, 0xffc20e).setOrigin(0, 0.5);

        //progess se dispara cada vez que se carga un archivo
        this.load.on('progress', (valor) => {
            barra.width = ancho * valor;
        });


        //Escenario
        this.load.image('barrera', 'assets/images/barreras/barrera.png');
        this.load.image('obstaculo', 'assets/images/barreras/obstaculo.png');
        this.load.image('casilla_azul', 'assets/images/casillas/casilla_azul.png');
        this.load.image('casilla_roja', 'assets/images/casillas/casilla_roja.png');
        this.load.image('casilla_normal', 'assets/images/casillas/casilla_normal.png');

        //Monedas
        this.load.image('moneda_1', 'assets/images/monedas/moneda_1.png');
        this.load.image('moneda_2', 'assets/images/monedas/moneda_2.png');
        this.load.image('moneda_especial_1', 'assets/images/monedas/moneda_especial_1.png');
        this.load.image('moneda_especial_2', 'assets/images/monedas/moneda_especial_2.png');

        //Personajes
        this.load.spritesheet('robots', 'assets/images/personajes/robots.png', {
            frameWidth: 24,
            frameHeight: 36
        });
        this.load.image('fantasma', 'assets/images/personajes/fantasma.png');

        //UI
        this.load.image('icono_velox', 'assets/images/interfaz/icono_velox.png');
        this.load.image('icono_flashy', 'assets/images/interfaz/icono_flashy.png');
        this.load.image('boton_pausa', 'assets/images/interfaz/boton_pausa.png');
        this.load.image('boton_menu', 'assets/images/interfaz/boton_menu.png');
        this.load.image('boton_reinicio', 'assets/images/interfaz/boton_reinicio.png');
        this.load.image('controles', 'assets/images/interfaz/controles.png');
        this.load.image('game_over', 'assets/images/interfaz/game_over.png');

    }

    create(){
        this.scene.start('GameScene');
    }
}