
import Phaser from 'phaser';

export class HelpScene extends Phaser.Scene {

    constructor() {
        super('HelpScene');
    }

    create() {
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        

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

        //Controles en texto: se leen nítidos y muestran las teclas actuales (si se cambian en Ajustes, aquí se ven)
        const controles = this.registry.get('controles');
        this.crearColumnaControles(14, 150, 'VELOX', '#ed1c24', controles.j1);
        this.crearColumnaControles(170, 306, 'FLASHY', '#00b7ef', controles.j2);
        this.add.rectangle(160, 85, 1, 64, 0xffffff, 0.3); //separador

        this.add.text(160, 132, 'PAUSA: ESC', {
            fontSize: '8px',
            fontFamily: 'Pixel',
            color: '#ffffff'
        }).setOrigin(0.5);

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
    //Columna con el nombre del robot y sus teclas: nombre de la acción a la izquierda, tecla a la derecha
    crearColumnaControles(xIzq, xDer, nombre, color, teclas){
        const estilo = { fontSize: '8px', fontFamily: 'Pixel', color: '#ffffff' };
        const centro = (xIzq + xDer) / 2;

        this.add.text(centro, 56, nombre, { ...estilo, color: color }).setOrigin(0.5);

        const filas = [
            ['SUBIR', teclas.arriba],
            ['BAJAR', teclas.abajo],
            ['IZQ.', teclas.izquierda],
            ['DCHA.', teclas.derecha],
            ['ESPECIAL', teclas.sobrecarga]
        ];

        filas.forEach(([accion, tecla], i) => {
            const y = 70 + i * 10;
            this.add.text(xIzq, y, accion, estilo).setOrigin(0, 0.5);
            this.add.text(xDer, y, this.nombreTecla(tecla), { ...estilo, color: '#ffdb35' }).setOrigin(1, 0.5);
        });
    }

    //Nombres de Phaser (SPACE, UP...) traducidos y cortos para que quepan
    nombreTecla(tecla){
        const nombres = { SPACE: 'ESPACIO', UP: 'ARRIBA', DOWN: 'ABAJO', LEFT: 'IZQ', RIGHT: 'DCHA', ENTER: 'ENTER' };
        return nombres[tecla] || tecla;
    }
}
