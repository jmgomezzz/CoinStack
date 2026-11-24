//Cambia la música de fondo, si ya está sonando la misma no hace nada
//(así no se reinicia al pasar del menú a la ayuda y volver)
export function reproducirMusica(scene, clave, bucle = true){
    const actual = scene.registry.get('musicaActual');
    if (actual && actual.key === clave && actual.isPlaying) return;
    if (actual) actual.stop();

    const musica = scene.sound.add(clave, { loop: bucle, volume: 0.5 });
    musica.play();
    scene.registry.set('musicaActual', musica);
}
