import Phaser from 'phaser';

const ESTILO = { fontFamily: 'Pixel', fontSize: '8px', color: '#ffffff' };

export class GameOverScene extends Phaser.Scene {
    constructor(){
        super('GameOverScene');
    }

    //init recibe los datos que le pasa GameScene al arrancarla
    init(data){
        this.puntosJ1 = data.puntosJ1;
        this.puntosJ2 = data.puntosJ2;
    }

    create(){
        //Fondo con el "GAME OVER" de Marina
        this.add.image(0, 0, 'game_over').setOrigin(0).setDisplaySize(320, 180);

        //Quién ha ganado? null = empate
        let ganador = null;
        if (this.puntosJ1 > this.puntosJ2) ganador = 'j1';
        else if (this.puntosJ2 > this.puntosJ1) ganador = 'j2';

        //Los dos robots a los lados con su puntuación
        this.crearRobot(50, 'j1', 'velox_andar', 4, this.puntosJ1, ganador);
        this.crearRobot(270, 'j2', 'flashy_andar', 0, this.puntosJ2, ganador);

        //Mensaje del resultado, del color del ganador
        const textos  = { j1: '¡GANA VELOX!', j2: '¡GANA FLASHY!' };
        const colores = { j1: '#ed1c24', j2: '#00b7ef' };
        this.add.text(160, 115, ganador ? textos[ganador] : '¡EMPATE!', {
            ...ESTILO,
            color: ganador ? colores[ganador] : '#ffc20e'
        }).setOrigin(0.5);

        //Botones
        this.crearBoton(140, 'REVANCHA', 'boton_reinicio', () => this.revancha());
        this.crearBoton(162, 'MENÚ', 'boton_menu', () => this.irAlMenu());

        this.cameras.main.fadeIn(400);
    }

    crearRobot(x, id, animacion, frameQuieto, puntos, ganador){
        const sprite = this.add.sprite(x, 160, 'robots', frameQuieto).setOrigin(0.5, 1);
        this.add.text(x, 110, String(puntos).padStart(3, '0'), ESTILO).setOrigin(0.5);

        if (ganador === id){
            //El ganador tiene una animación en plan baile cutre
            sprite.play(animacion);
            this.tweens.add({
                targets: sprite,
                y: 152,
                duration: 250,
                yoyo: true,
                repeat: -1,
                ease: 'Quad.Out'
            });
        } else if (ganador !== null){
            //El perdedor, apagado en gris
            sprite.setTint(0x555555);
        }
    }

    //Botón con la imagen de fondo de Carla, un icono a la izquierda y el texto
    crearBoton(y, texto, icono, accion){
        const fondo = this.add.image(160, y, 'boton')
            .setDisplaySize(130, 20)
            .setInteractive({ useHandCursor: true });

        this.add.image(110, y, icono).setDisplaySize(10, 10);
        const etiqueta = this.add.text(166, y, texto, { ...ESTILO, color: '#ffdb35' }).setOrigin(0.5);

        fondo
            .on('pointerover', () => etiqueta.setColor('#ffffff'))
            .on('pointerout', () => etiqueta.setColor('#ffdb35'))
            .on('pointerdown', accion);
    }

    revancha(){
        this.scene.start('GameScene');
    }

    irAlMenu(){
        this.scene.start('MenuScene');
    }
}