
import Phaser from 'phaser';

export class ControlsScene extends Phaser.Scene {

    constructor() {
        super('ControlsScene');
    }

    create() {
        const controles = this.registry.get('controles');

        //fondo
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        //capa gris
        this.add.rectangle(160, 90, 320, 180, 0x555555, 0.7);

        //titulo
        this.add.text(160, 18, 'CAMBIAR CONTROLES', {
            fontSize: '12px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //jugador 1
        this.add.text(80, 42, 'JUGADOR 1', {
            fontSize: '10px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //jugador 2
        this.add.text(240, 42, 'JUGADOR 2', {
            fontSize: '10px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //boton VOLVER
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
            .on('pointerdown', () => this.scene.start('SettingsScene'));
    }
}
