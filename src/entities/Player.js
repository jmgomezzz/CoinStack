import Phaser from 'phaser';

//Datos de cada robot dentro del spritesheet
const ROBOTS = {
    velox : {animacion: 'velox_andar', frameQuieto: 4},
    flashy: {animacion: 'flashy_andar', frameQuieto: 0}
};
//Realentización arbusto
const FACTOR_ARBUSTO = 0.5;

export class Player{
    constructor(scene, id, x, y, teclas, robot){
        this.scene = scene;
        this.id = id;
        this.puntos = 0;
        this.baterias = 0;
        this.sobrecargaActiva = false; 
        this.velocidad = 80;
        this.robot = ROBOTS[robot];
        this.aturdido = false;
        this.enArbusto = false;

        this.sprite = scene.physics.add.sprite(x, y, 'robots', this.robot.frameQuieto);

        this.sprite.setOrigin(0.5, 1); //El punto de referencia es el pie del robot


        //Vista cenital: solo los pies se chocan con las barreras, el resto del sprite puede atravesarlas para taparlas
        this.sprite.body.setSize(12, 6);
        this.sprite.body.setOffset(6, 30);
        this.sprite.setCollideWorldBounds(true); //no se sale del mapa


        this.teclas = scene.input.keyboard.addKeys(teclas);
    }

    update(){
        //Aturdido: no se puede mover ni hacer nada
        if (this.aturdido){
            this.sprite.setVelocity(0, 0);
            this.sprite.anims.stop();
            this.sprite.setFrame(this.robot.frameQuieto);
            this.sprite.setDepth(this.sprite.y);
            return;
        }
        //JustDown = solo en el instante en el que se pulse
        if (Phaser.Input.Keyboard.JustDown(this.teclas.sobrecarga)){
        this.activarSobrecarga();
        }

        //Dirección
        let dX = 0;
        let dY = 0;
        if (this.teclas.izquierda.isDown) dX -= 1;
        if (this.teclas.derecha.isDown)   dX += 1;
        if (this.teclas.arriba.isDown)    dY -= 1;
        if (this.teclas.abajo.isDown)     dY += 1;



        //Normalizar
        const direccion = new Phaser.Math.Vector2(dX, dY).normalize();

        //Si está en arbusto va más lento
        const velocidad = this.enArbusto ? this.velocidad * FACTOR_ARBUSTO : this.velocidad;
        this.sprite.setVelocity(direccion.x * velocidad, direccion.y * velocidad);
        this.sprite.anims.timeScale = this.enArbusto ? 0.5 : 1;

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
        if (this.sobrecargaActiva && cantidad > 0){
            cantidad *= 2;
        }
        const antes = this.puntos;
        this.puntos = Math.max(0, this.puntos + cantidad);
        return this.puntos - antes;    
    }

    recogerBateria(){
        //Con 4 ya está lleno, no la cogemos y se queda en el mapa para el rival
        if (this.baterias >= 4) return false;
        this.baterias++;
        this.scene.events.emit('baterias', this.id, this.baterias);
        return true;    
    }

    activarSobrecarga(){
        if (this.baterias < 4 || this.sobrecargaActiva) return;

        this.sobrecargaActiva = true;
        this.baterias = 0;
        this.scene.events.emit('baterias', this.id, 0);
        this.scene.events.emit('sobrecarga', this.id, true);
        this.scene.textoFlotante(this.sprite.x, this.sprite.y - 40, '¡SOBRECARGA!', '#ffc20e');
        this.scene.sound.play('sobrecarga');

        //Brilla en amarillo mientras dura
        this.sprite.setTint(0xfff9bd);
        this.brillo = this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.6,
            duration: 150,
            yoyo: true,
            repeat: -1
        });

        //10 secs
        this.scene.time.delayedCall(10000, () => this.terminarSobrecarga());
    }
    terminarSobrecarga(){
        if (!this.sobrecargaActiva) return;
        this.sobrecargaActiva = false;
        this.brillo.stop();
        this.sprite.setAlpha(1);
        if (this.aturdido) this.sprite.setTint(0x8888ff);
        else this.sprite.clearTint();
        this.scene.events.emit('sobrecarga', this.id, false);
    }
    aturdir(duracion){
        //Si ya estaba aturdido, solo reiniciamos el tiempo
        if (this.finAturdido) this.finAturdido.remove();
        this.finAturdido = this.scene.time.delayedCall(duracion, () => this.recuperarse());
        if (this.aturdido) return;

        this.aturdido = true;
        this.sprite.setTint(0x8888ff);//Azulado para diferenciarlo de sobrecarga

        //Se tambalea sobre sus pies (el origen está abajo)
        this.tambaleo = this.scene.tweens.add({
            targets: this.sprite,
            angle: { from: -10, to: 10 },
            duration: 150,
            yoyo: true,
            repeat: -1
        });
    }

    recuperarse(){
        if (!this.aturdido) return;
        this.aturdido = false;
        this.tambaleo.stop();
        this.sprite.setAngle(0);
        //Si seguía en sobrecarga, recupera su brillo amarillo
        if (this.sobrecargaActiva) this.sprite.setTint(0xfff9bd);
        else this.sprite.clearTint();
    }


}


