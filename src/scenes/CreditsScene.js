
import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {

    constructor() {
        super('CreditsScene');
    }

    create() {

        //fondo
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        //capa gris sobre el fondo
        this.add.rectangle(160, 90, 320, 180, 0x555555, 0.7);

        //titulo
        this.add.text(160, 22, 'CRÉDITOS', {
            fontSize: '15px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //nombre del videojuego
        this.add.text(160, 47, 'COIN STACK', {
            fontSize: '12px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //desarrolladores y artistas
        this.add.text(160, 68, 'DESARROLLADO POR:', {
            fontSize: '9px',
            fontFamily: 'Pixel',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Integrantes del grupo
        this.add.text(160, 110,
            'Irene Mendoza Mederos: diseñadora del icono del juego y programadora de los menús y ajustes.\n' +
            'José ManuelGómez Ruiz: programador de la lógica del juego.\n' +
            'Marina Perona García: diseñadora de tiles, obstáculos y objetos.\n' +
            'Carla González Domínguez: diseñadora de interfaces, personajes y personajes.', {
                fontSize: '8px',
                fontFamily: 'Pixel',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 5
            }).setOrigin(0.5);

        // Boton VOLVER
        const imagenVolver = this.add.image(160, 162, 'boton')
            .setDisplaySize(125, 25)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(160, 162, 'VOLVER', {
            fontSize: '12px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenVolver
            .on('pointerover', () => volverBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => volverBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
