
import Phaser from 'phaser';
import { CONTROLES_POR_DEFECTO } from '../config.js';

export class ControlsScene extends Phaser.Scene {

    constructor() {
        super('ControlsScene');
    }

    create() {
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        

        //variable para saber si estamos cambiando una tecla
        this.cambiandoTecla = false;

        // Fondo
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);

        //capa gris
        this.add.rectangle(160, 90, 320, 180, 0x555555, 0.7);

        //titulo
        this.add.text(160, 15, 'CAMBIAR CONTROLES', {
            fontSize: '16px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //jugador 1
        this.add.text(80, 35, 'JUGADOR 1', {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        //jugador 2
        this.add.text(240, 35, 'JUGADOR 2', {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);


        //CONTROLES JUGADOR 1
        this.crearBotonControl(10, 52, 'ARRIBA', 'j1', 'arriba');
        this.crearBotonControl(10, 70, 'ABAJO', 'j1', 'abajo');
        this.crearBotonControl(10, 88, 'IZQUIERDA', 'j1', 'izquierda');
        this.crearBotonControl(10, 106, 'DERECHA', 'j1', 'derecha');
        this.crearBotonControl(10, 124, 'SOBRECARGA', 'j1', 'sobrecarga');

        //CONTROLES JUGADOR 2
        this.crearBotonControl(170, 52, 'ARRIBA', 'j2', 'arriba');
        this.crearBotonControl(170, 70, 'ABAJO', 'j2', 'abajo');
        this.crearBotonControl(170, 88, 'IZQUIERDA', 'j2', 'izquierda');
        this.crearBotonControl(170, 106, 'DERECHA', 'j2', 'derecha');
        this.crearBotonControl(170, 124, 'SOBRECARGA', 'j2', 'sobrecarga');

        //Instrucciones
        this.instrucciones = this.add.text(
            160, 143, 'PULSA SOBRE UN CONTROL', {
                fontSize: '8px',
                fontFamily: 'Pixel',
                color: '#ffffff'
            }).setOrigin(0.5);


        //boton RESTABLECER
        const imagenRestablecer = this.add.image(85, 165, 'boton')
            .setDisplaySize(150, 25)
            .setInteractive({ useHandCursor: true });

        const restablecerBtn = this.add.text(85, 165, 'RESTABLECER', {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0.5);

        imagenRestablecer
            .on('pointerover', () => restablecerBtn.setStyle({ color: '#ffffff' }))
            .on('pointerout', () => restablecerBtn.setStyle({ color: '#ffdb35' }))
            .on('pointerdown', () => {

            if (!this.cambiandoTecla) {

                this.registry.set('controles', {
                    j1: { ...CONTROLES_POR_DEFECTO.j1 },
                    j2: { ...CONTROLES_POR_DEFECTO.j2 }
                });
                this.scene.restart();
                }
            });

        //boton VOLVER
        const imagenVolver = this.add.image(240, 165, 'boton')
            .setDisplaySize(125, 25)
            .setInteractive({ useHandCursor: true });

        const volverBtn = this.add.text(240, 165, 'VOLVER', {
            fontSize: '16px',
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


    //funcion que crea y modifica los controles
    crearBotonControl(x, y, nombre, jugador, movimiento) {

        const controles = this.registry.get('controles');

        // Nombre del movimiento
        this.add.text(x, y, nombre, {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffdb35'
        }).setOrigin(0, 0.5);

        //boton
        const imagenBoton = this.add.image(x + 116, y, 'boton')
            .setDisplaySize(65, 17)
            .setInteractive({ useHandCursor: true });

        //Tecla actual
        const textoTecla = this.add.text(
            x + 116, y, controles[jugador][movimiento], {
                fontSize: '8px',
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

                // Esperar a que el usuario pulse una tecla
                this.input.keyboard.once('keydown', (event) => {

                    const nuevaTecla = Object.keys(
                        Phaser.Input.Keyboard.KeyCodes
                    ).find(tecla =>
                        Phaser.Input.Keyboard.KeyCodes[tecla] === event.keyCode
                    );

                    // Comprobar si la tecla ya esta asignada
                    const teclaOcupada =
                        Object.values(controles.j1).includes(nuevaTecla) ||
                        Object.values(controles.j2).includes(nuevaTecla);

                    // Comprobar que la tecla es valida y no se usa
                    if (nuevaTecla && nuevaTecla !== 'ESC' && !teclaOcupada) {

                        controles[jugador][movimiento] = nuevaTecla;

                        this.registry.set('controles', controles);

                    } else if (teclaOcupada) {

                        this.instrucciones.setText('TECLA YA UTILIZADA');

                        this.time.delayedCall(2000, () => {
                            if (!this.cambiandoTecla) {
                                this.instrucciones.setText('PULSA SOBRE UN CONTROL');
                            }
                        });
                    }

                    // Actualizar el texto del boton
                    textoTecla.setText(controles[jugador][movimiento]);

                    if (!teclaOcupada) {
                        this.instrucciones.setText('PULSA SOBRE UN CONTROL');
                    }

                    this.cambiandoTecla = false;
                });
            });
    }
}

