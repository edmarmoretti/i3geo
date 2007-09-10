/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */
/**
 * @class a DragDrop implementation that moves the object as it is being dragged,
 * and keeps the object being dragged on top.  This is a subclass of DD rather
 * than DragDrop, and inherits the implementation of most of the event listeners
 * from that class.
 *
 * @extends YAHOO.util.DD
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop items
 */
YAHOO.example.DDOnTop = function(id, sGroup, config) {if (id) {this.init(id, sGroup, config);this.logger = this.logger || YAHOO;}};
YAHOO.extend(YAHOO.example.DDOnTop, YAHOO.util.DD);
YAHOO.example.DDOnTop.prototype.origZ = 0;
YAHOO.example.DDOnTop.prototype.startDrag = function(x, y) {this.logger.log(this.id + " startDrag");var style = this.getEl().style;this.origZ = style.zIndex;style.zIndex = 3000;};
YAHOO.example.DDOnTop.prototype.endDrag = function(e) {this.logger.log(this.id + " endDrag");this.getEl().style.zIndex = this.origZ;};
