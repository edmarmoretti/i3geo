/*-----------------------------------------------------------------------------
Copyright (C) 2006  Menko Kroeske

This file is part of Flamingo MapComponents.

Flamingo MapComponents is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-----------------------------------------------------------------------------*/
/**
var a = new FlamingoPushButton(createEmptyMovieClip("a",1),"bUp","bDown","bOver","bUp")
a.move(10,100)
a.addFunction("onPress",pressA)
c.addFunction("onRelease",releaseA)
function pressA(){
trace("pA")
}
function releaseA(){
trace("rA")	
}
*/
class FlamingoCheckButton extends MovieClip {
	private var mc:MovieClip;
	private var checkedlink:String;
	private var checkedoverlink:String;
	private var checkeddownlink:String;
	private var uncheckedlink:String;
	private var uncheckedoverlink:String;
	private var uncheckeddownlink:String;
	private var functions:Object;
	private var enabled:Boolean;
	private var checked:Boolean;
	private var applytarget:Object;
	function FlamingoCheckButton(mc:MovieClip, checkedlink:String, checkeddownlink:String, checkedoverlink:String, uncheckedlink:String, uncheckeddownlink:String, uncheckedoverlink:String, hitlink:String, target:Object, checked:Boolean) {
		if (mc == undefined) {
			return;
		}
		if (checkedlink == undefined) {
			return;
		}
		if (uncheckedlink == undefined) {
			return;
		}
		this.checkedlink = checkedlink;
		this.uncheckedlink = uncheckedlink;
		this.checkedoverlink = checkedoverlink;
		this.uncheckedoverlink = uncheckedoverlink;
		this.checkeddownlink = checkeddownlink;
		this.uncheckeddownlink = uncheckeddownlink;
		this.mc = mc;
		this.applytarget = target;
		if (this.checkedoverlink == undefined) {
			this.checkedoverlink = this.checkedlink;
		}
		if (this.uncheckedoverlink == undefined) {
			this.uncheckedoverlink = this.uncheckedlink;
		}
		if (this.checkeddownlink == undefined) {
			this.checkeddownlink = this.checkedlink;
		}
		if (this.uncheckeddownlink == undefined) {
			this.uncheckeddownlink = this.uncheckedlink;
		}
		if (this.applytarget == undefined) {
			this.applytarget = this.mc._parent;
		}
		if (hitlink == undefined) {
			mc.attachMovie(checkedlink, "hit", 0, {_alpha:0});
		} else {
			mc.attachMovie(hitlink, "hit", 0, {_alpha:0});
		}
		this.checked = checked;
		var hit:Boolean;
		var pressed:Boolean;
		if (this.checked) {
			mc.attachMovie(checkedlink, "skin", 1);
		} else {
			mc.attachMovie(uncheckedlink, "skin", 1);
		}
		mc.hit.useHandCursor = false;
		if (this.checked == undefined) {
			this.checked = false;
		}
		this.enabled = true;
		var thisObj = this;
		mc.hit.onDragOver = function() {
			if (thisObj.enabled) {
				if (pressed) {
					if (thisObj.checked) {
						mc.attachMovie(thisObj.checkeddownlink, "skin", 1);
					} else {
						mc.attachMovie(thisObj.uncheckeddownlink, "skin", 1);
					}
				}
				thisObj.fire("onDragOver");
			}
		};
		mc.hit.onDragOut = function() {
			if (thisObj.enabled) {
				if (thisObj.checked) {
					mc.attachMovie(thisObj.checkedoverlink, "skin", 1);
				} else {
					mc.attachMovie(thisObj.uncheckedoverlink, "skin", 1);
				}
				thisObj.fire("onDragOut");
			}
		};
		mc.hit.onRelease = function() {
			if (thisObj.enabled) {
				pressed = false;
				
				if (thisObj.checked) {
					mc.attachMovie(thisObj.checkedoverlink, "skin", 1);
				} else {
					mc.attachMovie(thisObj.uncheckedoverlink, "skin", 1);
				}
				thisObj.fire("onRelease");
			}
		};
		mc.hit.onReleaseOutside = function() {
			if (thisObj.enabled) {
				pressed = false;
				if (thisObj.checked) {
					mc.attachMovie(thisObj.checkedlink, "skin", 1);
				} else {
					mc.attachMovie(thisObj.uncheckedlink, "skin", 1);
				}
				thisObj.fire("onReleaseOutside");
			}
		};
		mc.hit.onRollOver = function() {
			if (thisObj.enabled) {
				hit = true;
				if (thisObj.checked) {
					mc.attachMovie(thisObj.checkedoverlink, "skin", 1);
				} else {
					mc.attachMovie(thisObj.uncheckedoverlink, "skin", 1);
				}
				thisObj.fire("onRollOver");
			}
		};
		mc.hit.onRollOut = function() {
			if (thisObj.enabled) {
				hit = false;
				if (thisObj.checked) {
					mc.attachMovie(thisObj.checkedlink, "skin", 1);
				} else {
					mc.attachMovie(thisObj.uncheckedlink, "skin", 1);
				}
				thisObj.fire("onRollOut");
			}
		};
		mc.hit.onPress = function() {
			if (thisObj.enabled) {
				pressed = true;
				thisObj.checked = not thisObj.checked;
				//thisObj.checked = not thisObj.checked;
				if (thisObj.checked) {
					mc.attachMovie(thisObj.checkeddownlink, "skin", 1);
				} else {
					mc.attachMovie(thisObj.uncheckeddownlink, "skin", 1);
				}
				thisObj.fire("onPress");
			}
		};
	}
	function setSkin(checkedlink:String, checkeddownlink:String, checkedoverlink:String, uncheckedlink:String, uncheckeddownlink:String, uncheckedoverlink:String) {
		if (checkedlink != undefined) {
			this.checkedlink = checkedlink;
		}
		if (checkeddownlink != undefined) {
			this.checkeddownlink = checkeddownlink;
		}
		if (checkedoverlink != undefined) {
			this.checkedoverlink = checkedoverlink;
		}
		if (uncheckedlink != undefined) {
			this.uncheckedlink = uncheckedlink;
		}
		if (uncheckeddownlink != undefined) {
			this.uncheckeddownlink = uncheckeddownlink;
		}
		if (uncheckedoverlink != undefined) {
			this.uncheckedoverlink = uncheckedoverlink;
		}
		if (this.checked) {
			this.mc.attachMovie(this.checkedlink, "skin", 1);
		} else {
			this.mc.attachMovie(this.uncheckedlink, "skin", 1);
		}
	}
	function setFunction(f:Function, eventname:String) {
		if (this.functions == undefined) {
			this.functions = new Object();
		}
		if (eventname == undefined) {
			eventname = "onpress";
		}
		this.functions[eventname.toLowerCase()] = f;
	}
	function move(x:Number, y:Number) {
		if (not isNaN(x)) {
			this.mc._x = x;
		}
		if (not isNaN(y)) {
			this.mc._y = y;
		}
	}
	function check() {
		if (arguments.caller != this.functions.onpress) {
			if (this.enabled) {
				this.checked = true;
				this.mc.attachMovie(this.checkedlink, "skin", 1);
				this.fire("onPress");
			}
		}
	}
	function uncheck() {
		if (arguments.caller != this.functions.onpress) {
			if (this.enabled) {
				this.checked = false;
				this.mc.attachMovie(this.uncheckedlink, "skin", 1);
				this.fire("onPress");
			}
		}
	}
	//function release() {
	//if (this.enabled) {
	//if (arguments.caller != this.functions.onrelease) {
	//this.pressed = false;
	//this.mc.attachMovie(this.uplink, "skin", 1);
	//this.fire("onRelease");
	//}
	//}
	//}
	function setChecked(b:Boolean) {
		this.checked = b;
		if (b) {
			this.mc.attachMovie(this.checkedlink, "skin", 1);
		} else {
			this.mc.attachMovie(this.uncheckedlink, "skin", 1);
		}
	}
	function setEnabled(b:Boolean) {
		if (not b) {
			var w = this.mc._width;
			var h = this.mc._height;
			var d = this.mc.createEmptyMovieClip("disable", 4);
			with (d) {
				beginFill(0xffffff, 70);
				moveTo(0, 0);
				lineTo(w, 0);
				lineTo(w, h);
				lineTo(0, h);
				lineTo(0, 0);
				endFill();
			}
		} else {
			this.mc.disable.removeMovieClip();
		}
		this.enabled = b;
	}
	private function fire(eventname:String) {
		//if (eventname == "onPress") {
		//}
		if (this[eventname] != undefined) {
			this[eventname].apply(this.applytarget, [this.checked]);
		}
		if (this.functions[eventname.toLowerCase()] != undefined) {
			this.functions[eventname.toLowerCase()].apply(this.applytarget, [this.checked]);
		}
	}
	function getEnabled():Boolean {
		return (this.enabled);
	}
	function getWidth():Number {
		return (this.mc.skin._width);
	}
	function getHeight():Number {
		return (this.mc.skin._height);
	}
	function getLeft():Number {
		return (this.mc._x);
	}
	function getRight():Number {
		return (this.mc._x+this.mc.skin._width);
	}
	function getTop():Number {
		return (this.mc._y);
	}
	function getBottom():Number {
		return (this.mc._y+this.mc.skin._height);
	}
	function getXCenter():Number {
		return (this.mc._x+(this.mc.skin._width/2));
	}
	function getYCenter():Number {
		return (this.mc._y+(this.mc.skin._height/2));
	}
}
