import Phaser from 'phaser';

const VELOCIDAD = 25;          //Más lento que los robots para que se pueda esquivar
const DURACION_VIDA = 8000;    //Milisegundos antes de desaparecer solo


export class Ghost extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y){
        super(scene, x, y, 'fantasma');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setAlpha(0);
        this.activo = false;//No hace daño ni se mueve hasta terminar de aparecer
        this.desapareciendo = false;
        
        //Aparece con un fundido
        scene.tweens.add({
            targets: this,
            alpha: 0.85,//Algo transparente, que para eso es un fantasma
            duration: 600,
            onComplete: () => { this.activo = true; }
        });

        //Pasado su tiempo de vida, se va
        scene.time.delayedCall(DURACION_VIDA, () => this.desaparecer());
    }


    perseguir(jugadores){
        if (!this.activo) return;

        //Elegimos el robot más cercano
        const distancia = (j) => Phaser.Math.Distance.Between(this.x, this.y, j.sprite.x, j.sprite.y);
        const objetivo = jugadores.reduce((a, b) => distancia(a) < distancia(b) ? a : b);

        //moveToObject calcula la velocidad necesaria para ir hacia el objetivo
        this.scene.physics.moveToObject(this, objetivo.sprite, VELOCIDAD);

        this.setFlipX(this.body.velocity.x < 0);//Mira hacia donde va
        this.setDepth(this.y);
    }


    desaparecer(){
        //Puede llamarse dos veces (tocado y fin de vida), o después de destruido
        if (!this.scene || this.desapareciendo) return;
        this.desapareciendo = true;
        this.activo = false;
        this.setVelocity(0, 0);

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 400,
            onComplete: () => this.destroy()
        });
    }
}
