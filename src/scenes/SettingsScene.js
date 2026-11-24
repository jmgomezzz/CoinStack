import Phaser from 'phaser';

export class SettingsScene extends Phaser.Scene {

    constructor() {
        super('SettingsScene');
    }

    create() {
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        

        //fondo de pantalla
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        //capa gris encima del fondo
        this.add.rectangle(160, 90, 320, 180, 0x555555, 0.7);

        //titulo
        this.add.text(160, 25, 'AJUSTES', {
            fontSize: '15px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //volumen
        this.add.text(20, 60, 'VOLUMEN', {
            fontSize: '9px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0, 0.5);

        let volumen = this.sound.volume;

        //barra gris
        this.add.rectangle(206, 60, 150, 5, 0x999999);
        //barra de color
        const barraVolumen = this.add.rectangle(
            131, 60, 150 * volumen, 5, 0x245b57
        ).setOrigin(0, 0.5);

        //cuadrado que sube y baja el volumen
        const selector = this.add.rectangle(
            131 + 150 * volumen, 60, 10, 10, 0xffffff
        ).setInteractive({ useHandCursor: true });

        //porcentaje del volumen
        const textoVolumen = this.add.text(
            206, 75, Math.round(volumen * 100) + '%', {
                fontSize: '8px',
                fontFamily: 'Pixel',
                color: '#ffffff'
            }).setOrigin(0.5);

        //arrastrar el selector
        this.input.setDraggable(selector);

        selector.on('drag', (pointer, dragX) => {

            selector.x = Phaser.Math.Clamp(dragX, 131, 281);

            volumen = (selector.x - 131) / 150;

            barraVolumen.setSize(150 * volumen, 5);

            this.sound.setVolume(volumen);

            this.registry.set('volumen', volumen);

            textoVolumen.setText(Math.round(volumen * 100) + '%');
        });


        //boton CAMBIAR CONTROLES
        const imagenControles = this.add.image(160, 105, 'boton')
            .setDisplaySize(230, 32)
            .setInteractive({ useHandCursor: true });

        const controlesBtn = this.add.text(160, 105, 'CAMBIAR CONTROLES', {
            fontSize: '10px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenControles
            .on('pointerover', () => controlesBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => controlesBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => this.scene.start('ControlsScene'));


        //boton VOLVER
        const imagenVolver = this.add.image(160, 150, 'boton')
            .setDisplaySize(125, 28)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(160, 150, 'VOLVER', {
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