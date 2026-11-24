import Phaser from 'phaser';

//Datos de cada robot dentro del spritesheet
const ROBOTS = {
    velox : {animacion: 'velox_andar', frameQuieto: 4},
    flashy: {animacion: 'flashy_andar', frameQuieto: 0}
};

export class Player{
    constructor(scene, id, x, y, teclas, robot){
        this.scene = scene;
        this.id = id;
        this.puntos = 0;
        this.velocidad = 80;
        this.robot = ROBOTS[robot];

        this.sprite = scene.physics.add.sprite(x, y, 'robots', this.robot.frameQuieto);

        this.sprite.setOrigin(0.5, 1); //El punto de referencia es el pie del robot


        //Vista cenital: solo los pies se chocan con las barreras, el resto del sprite puede atravesarlas para taparlas
        this.sprite.body.setSize(12, 6);
        this.sprite.body.setOffset(6, 30);
        this.sprite.setCollideWorldBounds(true); //no se sale del mapa


        this.teclas = scene.input.keyboard.addKeys(teclas);
    }

    update(){
        //Dirección
        let dX = 0;
        let dY = 0;
        if (this.teclas.izquierda.isDown) dX -= 1;
        if (this.teclas.derecha.isDown)   dX += 1;
        if (this.teclas.arriba.isDown)    dY -= 1;
        if (this.teclas.abajo.isDown)     dY += 1;



        //Normalizar
        const direccion = new Phaser.Math.Vector2(dX, dY).normalize();
        this.sprite.setVelocity(direccion.x * this.velocidad, direccion.y * this.velocidad);

        if(dX !== 0 || dY !== 0){
            this.sprite.anims.play(this.robot.animacion, true);
        } else {
            this.sprite.anims.stop();
            this.sprite.setFrame(this.robot.frameQuieto);
        }
    

    //Profundidad según la altura para que los robots se tapen entre sí
    this.sprite.setDepth(this.sprite.y);
    }

    sumarPuntos(cantidad){
        this.puntos += cantidad;
    }
}


