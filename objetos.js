var PI = 3.141593;

function MoverObjeto(objeto, x, y) {
	objeto.x += x; // Las ultimas cuatro lineas evitan que
	objeto.y += y; // el objeto se salga de la pantalla
	if (objeto.x + objeto.ancho * 0.5 > 630) objeto.x = 630 - objeto.ancho * 0.5;
	if (objeto.x - objeto.ancho * 0.5 < 10) objeto.x = 10 + objeto.ancho * 0.5;
	if (objeto.y + objeto.alto * 0.5 > 470) objeto.y = 470 - objeto.alto * 0.5;
	if (objeto.y - objeto.alto * 0.5 < 10) objeto.y = 10 + objeto.alto * 0.5;
}

function Colision(objeto1, objeto2) {
	var margenx1 = objeto1.ancho*0.35;
	var margenx2 = objeto2.ancho*0.35;
	var margeny1 = objeto1.alto*0.35;
	var margeny2 = objeto2.alto*0.35;
	if(objeto1.x+margenx1 > objeto2.x-margenx2 && objeto1.x-margenx1 < objeto2.x+margenx2)
		if(objeto1.y+margeny1 > objeto2.y-margeny2 && objeto1.y-margeny1 < objeto2.y+margeny2)
			return(1);
	return(0);
}

function GirarObjeto(objeto, angulo)
{
	objeto.angulo+=angulo;
}

function AvanzarObjeto(objeto)
{
	var cosT = Math.cos(window.PI*(objeto.angulo-90)/180);
	var sinT = Math.sin(window.PI*(objeto.angulo-90)/180);
	MoverObjeto(objeto, cosT*objeto.velocidad, sinT*objeto.velocidad);
}

function CrearObjeto(objeto, bitmap, cuadro, xinicial, yinicial, ancho, alto, angulo, velocidad)
{
	objeto.x = xinicial;
	objeto.y = yinicial;
	objeto.alto = alto;
	objeto.ancho = ancho;
	objeto.velocidad = velocidad;
	objeto.angulo = angulo;
    
    var file = document.getElementById(bitmap);
    objeto.cuadros = file.height / alto;
    var auxCanvas = document.getElementById("auxCanvas");
    if(!auxCanvas) {
        auxCanvas = document.createElement("canvas");
        auxCanvas.id = "auxCanvas";
    }
    auxCanvas.style.width = auxCanvas.width = file.width;
    auxCanvas.style.height = auxCanvas.height = file.height;
	var auxContext = auxCanvas.getContext("2d");
    auxContext.drawImage(document.getElementById(bitmap), 0, 0, file.width, file.height);
	objeto.archivo = auxContext.getImageData(0, 0, file.width, file.height);
    objeto.imagen = window.context.createImageData(objeto.ancho, objeto.alto);
    CambiarCuadro(objeto, cuadro);
}

function CambiarCuadro(objeto, cuadro)
{
    cuadro = objeto.cuadros - 1 - cuadro;
	objeto.imagen.data.set(objeto.archivo.data.subarray(cuadro * objeto.alto * objeto.ancho * 4, (cuadro+1) * objeto.alto * objeto.ancho * 4));
}

function DibujarObjeto(objeto)
{
	var x, y, x1, y1, coordx, coordy, centrox, centroy;
	var cosT = Math.cos(PI*objeto.angulo/180);
	var sinT = Math.sin(PI*objeto.angulo/180);
	centrox=objeto.ancho>>1;
	centroy=objeto.alto>>1;
	coordx=Math.floor(objeto.x-centrox);
	coordy=Math.floor(objeto.y-centroy);
	window.AgregarBuffer(objeto.ancho, objeto.alto, coordx, coordy);
    var data = objeto.imagen.data;
	for (y = 0 ; y < objeto.alto ; y++)
		for (x = 0; x < objeto.ancho; x++) {
			x1 = Math.floor(( x - centrox ) * cosT + ( y - centroy ) * sinT);
            y1 = Math.floor(( y - centroy ) * cosT - ( x - centrox ) * sinT);
            x1 = Math.floor(x1 + objeto.ancho * 0.5);
            y1 = Math.floor(y1 + objeto.alto * 0.5);
            var offset = x1 * 4 + y1 * 4 * objeto.ancho;
			if(x1 > 0 && y1 > 0 && x1 < objeto.ancho && y1 < objeto.alto && (data[offset+0] || data[offset+1] || data[offset+2]))
				window.Pixel(x+coordx,y+coordy,
                    data[offset+0],
                    data[offset+1],
                    data[offset+2],
                    data[offset+3]
                );
		}
}
