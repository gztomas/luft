//A continuacion se definen las posiciones en las que se encuntra la
//informacion de la imagen y la paleta de colores en un archivo BMP
var COMIENZO_IMAGEN = 1078;
var INICIO_PALETA = 54;
var PALETA = "paleta.BMP";

// Definicion de tipos de errores
var ERR_MEMORIA = 0;
var ERR_ARCHIVO = 1;

//Definiciones de codigos de teclado
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_ENTER = 13;
var KEY_RSHIFT = 16;
var KEY_CONTROL = 17;
var KEY_ESC = 27;
var KEY_Q = 81;
var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;

var PI = 3.141593;

var buf0, buf1;

//Macro que sirve para realizar el cambio de pantalla activa
function ActivarPantalla(p) { pantalla_activa = (p==1 || p==0) ? p : -1}

function OBJETO() // Es la estructura mas utilizada en el programa.
{             // Las naves, los disparos, las animaciones, son struct OBJETO
//	WORD x,y;  // Posicion en pantalla
//	WORD alto, ancho; // Tama�o
//	BYTE * imagen;  // Direccion en donde se encuentra la imagen asociada
//	FILE * archivo; // Archivo del que se extraeran secuencias de imagenes
//	float angulo, velocidad; // Utilizados para el movimiento del objeto
}

function BUFFER()  // Sirve para almacenar temporalmente imagenes obtenidas de
{              // la pantalla
//	WORD ancho, alto;
//	WORD x,y;
//	BYTE * direccion;
}