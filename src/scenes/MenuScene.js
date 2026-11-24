import Phaser from 'phaser';

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
        //fondo del menu
        this.add.image(0, 0, 'fondo')
            .setOrigin(0, 0)
            .setDisplaySize(1280, 720);

        //titulo del menu
        this.add.image(0, 0, 'titulo')
            .setOrigin(0, 0);
            
        // Boton JUGAR
    const imagenJugar = this.add.image(325, 240, 'boton')
    .setDisplaySize(500, 110)
    .setInteractive({ useHandCursor: true });

    const localBtn = this.add.text(325, 240, 'JUGAR', {
        fontSize: '48px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

        imagenJugar
        .on('pointerover', () => localBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => localBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => this.scene.start('GameScene'));
        
        // Boton AYUDA
    const imagenAyuda = this.add.image(325, 360, 'boton')
        .setDisplaySize(500, 110)
        .setInteractive({ useHandCursor: true });

    const ayudaBtn = this.add.text(325, 360, 'AYUDA', {
        fontSize: '48px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

    imagenAyuda
        .on('pointerover', () => ayudaBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => ayudaBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => console.log('Ayuda'));
           
         // Boton AJUSTES
    const imagenAjustes = this.add.image(325, 480, 'boton')
        .setDisplaySize(500, 110)
        .setInteractive({ useHandCursor: true });

    const ajustesBtn = this.add.text(325, 480, 'AJUSTES', {
        fontSize: '48px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

    imagenAjustes
        .on('pointerover', () => ajustesBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => ajustesBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => console.log('Ajustes'));
       
        // Boton SALIR
    
    const imagenSalir = this.add.image(325, 600, 'boton')
        .setDisplaySize(500, 110)
        .setInteractive({ useHandCursor: true });

    const salirBtn = this.add.text(325, 600, 'SALIR', {
        fontSize: '48px',
        fontFamily: 'Pixel',
        color: '#ffdb35'
    }).setOrigin(0.5);

    imagenSalir
        .on('pointerover', () => salirBtn.setStyle({ color: '#ffffff' }))
        .on('pointerout', () => salirBtn.setStyle({ color: '#ffdb35' }))
        .on('pointerdown', () => console.log('Salir'));
        }
    }

