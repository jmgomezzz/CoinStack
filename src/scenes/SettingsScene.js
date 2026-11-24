import Phaser from 'phaser';

export class SettingsScene extends Phaser.Scene {

    constructor() {
        super('SettingsScene');
    }

    create() {

        //Fondo de pantalla
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(1280, 720);

        //capa gris encima del fondo
        this.add.rectangle(640, 360, 1280, 720, 0x555555, 0.7);

        //Titulo
        this.add.text(640, 100, 'AJUSTES', {
            fontSize: '60px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);


        //volumen
        this.add.text(120, 240, 'VOLUMEN', {
            fontSize: '36px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0, 0.5);

        //recuperar el volumen actual
        let volumen = this.sound.volume;

        this.add.rectangle(825, 240, 600, 20, 0x999999);

        const barraVolumen = this.add.rectangle(
            525, 240, 600 * volumen, 20, 0x245b57
        ).setOrigin(0, 0.5);

        //Cuadrado blanco para moverlo y cambiar volumen
        const selector = this.add.rectangle(
            525 + 600 * volumen, 240, 40, 40, 0xffffff
        ).setInteractive({ useHandCursor: true });

        //porcentaje de volumen
        const textoVolumen = this.add.text(
            825, 300, Math.round(volumen * 100) + '%', {
                fontSize: '24px',
                fontFamily: 'Pixel',
                color: '#ffffff'
            }).setOrigin(0.5);

        //permitir arrastrar el cuadrado
        this.input.setDraggable(selector);

        selector.on('drag', (pointer, dragX) => {

            selector.x = Phaser.Math.Clamp(dragX, 525, 1125);

            volumen = (selector.x - 525) / 600;

            barraVolumen.width = 600 * volumen;

            this.sound.setVolume(volumen);

            this.registry.set('volumen', volumen);

            textoVolumen.setText(Math.round(volumen * 100) + '%');
        });


        //boton CAMBIAR CONTROLES
        const imagenControles = this.add.image(640, 420, 'boton')
            .setDisplaySize(850, 130)
            .setInteractive({ useHandCursor: true });

        const controlesBtn = this.add.text(640, 420, 'CAMBIAR CONTROLES', {
            fontSize: '36px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenControles
            .on('pointerover', () => controlesBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => controlesBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => console.log('Cambiar controles'));


        //boton VOLVER
        const imagenVolver = this.add.image(640, 600, 'boton')
            .setDisplaySize(500, 110)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(640, 600, 'VOLVER', {
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