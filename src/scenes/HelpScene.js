import Phaser from 'phaser';

export class HelpScene extends Phaser.Scene {

    constructor() {
        super('HelpScene');
    }

    create() {

        // Fondo de pantalla
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        // Fondo oscuro
        this.add.rectangle(160, 90, 275, 150, 0x000000, 0.8);

        // Titulo-> boton AYUDA
        this.add.text(160, 30, 'AYUDA', {
            fontSize: '16px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        // Instrucciones
        this.add.text(160, 80,
            'OBJETIVO DEL JUEGO:\n\n' +
            'Recoge todas las monedas que puedas con tu robot.\n\n' +
            'Consigue más monedas que tu rival.', {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 4,
            wordWrap: { width: 260 }
        }).setOrigin(0.5);

        // Boton VOLVER
        const imagenVolver = this.add.image(160, 142, 'boton')
            .setDisplaySize(125, 28)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(160, 142, 'VOLVER', {
            fontSize: '16px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenVolver
            .on('pointerover', () => volverBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => volverBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }
}