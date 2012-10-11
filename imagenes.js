var indice = [];
var borradorpag = [];

function DibujarBitmap(nombre, ancho, alto)
{
	context.drawImage(document.getElementById(nombre), 0, 0, ancho, alto, 0, 0, 640, 480);
	var fp = context.getImageData(0,0, ancho, alto);
	var i,j;
	for(i=alto-1;i>=0;i--)
		for(j=0;j<ancho;j++)
			Pixel(j,i,fp[j*4+i*4*ancho+0], fp[j*4+i*4*ancho+1], fp[j*4+i*4*ancho+2], fp[j*4+i*4*ancho+3]);
}

function BorrarObjetos()
{
	var i,x,y;

	for(i=(indice[pantalla_activa]-1);i>=0;i--)
	{
		for(y=0;y<borradorpag[pantalla_activa][i].alto;y++)
			for(x=0;x<borradorpag[pantalla_activa][i].ancho;x++)
				Pixel(x+borradorpag[pantalla_activa][i].x,y+borradorpag[pantalla_activa][i].y,borradorpag[pantalla_activa][i].direccion[x+y*borradorpag[pantalla_activa][i].ancho]);
		free(borradorpag[pantalla_activa][i].direccion);
	}
	indice[pantalla_activa]=0;
}

function AgregarBuffer(ancho, alto, X, Y)
{
	var x,y,i;

	i=indice[pantalla_activa];
	borradorpag[pantalla_activa][i].direccion = [];
	borradorpag[pantalla_activa][i].x=X;
	borradorpag[pantalla_activa][i].y=Y;
	borradorpag[pantalla_activa][i].ancho=ancho;
	borradorpag[pantalla_activa][i].alto=alto;
	for(y=0;y<alto;y++)
		for(x=0;x<ancho;x++)
			borradorpag[pantalla_activa][i].direccion[x+y*ancho] = ColorPixel(x+X,y+Y);
	indice[pantalla_activa]++;
}