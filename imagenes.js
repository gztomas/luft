var indice = [0, 0];
var borradorpag = [[], []];
var BUFFER = function() {
    this.x = 0;
    this.y = 0;
    this.ancho = 0;
    this.alto = 0;
    this.direccion = 0;
};

borradorpag[0] = {
}


function DibujarBitmap(nombre, ancho, alto)
{
	window.context.drawImage(document.getElementById(nombre), 0, 0);
	var fp = window.context.getImageData(0,0, ancho, alto);
	var i,j;
	for(i=alto-1;i>=0;i--)
		for(j=0;j<ancho;j++)
			window.Pixel(j,i,fp.data[j*4+i*4*ancho+0], fp.data[j*4+i*4*ancho+1], fp.data[j*4+i*4*ancho+2], fp.data[j*4+i*4*ancho+3]);
}

function BorrarObjetos() {
	var i,x,y;
	for(i=(indice[window.pantalla_activa]-1);i>=0;i--) {
        var borrador = borradorpag[window.pantalla_activa][i];
        for(y=0;y<borrador.alto;y++)
			for(x=0;x<borrador.ancho;x++) {
                var offset = x * 4 + y * 4 * borrador.ancho;
				window.Pixel(x + borrador.x, y + borrador.y,
                    borrador.direccion[offset+0],
                    borrador.direccion[offset+1],
                    borrador.direccion[offset+2],
                    borrador.direccion[offset+3]
                );
			}
	}
	indice[window.pantalla_activa]=0;
}

function AgregarBuffer(ancho, alto, X, Y)
{
	var x,y,i;

	i=indice[pantalla_activa];
    if(!borradorpag[pantalla_activa][i])
        borradorpag[pantalla_activa][i] = new BUFFER();        
	borradorpag[pantalla_activa][i].direccion = new Uint8ClampedArray(ancho*alto*4);
	borradorpag[pantalla_activa][i].x=X;
	borradorpag[pantalla_activa][i].y=Y;
	borradorpag[pantalla_activa][i].ancho=ancho;
	borradorpag[pantalla_activa][i].alto=alto;
	for(y=0;y<alto;y++)
		for(x=0;x<ancho;x++) {
			borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+0] = ColorPixel(x+X,y+Y).r;
            borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+1] = ColorPixel(x+X,y+Y).g;
            borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+2] = ColorPixel(x+X,y+Y).b;
            borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+3] = ColorPixel(x+X,y+Y).a;
		}
	indice[pantalla_activa]++;
}