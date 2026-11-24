import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene.js';
import { GameScene } from './scenes/GameScene.js';
import { HelpScene } from './scenes/HelpScene.js';
import { MenuScene } from './scenes/MenuScene.js';

const config = {
    type: Phaser.AUTO,      // WebGL if available; otherwise, Canvas
    width: 320,  //Para la resolucion interna y que cuadren los sprites
    height: 180,
    pixelArt: true, //Para quitar el suavizado q se veia mal
    backgroundColor: '#269163', // el verde de la paleta
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH  //centrado
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false //lo uso para ver las colisiones
        }
    },
    scene: [PreloadScene, GameScene, HelpScene, MenuScene]      // The first scene starts automatically
};

document.fonts.load('48px Pixel').then(() => {
    const game = new Phaser.Game(config);
});
