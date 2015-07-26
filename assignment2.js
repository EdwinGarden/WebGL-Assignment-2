"use strict";

var _canvas;
var _gl;

var _maxNumVertices  = 2000;
var _index = 0;
var _mouseIsDown = false;
var _points = [];

var _lines = [];
var _lineStart = 0;
var _lineEnd = 0;
var _uColorLocation = null;
var _lineColor = [];


var cIndex = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


window.onload = function init() {
    _canvas = document.getElementById( "gl-canvas" );

    _gl = WebGLUtils.setupWebGL( _canvas );
    if ( !_gl ) { alert( "WebGL isn't available" ); }

    _gl.viewport( 0, 0, _canvas.width, _canvas.height );
    _gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    _gl.clear( _gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( _gl, "vertex-shader", "fragment-shader" );
    _gl.useProgram( program );


    var vBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, vBuffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, 8*_maxNumVertices, _gl.STATIC_DRAW);

    var vPosition = _gl.getAttribLocation( program, "vPosition");
    _gl.vertexAttribPointer(vPosition, 2, _gl.FLOAT, false, 8, 0);
    _gl.enableVertexAttribArray(vPosition);
	
	_uColorLocation = _gl.getUniformLocation(program, "uColor");

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function() 
	{
       cIndex = m.selectedIndex;
    });
		
		
	_canvas.addEventListener("mousedown", function(event)	
	{
		//// get first vertex point
		_gl.bindBuffer(_gl.ARRAY_BUFFER, vBuffer);
		var point = vec2(2*event.clientX/_canvas.width-1,
					2*(_canvas.height-event.clientY)/_canvas.height-1);
					
		_points.push(point);
		
		_gl.bufferSubData(_gl.ARRAY_BUFFER, 8*_index, flatten(point));
		
		_lineStart = _index;
		
		_index++;
				
		_mouseIsDown = true;
	});
	
	_canvas.addEventListener("mouseup", function(event)
	{		
		_mouseIsDown = false;
	});
	
	_canvas.addEventListener("mousemove", function(event)
	{
		if (_mouseIsDown) // add vertex _points & render
		{
			var point = vec2(2*event.clientX/_canvas.width-1,
			2*(_canvas.height-event.clientY)/_canvas.height-1);
			
			_points.push(point);
			
			_gl.bufferSubData(_gl.ARRAY_BUFFER, 8*_index, flatten(point));
			
			var t = vec4(colors[cIndex]);

			_lineEnd = _index;
			
			var lineSegment = new vec2(_lineStart, _lineEnd);
			_lines.push(lineSegment);
			
			_lineColor.push(t);
			
			_index++;
			
			render();
		}
	});

}


function render() {

    _gl.clear( _gl.COLOR_BUFFER_BIT );

	// draw lines
	for (var i = 0; i < _lines.length; i++)
	{
		var segment = _lines[i];
		
		var t = _lineColor[i];
		_gl.uniform4f(_uColorLocation, t[0], t[1], t[2], t[3], t[4]);

		_gl.drawArrays(_gl.LINE_STRIP, segment[0]+1, (segment[1] - segment[0]));
	}

    window.requestAnimFrame(render);

}
