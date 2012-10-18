var paleta = [];

var pantalla_visible=0;
var pantalla_activa=0;
var pixel;
var pixelData;

function Pixel(x, y, r, g, b, a)
{
	(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 0] = r;
	(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 1] = g;
	(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 2] = b;
	(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 3] = a;
}

function ColorPixel(x, y) // Devuelve el color de un pixel
{
	return {
        r: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+0],
        g: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+1],
        b: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+2],
        a: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+3]
	}
}

function VerPantalla(pantalla)
{
	if(pantalla)
		context.putImageData(buf1, 0, 0);
	else
		context.putImageData(buf0, 0, 0);
	pantalla_visible = pantalla;
}