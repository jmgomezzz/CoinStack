
import Phaser from 'phaser';

export class HelpScene extends Phaser.Scene {

    constructor() {
        super('HelpScene');
    }

    create() {

        //fondo de pantalla
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        //fondo oscuro
        this.add.rectangle(160, 90, 310, 176, 0x000000, 0.8);

        //titulo AYUDA
        this.add.text(160, 12, 'AYUDA', {
            fontSize: '12px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //instrucciones
        this.add.text(160, 33,
            'OBJETIVO DEL JUEGO:\n' +
            'Recoge todas las monedas que puedas.\n' +
            'Consigue más monedas que tu rival.', {
                fontSize: '7px',
                fontFamily: 'Pixel',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 3,
                wordWrap: { width: 290 }
            }).setOrigin(0.5);

        //imagen de los controles
        this.add.image(160, 103, 'controles')
            .setOrigin(0.5)
            .setDisplaySize(192, 108);

        //boton VOLVER
        const imagenVolver = this.add.image(160, 165, 'boton')
            .setDisplaySize(125, 24)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(160, 165, 'VOLVER', {
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
