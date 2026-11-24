import Phaser from 'phaser';

export class ControlsScene extends Phaser.Scene {

    constructor() {
        super('ControlsScene');
    }

    create() {

        //recuperar controles
        const controles = this.registry.get('controles');

        //variable para saber si estamos cambiando una tecla
        this.cambiandoTecla = false;

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


        //CONTROLES JUGADOR 1
        this.crearBotonControl(10, 60, 'ARRIBA', 'j1', 'arriba');
        this.crearBotonControl(10, 80, 'ABAJO', 'j1', 'abajo');
        this.crearBotonControl(10, 100, 'IZQUIERDA', 'j1', 'izquierda');
        this.crearBotonControl(10, 120, 'DERECHA', 'j1', 'derecha');


        //CONTROLES JUGADOR 2
        this.crearBotonControl(170, 60, 'ARRIBA', 'j2', 'arriba');
        this.crearBotonControl(170, 80, 'ABAJO', 'j2', 'abajo');
        this.crearBotonControl(170, 100, 'IZQUIERDA', 'j2', 'izquierda');
        this.crearBotonControl(170, 120, 'DERECHA', 'j2', 'derecha');


        //instrucciones
        this.instrucciones = this.add.text(
            160, 140, 'PULSA SOBRE UN CONTROL', {
                fontSize: '7px',
                fontFamily: 'Pixel',
                color: '#ffffff'
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
            .on('pointerdown', () => {

                if (!this.cambiandoTecla) {
                    this.scene.start('SettingsScene');
                }
            });
    }


    //funcio que crea y modifica los controles
    crearBotonControl(x, y, nombre, jugador, movimiento) {

        const controles = this.registry.get('controles');

        //movimiento
        this.add.text(x, y, nombre, {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0, 0.5);

        //boton
        const imagenBoton = this.add.image(x + 112, y, 'boton')
            .setDisplaySize(65, 19)
            .setInteractive({ useHandCursor: true });

        //tecla actual
        const textoTecla = this.add.text(
            x + 112, y, controles[jugador][movimiento], {
                fontSize: '7px',
                fontFamily: 'Pixel',
                color: '#ffdb35'
            }).setOrigin(0.5);


        imagenBoton
            .on('pointerover', () => textoTecla.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => textoTecla.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => {

                if (this.cambiandoTecla) {
                    return;
                }

                this.cambiandoTecla = true;

                textoTecla.setText('?');

                this.instrucciones.setText('PULSA UNA NUEVA TECLA');

                //esperar a que el usuario pulse una tecla
                this.input.keyboard.once('keydown', (event) => {

                    const nuevaTecla = Object.keys(
                        Phaser.Input.Keyboard.KeyCodes
                    ).find(tecla =>
                        Phaser.Input.Keyboard.KeyCodes[tecla] === event.keyCode
                    );

                    //comprobar que la tecla sea válida
                    if (nuevaTecla && nuevaTecla !== 'ESC') {

                        controles[jugador][movimiento] = nuevaTecla;

                        this.registry.set('controles', controles);
                    }

                    //actualiza el texto del botón
                    textoTecla.setText(controles[jugador][movimiento]);

                    this.instrucciones.setText('PULSA SOBRE UN CONTROL');

                    this.cambiandoTecla = false;
                });
            });
    }
}
