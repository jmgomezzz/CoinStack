import Phaser from 'phaser';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, tipo){
        super(scene, x, y, tipo);
        this.tipo = tipo;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setDepth(y);

        //Flota arriba y abajo para distinguirse de las monedas
        scene.tweens.add({
            targets: this,
            y: y - 2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    recoger(){
        this.body.enable = false;
        this.scene.tweens.killTweensOf(this);//Paramos el flotar antes de la animación de recogida
        this.scene.tweens.add({
            targets: this,
            y: this.y - 6,
            alpha: 0,
            duration: 200,
            onComplete: () => this.destroy()
        });
    }
}