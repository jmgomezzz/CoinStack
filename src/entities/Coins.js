import Phaser from 'phaser';


export class Coins extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, especial){
        super(scene, x, y, especial ? 'moneda_especial_1' : 'moneda_1');
        this.especial = especial;
        this.valor = especial ? 3:1;


        //Se añade a la escena y a las físicas
        scene.add.existing(this);
        scene.physics.add.existing(this);


        this.setOrigin(0.5, 1); //El punto de referencia es el pie de la moneda
        this.setDepth(y);
        this.play(especial ? 'moneda_especial_brillo' : 'moneda_brillo');
    }

    recoger(){
        this.body.enable = false; //desactivamos la colisión

        //Pequeña animación
        this.scene.tweens.add({
            targets: this,
            y: this.y - 6,
            alpha: 0,
            duration: 200,
            onComplete: () => this.destroy()
        });
    }



}