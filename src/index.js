import Phaser from 'phaser';
import { TestScene } from './scenes/TestScene.js';

const config = {
    type: Phaser.AUTO,      // WebGL if available; otherwise, Canvas
    width: 320,  //Para la resolucion interna y que cuadren los sprites
    height: 180,
    pixelart: true, //Para quitar el suavizado q se veia mal
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
    scene: [TestScene]      // The first scene starts automatically
};

new Phaser.Game(config);
