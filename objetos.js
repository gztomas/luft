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
	var cosT = cos(PI*(objeto.angulo-90)/180);
	var sinT = sin(PI*(objeto.angulo-90)/180);
	MoverObjeto(objeto, cosT*objeto.velocidad, sinT*objeto.velocidad);
}

function CrearObjeto(objeto, bitmap, cuadro, xinicial, yinicial, ancho, alto, angulo, velocidad)
{
	var x,y;
	objeto.x = xinicial;
	objeto.y = yinicial;
	objeto.alto = alto;
	objeto.ancho = ancho;
	objeto.velocidad = velocidad;
	objeto.angulo = angulo;
	context.drawImage(document.getElementById(bitmap), 0, 0);
	objeto.archivo = context.getImageData(0,0, ancho, alto);
	objeto.imagen = context.getImageData(0,cuadro*alto, ancho, alto);
}

function CambiarCuadro(objeto, cuadro)
{
	var x,y;
	var ancho=objeto.ancho, alto=objeto.alto;
	objeto.imagen.set(objeto.archivo, cuadro * alto * ancho * 4);
}

function DibujarObjeto(objeto)
{
	var x, y, x1, y1, coordx, coordy, centrox, centroy;
	var cosT = cos(3.141593*objeto.angulo/180);
	var sinT = sin(3.141593*objeto.angulo/180);
	centrox=objeto.ancho>>1;
	centroy=objeto.alto>>1;
	coordx=objeto.x-centrox;
	coordy=objeto.y-centroy;
	AgregarBuffer(objeto.ancho, objeto.alto, coordx, coordy);
	for (y = 0 ; y < objeto.alto ; y++)
		for (x = 0; x < objeto.ancho; x++)
		{
			x1 = ( x - centrox ) * cosT + ( y - centroy ) * sinT;
			y1 = ( y - centroy ) * cosT - ( x - centrox ) * sinT;
			x1 = x1 + objeto.ancho * 0.5;
			y1 = y1 + objeto.alto * 0.5;
			if (x1>0 && y1>0 && x1<objeto.ancho && y1<objeto.alto && objeto.imagen[x1+y1*objeto.ancho])
				Pixel(x+coordx,y+coordy,objeto.imagen[x1+y1*objeto.ancho]);
		}
}
