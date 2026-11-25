import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {

    constructor() {
        super('CreditsScene');
    }

    create() {
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        

        // Fondo
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        // Capa gris sobre el fondo
        this.add.rectangle(160, 90, 320, 180, 0x555555, 0.7);

        // Titulo
        this.add.text(160, 13, 'CRÉDITOS', {
            fontSize: '16px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        // Nombre del videojuego
        this.add.text(160, 30, 'COIN STACK', {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffffff'
        }).setOrigin(0.5);


        // Integrantes del grupo
        this.crearCredito(
            42,
            'Irene Mendoza Mederos',
            'Diseño del icono, programación\n de menús y ajustes'
        );

        this.crearCredito(
            76,
            'José Manuel Gómez Ruiz',
            'Programación de la lógica del juego'
        );

        this.crearCredito(
            100,
            'Marina Perona García',
            'Diseño de tiles, obstáculos y objetos'
        );

        this.crearCredito(
            124,
            'Carla González Domínguez',
            'Diseño de interfaces y personajes'
        );


        // Boton VOLVER
        const imagenVolver = this.add.image(160, 165, 'boton')
            .setDisplaySize(125, 24)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(160, 165, 'VOLVER', {
            fontSize: '16px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenVolver
            .on('pointerover', () => volverBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => volverBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }


    // Funcion para mostrar cada integrante
    crearCredito(y, nombre, descripcion) {

        // Nombre del integrante
        this.add.text(160, y, nombre, {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        // Funcion dentro del proyecto
        this.add.text(160, y + 8, descripcion, {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 2,
            wordWrap: { width: 310 }
        }).setOrigin(0.5, 0);
    }
}

