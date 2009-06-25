/*----------------------------------------------------------------------------
 VMLRENDERER 1.0
 VML Renderer For RichDraw
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of VML based renderer.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies:
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/


function VMLRenderer() {
	this.base = AbstractRenderer;
}


VMLRenderer.prototype = new AbstractRenderer;


VMLRenderer.prototype.init = function(elem) {
  this.container = elem;
  
  this.container.style.overflow = 'hidden';
  
	// Add VML includes and namespace
  elem.ownerDocument.namespaces.add("v", "urn:schemas-microsoft-com:vml");

	var style = elem.ownerDocument.createStyleSheet();
	style.addRule('v\\:*', "behavior: url(#default#VML);");
};


VMLRenderer.prototype.bounds = function(shape) {
  var rect = new Object();
  rect['x'] = shape.offsetLeft;
  rect['y'] = shape.offsetTop;
  rect['width'] =  shape.offsetWidth;
  rect['height'] = shape.offsetHeight;
  return rect;
};


VMLRenderer.prototype.create = function(shape, fillColor, lineColor, lineWidth, left, top, width, height, texto) {
  var vml;
  if (shape == 'rect') {
    vml = this.container.ownerDocument.createElement('v:rect');
  }
  else if (shape == 'roundrect') {
    vml = this.container.ownerDocument.createElement('v:roundrect');
  }
  else if (shape == 'ellipse') {
    vml = this.container.ownerDocument.createElement('v:oval');
  }
  else if (shape == 'circ') {
	vml = this.container.ownerDocument.createElement('v:oval');
  }
  else if (shape == 'line') {
    vml = this.container.ownerDocument.createElement('v:line');
  }
  else if (shape == 'text') {
    vml = this.container.ownerDocument.createElement('v:textbox');
    vml.innerHTML = texto;
  }

  if (shape != 'line') {  
    vml.style.position = 'absolute';
    vml.style.left = left;
    vml.style.top = top;
    vml.style.width = width;
    vml.style.height = height;

    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
    }
    else {
      vml.setAttribute('filled', 'false');
    }
  }
  else {
    vml.style.position = 'absolute';
    vml.setAttribute('from', left + 'px,' + top + 'px');
    vml.setAttribute('to', width + 'px,' + height + 'px');
  }

  if (lineColor != '') {
    vml.setAttribute('stroked', 'true');
    vml.setAttribute('strokecolor', lineColor);
    vml.setAttribute('strokeweight', lineWidth);
  }
  else {
    vml.setAttribute('stroked', 'false');
  }

  this.container.appendChild(vml);
  return vml;
};


VMLRenderer.prototype.remove = function(shape) {
  shape.removeNode(true);
};


VMLRenderer.prototype.move = function(shape, left, top) {
  if (shape.tagName == 'line') {
    shape.style.marginLeft = left;
    shape.style.marginTop = top;
  }
  else {
    shape.style.left = left;
    shape.style.top = top;
  }
};


VMLRenderer.prototype.track = function(shape) {
  // TODO
};


VMLRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {
  shape.setAttribute('to', toX + 'px,' + toY + 'px');
  /*
  var deltaX = toX - fromX;
  var deltaY = toY - fromY;
  if (shape.tagName == 'line') {
	shape.setAttribute('to', toX + 'px,' + toY + 'px');
  }
  else {
    if (deltaX < 0) {
      shape.style.left = toX + 'px';
      shape.style.width = -deltaX + 'px';
    }
    else {
      shape.style.width = deltaX + 'px';
    } 
    if (deltaY < 0) {
      shape.style.top = toY + 'px';
      shape.style.height = -deltaY + 'px';
    }
    else {
      shape.style.height = deltaY + 'px';
    }
  }
  */
};

VMLRenderer.prototype.editCommand = function(shape, cmd, value)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (value != '') {
        shape.filled = 'true';
        shape.fillcolor = value;
      }
      else {
        shape.filled = 'false';
        shape.fillcolor = '';
      }
    }
    else if (cmd == 'linecolor') {
      if (value != '') {
        shape.stroked = 'true';
        shape.strokecolor = value;
      }
      else {
        shape.stroked = 'false';
        shape.strokecolor = '';
      }
    }
    else if (cmd == 'linewidth') {
      shape.strokeweight = parseInt(value) + 'px';
    }
  }
};


VMLRenderer.prototype.queryCommand = function(shape, cmd)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (shape.filled == 'false')
        return '';
      else
        return shape.fillcolor;
    }
    else if (cmd == 'linecolor') {
      if (shape.stroked == 'false')
        return '';
      else
        return shape.strokecolor;
    }
    else if (cmd == 'linewidth') {
      if (shape.stroked == 'false') {
        return '';
      }
      else {
        // VML always transforms the pixels to points, so we have to convert them back
        return (parseFloat(shape.strokeweight) * (screen.logicalXDPI / 72)) + 'px';
      }
    }
  }
};


VMLRenderer.prototype.showTracker = function(shape) {
  var box = this.bounds(shape);

  var tracker = document.getElementById('tracker');
  if (tracker) {
    this.remove(tracker);
  }

  tracker = this.container.ownerDocument.createElement('v:rect');
  tracker.id = 'tracker';
  tracker.style.position = 'absolute';
  tracker.style.left = box.x - 10;
  tracker.style.top = box.y - 10;
  tracker.style.width = box.width + 20;
  tracker.style.height = box.height + 20;
  tracker.setAttribute('filled', 'false');
  tracker.setAttribute('stroked', 'true');
  tracker.setAttribute('strokecolor', 'blue');
  tracker.setAttribute('strokeweight', '1px');
  this.container.appendChild(tracker);
};


VMLRenderer.prototype.getMarkup = function() {
  return this.container.innerHTML;
};
