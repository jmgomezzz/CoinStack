import Phaser from 'phaser';

export class TestScene extends Phaser.Scene{
    constructor(){
        super('TestScene');
    }

    create(){
        this.add.text(160, 90,'CoinStack', {
            fontSize: '16px',
            color: '#ffc20e'
        }).setOrigin(0.5);
    }
}