import Phaser from 'phaser';

const ESTILO = { fontFamily: 'Pixel', fontSize: '8px', color: '#ffffff' };
const COLOR_PILA_VACIA = 0x333333;
const COLOR_PILA_LLENA = 0xffc20e;


export class HUDScene extends Phaser.Scene {
    constructor(){
        super('HUDScene');
    }

    create(){
        this.input.on('gameobjectdown', () => this.sound.play('clic')); //Sonido al pulsar cualquier botón
        
        //Referencia a la escena del juego para escuchar sus eventos
        this.juego = this.scene.get('GameScene');

        //Temporizador (arriba, centro)
        this.add.rectangle(160, 7, 44, 12, 0x000000, 0.7).setStrokeStyle(1, 0xffffff);
        this.textoTiempo = this.add.text(160, 8, '', { ...ESTILO, color: '#ed1c24' }).setOrigin(0.5);

        //Botón de pausa (arriba a la derecha)
        this.botonPausa = this.add.image(308, 8, 'boton_pausa')
            .setDisplaySize(12, 11)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.botonPausa.setTint(0xffc20e))
            .on('pointerout', () => this.botonPausa.clearTint())
            .on('pointerdown', () => this.juego.pausar());

        //Paneles de cada jugador (abajo a cada lado)
        this.paneles = {
            j1: this.crearPanel(4, 'icono_velox', false),
            j2: this.crearPanel(316, 'icono_flashy', true)
        };

        //Valores iniciales: los leemos directamente, porque cuando GameScene los emitió esta escena todavía no estaba creada
        this.actualizarTiempo(this.juego.tiempoRestante);
        this.juego.jugadores.forEach(j => this.actualizarPuntos(j.id, j.puntos));

        //Escuchar los eventos del juego
        this.juego.events.on('tiempo', this.actualizarTiempo, this);
        this.juego.events.on('puntos', this.actualizarPuntos, this);
        this.juego.events.on('baterias', this.actualizarBaterias, this);
        this.juego.events.on('sobrecarga', this.actualizarSobrecarga, this);

        //Al cerrarse el HUD dejamos de escuchar (si no, en la revancha se duplicarían)
        this.events.once('shutdown', () => {
            this.juego.events.off('tiempo', this.actualizarTiempo, this);
            this.juego.events.off('puntos', this.actualizarPuntos, this);
            this.juego.events.off('baterias', this.actualizarBaterias, this);
            this.juego.events.off('sobrecarga', this.actualizarSobrecarga, this);
        });
    }

    crearPanel(x, icono, derecha){
        //dir = 1 el panel crece hacia la derecha, -1 hacia la izquierda
        const dir = derecha ? -1 : 1;
        const y = 168;

        this.add.circle(x + dir * 10, y, 11, 0xffc20e, 0.8);   //círculo de fondo como en el boceto
        this.add.image(x + dir * 10, y, icono).setDisplaySize(20, 20);

        const texto = this.add.text(x + dir * 24, y - 4, '000', ESTILO)
            .setOrigin(derecha ? 1 : 0, 0.5);

        //4 pilas para la sobrecarga
        const pilas = [];
        for (let i = 0; i < 4; i++){
            const pila = this.add.rectangle(x + dir * (24 + i * 7), y + 6, 5, 5, COLOR_PILA_VACIA)
                .setOrigin(derecha ? 1 : 0, 0.5)
                .setStrokeStyle(1, 0x000000);
            pilas.push(pila);
        }
        const x2 = this.add.text(x + dir * 24, y - 14, 'x2', { ...ESTILO, color: '#ffc20e' })
        .setOrigin(derecha ? 1 : 0, 0.5)
        .setVisible(false);

        return { texto, pilas, x2 };
    }


    actualizarTiempo(segundos){
        const min = Math.floor(segundos / 60);
        const seg = String(segundos % 60).padStart(2, '0');
        this.textoTiempo.setText(min + ':' + seg);

        //Últimos 10 segundos el reloj late para meter tensión
        if (segundos <= 10 && segundos > 0){
            this.tweens.add({
                targets: this.textoTiempo,
                scale: 1.4,
                duration: 120,
                yoyo: true
            });
        }
    }


    actualizarPuntos(id, puntos){
        const texto = puntos < 0 ? String(puntos) : String(puntos).padStart(3, '0');
        this.paneles[id].texto.setText(texto);
    }

    actualizarBaterias(id, cantidad){
        const panel = this.paneles[id];
        panel.pilas.forEach((pila, i) => {
            pila.setFillStyle(i < cantidad ? COLOR_PILA_LLENA : COLOR_PILA_VACIA);
        });

        //Con 4 pilas parpadean para avisar de que se puede activar
        if (panel.parpadeo){
            panel.parpadeo.stop();
            panel.pilas.forEach(p => p.setAlpha(1));
            panel.parpadeo = null;
        }
        if (cantidad === 4){
            panel.parpadeo = this.tweens.add({
                targets: panel.pilas,
                alpha: 0.3,
                duration: 200,
                yoyo: true,
                repeat: -1
            });
        }
    }
    actualizarSobrecarga(id, activa){
    this.paneles[id].x2.setVisible(activa);
    }
    
}