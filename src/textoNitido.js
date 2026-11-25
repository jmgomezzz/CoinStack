import Phaser from 'phaser';

//Los textos se dibujan con suavizado (bordes semitransparentes) y, al escalar el juego,
//esos bordes se ven como una sombra borrosa. Aquí quitamos el suavizado a todos los textos:
//cada píxel queda o totalmente visible o totalmente transparente, como en el pixel art.

const updateTextOriginal = Phaser.GameObjects.Text.prototype.updateText;

Phaser.GameObjects.Text.prototype.updateText = function (){
    updateTextOriginal.call(this);

    const canvas = this.canvas;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return this;

    //Recorremos los píxeles: si son más de medio visibles, opacos; si no, invisibles
    const imagen = this.context.getImageData(0, 0, canvas.width, canvas.height);
    const datos = imagen.data;
    for (let i = 3; i < datos.length; i += 4){
        datos[i] = datos[i] >= 128 ? 255 : 0;
    }
    this.context.putImageData(imagen, 0, 0);

    //En WebGL hay que volver a subir la textura con los píxeles nuevos
    if (this.renderer && this.renderer.gl){
        this.frame.source.glTexture = this.renderer.canvasToTexture(canvas, this.frame.source.glTexture, true);
    }

    return this;
};
