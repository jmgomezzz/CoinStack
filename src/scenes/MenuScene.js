import Phaser from 'phaser';
import { reproducirMusica } from '../audio.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

preload() {
    this.load.image('fondo', 'assets/images/menu/fondo.png');
    this.load.image('titulo', 'assets/images/menu/titulo.png');
    this.load.image('boton', 'assets/images/menu/boton.png');
}

    create() {
        //Música del menú (si ya sonaba no se reinicia)
        reproducirMusica(this, 'musica_menu');
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        
        //fondo del menu
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)

            .setDisplaySize(320, 180);

        //titulo del menu
        this.add.image(0, 0, 'titulo')
            .setOrigin(0, 0)
            .setDisplaySize(320, 180);
            
        // Boton JUGAR
    const imagenJugar = this.add.image(81, 60, 'boton')
    .setDisplaySize(125, 28)
    .setInteractive({ useHandCursor: true });

    const localBtn = this.add.text(81, 60, 'JUGAR', {
        fontSize: '16px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

        imagenJugar
        .on('pointerover', () => localBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => localBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => this.scene.start('GameScene'));
        
        // Boton AYUDA
    const imagenAyuda = this.add.image(81, 90, 'boton')
        .setDisplaySize(125, 28)
        .setInteractive({ useHandCursor: true });

    const ayudaBtn = this.add.text(81, 90, 'AYUDA', {
        fontSize: '16px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

    imagenAyuda
        .on('pointerover', () => ayudaBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => ayudaBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => this.scene.start('HelpScene'));
           
         // Boton AJUSTES
    const imagenAjustes = this.add.image(81, 120, 'boton')
        .setDisplaySize(125, 28)
        .setInteractive({ useHandCursor: true });

    const ajustesBtn = this.add.text(81, 120, 'AJUSTES', {
        fontSize: '16px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

    imagenAjustes
        .on('pointerover', () => ajustesBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => ajustesBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => this.scene.start('SettingsScene'));
       
        // Boton CREDITOS
    
    // Boton CREDITOS
    const imagenCreditos = this.add.image(81, 150, 'boton')
        .setDisplaySize(125, 28)
        .setInteractive({ useHandCursor: true });

    const creditosBtn = this.add.text(81, 150, 'CRÉDITOS', {
        fontSize: '13px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

    imagenCreditos
        .on('pointerover', () => creditosBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => creditosBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => this.scene.start('CreditsScene'));
    }
}
