import Phaser from 'phaser';

export class HelpScene extends Phaser.Scene {

    constructor() {
        super('HelpScene');
    }

    create() {

        // Fondo de pantalla
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(1280, 720);

        // Fondo oscuro
        this.add.rectangle(640, 360, 1100, 600, 0x000000, 0.8);

        // Titulo-> boton AYUDA
        this.add.text(640, 120, 'AYUDA', {
            fontSize: '48px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        // Instrucciones
        this.add.text(640, 320,
            'OBJETIVO DEL JUEGO:\n\n' +
            'Recoge todas las monedas que puedas con tu robot.\n\n' +
            'Consigue más monedas que tu rival.', {
            fontSize: '25px',
            fontFamily: 'Pixel',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Boton VOLVER
        const imagenVolver = this.add.image(640, 570, 'boton')
            .setDisplaySize(500, 110)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(640, 570, 'VOLVER', {
            fontSize: '48px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenVolver
            .on('pointerover', () => volverBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => volverBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }
}