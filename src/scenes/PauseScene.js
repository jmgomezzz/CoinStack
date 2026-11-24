import Phaser from 'phaser';

const ESTILO = { fontFamily: 'Pixel', fontSize: '8px', color: '#ffdb35' };

export class PauseScene extends Phaser.Scene {
    constructor(){
        super('PauseScene');
    }

    create(){
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        
        //Fondo oscuro semitransparente
        this.add.rectangle(0, 0, 320, 180, 0x000000, 0.7).setOrigin(0);

        this.add.text(160, 30, 'PAUSA', { ...ESTILO, fontSize: '16px' }).setOrigin(0.5);

        this.crearBoton(65, 'REANUDAR', () => this.reanudar());
        this.crearBoton(90, 'REINICIAR', () => this.reiniciar());
        this.textoSonido = this.crearBoton(115, this.textoBotonSonido(), () => this.alternarSonido());
        this.crearBoton(140, 'MENÚ PRINCIPAL', () => this.irAlMenu());

        //Esc también reanuda
        this.input.keyboard.once('keydown-ESC', () => this.reanudar());
    }

    //Botón reutilizable
    crearBoton(y, texto, accion){
        const fondo = this.add.image(160, y, 'boton')
            .setDisplaySize(130, 20)
            .setInteractive({ useHandCursor: true });

        const etiqueta = this.add.text(160, y, texto, ESTILO).setOrigin(0.5);

        fondo
            .on('pointerover', () => etiqueta.setColor('#ffffff'))
            .on('pointerout', () => etiqueta.setColor('#ffdb35'))
            .on('pointerdown', accion);

        return etiqueta;
    }

    reanudar(){
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    reiniciar(){
        //start sobre una escena que ya existe la reinicia desde cero
        //(su shutdown cierra el HUD y su create lo vuelve a abrir)
        this.scene.start('GameScene');
    }

    irAlMenu(){
        this.scene.stop('GameScene');//Su shutdown cierra también el HUD
        this.scene.start('MenuScene');
    }

    textoBotonSonido(){
        return this.sound.mute ? 'SONIDO: NO' : 'SONIDO: SÍ';
    }

    alternarSonido(){
        //sound es global, afecta a todo el juego
        this.sound.mute = !this.sound.mute;
        this.textoSonido.setText(this.textoBotonSonido());
    }
}