/*
 * euDock - javascript Emulation of Dock style MAC OS X bar
 *
 * Version: 2.0.06
 *
 * Copyright (C) 2006 Parodi (Pier...) Eugenio <eudock@inwind.it>
 *                                              http://eudock.jules.it
 *
 * SPECIAL THANKS TO Tiago D'Herbe (tvidigal) FOR (Multiple Dock) INSPIRATION
 *
 *                   Mario Zaizar to suggest and help me for Pointer icon patch and Target function
 *
 *                   J?r?mie 'ahFeel' BORDIER to suggest and help me for DeleteIcon feature
 *
 *
 *
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 */

 /*
  *
  * This program is absolutely free...
  *           ...BUT...
  * If you modify(OR TRY TO DO THAT)this Source Code,
  * my SOUL will carry you some monstrous Nightmares
  *
  * Have a nice day
  * enjoy yourself.
  *          Pier...
  *
  * (Sorry but I'm Italian not an American writer)
  *                            (...a day Maybe...)
  */

if (!euEnv)
	var euEnv      = new Array();
euEnv.Kost         = new Array();
euEnv.Kost.num     = 0;
euEnv.Kost.next    = function(){return this.num++;};
euEnv.euDockArray  = new Array();
euEnv.refreshTime  = 35;
euEnv.exeThread          = true;
euEnv.exeThreadWhiteLoop = 0;
euEnv.x = 0;
euEnv.y = 0;
euEnv.mouseMoved=false;

var euUP       = 1;
var euDOWN     = 2;
var euLEFT     = 3;
var euRIGHT    = 4;

var euICON     = 5;
var euMOUSE    = 6;

var euSCREEN   = 7;
var euOBJECT   = 8;
var euABSOLUTE = 9;
var euRELATIVE = 10;

var euHORIZONTAL = 11;
var euVERTICAL   = 12;
var euCENTER     = 13;

var euTRANSPARENT = 14;
var euFIXED       = 15;
var euOPAQUE      = 16;



/*
 ****************************************
 ****** Standard euDock Functions *******
 ******  (BEGIN)                  *******
 ****************************************
 */
		function euIdObjTop(euObj){
		    var ret = euObj.offsetTop;
		    while ((euObj = euObj.offsetParent)!=null)
		        ret += euObj.offsetTop;
		    return ret;
		};

		function euIdObjLeft(euObj){
		    var ret = euObj.offsetLeft;
		    while ((euObj = euObj.offsetParent)!=null)
		        ret += euObj.offsetLeft;


			return ret;
		};

		function isEuInside(euObj,x,y){
			var euTop  = euIdObjTop(euObj);
			var euLeft = euIdObjLeft(euObj);
			return ((euTop<=y && (euTop+euObj.offsetHeight)>=y)&&(euLeft<=x && (euLeft+euObj.offsetWidth)>=x));
		};

		/*
		 * euDimensioni()
		 *
		 * standard code fo retrieve width and Height of Screen
		 *
		 */
		function euDimensioni(){
		    if( typeof( window.innerWidth ) == 'number' ) {
		        //Non-IE
		        euEnv.euFrameWidth = window.innerWidth-16;
		        euEnv.euFrameHeight = window.innerHeight;
		    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		        //IE 6+ in 'standards compliant mode'
		        euEnv.euFrameWidth = document.documentElement.clientWidth-16;
		        euEnv.euFrameHeight = document.documentElement.clientHeight;
		    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		        //IE 4 compatible
		        euEnv.euFrameWidth = document.body.clientWidth;
		        euEnv.euFrameHeight = document.body.clientHeight;
		    }
		};

		function offsEut() {
		    euEnv.euScrOfY = 0;
		    euEnv.euScrOfX = 0;
		    if( typeof( window.pageYoffsEut ) == 'number' ) {
		        //Netscape compliant
		        euEnv.euScrOfY = window.pageYoffsEut;
		        euEnv.euScrOfX = window.pageXoffsEut;
		    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
		        //DOM compliant
		        euEnv.euScrOfY = document.body.scrollTop;
		        euEnv.euScrOfX = document.body.scrollLeft;
		    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		        //IE6 standards compliant mode
		        euEnv.euScrOfY = document.documentElement.scrollTop;
		        euEnv.euScrOfX = document.documentElement.scrollLeft;
		    }
		};
/*
 ****************************************
 ****** Standard euDock Functions *******
 ******  (END)                    *******
 ****************************************
 */

/*
 ****************************************
 ****** euDock Trans Functions    *******
 ******  (BEGIN)                  *******
 ****************************************
 */

	function euKostFunc30(x){
		return 0.3;
	};

	function euKostFunc100(x){
		return 1;
	};

 	function euLinear(x){
		return x;
	};

	function euLinear30(x){
		//return 1*(x+(1-x)*0.3);
		var r = 1*(x+(1-x)*0.3);
		//if(r < 1)
		//{r = 1;}
		return r;
	};

	function euLinear20(x){
		return x+(1-x)*0.2;
	};

	function euExp30(x){
		return euLinear30(x*x*x);
	};

	function euLinear50(x){
		return x+(1-x)*0.5;
	};

	function euHarmonic(x){
		return euLinear30((1-Math.cos(Math.PI*x))/2);
	};

	function euSemiHarmonic(x){
		return euLinear30(Math.cos(Math.PI*(1-x)/2));
	};

/*
 ****************************************
 ****** euDock Trans Functions    *******
 ******  (END)                    *******
 ****************************************
 */

/*
 ****************************************
 ******    euDock Object          *******
 ******     (START)               *******
 ****************************************
 */
		function euDock(onde){
			this.id = 'euDock_'+euEnv.Kost.next();
			var novoel = document.createElement("div");
			novoel.style.position = "absolute";
			
			novoel.innerHTML = "<div id='"+this.id+"_bar' style='z-index:1;position:absolute;border:0px solid black;'></div>" +
								"<div id='"+this.id+"' style='z-index:1;position:absolute;border:0px solid black; cursor: pointer;'></div>";

			if(onde){
				novoel.style.zIndex = 100000;
				onde.appendChild(novoel);
			}
			else{
				document.body.appendChild(novoel);
			}

			this.div   =document.getElementById(this.id);
			this.divBar=document.getElementById(this.id+"_bar");
			this.iconsArray=new Array();
			this.isInside=false;
			euEnv.euDockArray[this.id]=this;
			this.bar=null;

			this.mouseX = 0;
			this.mouseY = 0;

			this.centerPosX = 0;
			this.centerPosY = 0;
			this.offset     = 0;
			this.iconOffset = 0;

			this.venusHillSize  = 3;//200;
			this.venusHillTrans = euLinear;

			this.position    = euUP;
			this.align       = euSCREEN;
			this.objectAlign = euDOWN;
			this.idObjectHook;
			this.animaition  = euICON;
			this.animFading  = euABSOLUTE;

			this.setIconsOffset = function(offset){
				this.iconOffset=offset;
			};

			this.setAnimation = function(anim,size){
				this.animaition    = anim;
				this.venusHillSize = size;
			};

			this.setPointAlign = function(x,y,pos){
				this.offset   = 0;
				this.align    = euABSOLUTE;
				this.position = pos;
				this.setCenterPos(x,y);
			};

			this.setObjectAlign = function(idObj,align,offset,pos){
				this.offset       = offset;
				this.align        = euOBJECT;
				this.objectAlign  = align;
				this.position     = pos;
				this.idObjectHook = document.getElementById(idObj);
				this.setObjectCoord();
			};
			this.setObjectCoord = function(){
				var tempx,tempy;
				if (this.objectAlign==euDOWN){
					if(onde){
						tempx = (this.idObjectHook.offsetWidth/2);
						tempy = 0;
					}
					else{
						tempx = euIdObjLeft(this.idObjectHook) + (this.idObjectHook.offsetWidth/2);
						tempy = euIdObjTop(this.idObjectHook)  + this.idObjectHook.offsetHeight + this.offset;
						if(navm && !document.doctype || (navm && document.doctype && document.doctype.systemId == "")){
							tempx = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA))[0] + (euIdObjLeft(this.idObjectHook) / 2);
						}
						//alert(tempx);
						if(navm && i3GEO.util.versaoNavegador() === "IE8" && tempx < this.idObjectHook.offsetWidth){
							tempx = i3GEO.parametros.w / 2;
							if(i3GEO.guias.TIPO === "guia" || i3GEO.guias.TIPO === "sanfona" && $i("contemFerramentas")){
								tempx += parseInt($i("contemFerramentas").style.width,10);
							}
						}
					}

					this.setCenterPos(
						tempx,
						tempy
					);
				}
				else if (this.objectAlign==euUP)
					this.setCenterPos(
						euIdObjLeft(this.idObjectHook) + (this.idObjectHook.offsetWidth/2),
						euIdObjTop(this.idObjectHook) - this.offset);
				else if (this.objectAlign==euLEFT)
					this.setCenterPos(
						euIdObjLeft(this.idObjectHook) - this.offset,
						euIdObjTop(this.idObjectHook)  + (this.idObjectHook.offsetHeight/2));
				else if (this.objectAlign==euRIGHT)
					this.setCenterPos(
						euIdObjLeft(this.idObjectHook) + this.idObjectHook.offsetWidth + this.offset,
						euIdObjTop(this.idObjectHook)  + (this.idObjectHook.offsetHeight/2));
				else if (this.objectAlign==euCENTER){
					if (this.position==euUP || this.position==euDOWN || this.position==euHORIZONTAL)
						this.setCenterPos(
							euIdObjLeft(this.idObjectHook) + (this.idObjectHook.offsetWidth/2),
							euIdObjTop(this.idObjectHook)  + (this.idObjectHook.offsetHeight/2) - this.offset);
					else
						this.setCenterPos(
							euIdObjLeft(this.idObjectHook) + (this.idObjectHook.offsetWidth/2) + this.offset,
							euIdObjTop(this.idObjectHook)  + (this.idObjectHook.offsetHeight/2));
				}
			};

			this.setScreenAlign = function(align,offset){
				this.offset=offset;
				this.align = euSCREEN;
				if (align==euUP)
					this.position=euDOWN;
				else if (align==euDOWN)
					this.position=euUP;
				else if (align==euLEFT)
					this.position=euRIGHT;
				else if (align==euRIGHT)
					this.position=euLEFT;
				this.setScreenCoord();
			};

			this.setScreenCoord = function(){
				euDimensioni();
				offsEut();
				if (this.position==euDOWN)
					this.setCenterPos(
						euEnv.euScrOfX+euEnv.euFrameWidth/2,
						euEnv.euScrOfY+this.offset);
				else if (this.position==euUP)
					this.setCenterPos(
						euEnv.euScrOfX+euEnv.euFrameWidth/2,
						euEnv.euScrOfY+euEnv.euFrameHeight-this.offset);
				else if (this.position==euRIGHT)
					this.setCenterPos(
						euEnv.euScrOfX+this.offset,
						euEnv.euScrOfY+euEnv.euFrameHeight/2);
				else if (this.position==euLEFT)
					this.setCenterPos(
						euEnv.euScrOfX+euEnv.euFrameWidth-this.offset,
						euEnv.euScrOfY+euEnv.euFrameHeight/2);
			};

			this.refreshDiv = function(){
				if (this.position==euDOWN){
					this.setPos(this.centerPosX-this.getWidth()/2,this.centerPosY+this.iconOffset);
				}else if (this.position==euUP){
					this.setPos(this.centerPosX-this.getWidth()/2,this.centerPosY-this.getHeight()-this.iconOffset);
				}else if (this.position==euRIGHT){
					this.setPos(this.centerPosX+this.iconOffset,this.centerPosY-this.getHeight()/2);
				}else if (this.position==euLEFT){
					this.setPos(this.centerPosX-this.getWidth()-this.iconOffset,this.centerPosY-this.getHeight()/2);
				}else if (this.position==euHORIZONTAL){
					this.setPos(this.centerPosX-this.getWidth()/2,this.centerPosY-this.getHeight()/2+this.iconOffset);
				}else if (this.position==euVERTICAL){
					this.setPos(this.centerPosX-this.getWidth()/2+this.iconOffset,this.centerPosY-this.getHeight()/2);
				}
				if (this.bar){
					if (this.position==euDOWN){
						this.setBarPos(this.centerPosX-this.getWidth()/2,this.centerPosY);
					}else if (this.position==euUP){
						this.setBarPos(this.centerPosX-this.getWidth()/2,this.centerPosY-this.bar.getSize());
					}else if (this.position==euRIGHT){
						this.setBarPos(this.centerPosX,this.centerPosY-this.getHeight()/2);
					}else if (this.position==euLEFT){
						this.setBarPos(this.centerPosX-this.bar.getSize(),this.centerPosY-this.getHeight()/2);
					}else if (this.position==euHORIZONTAL){
						this.setBarPos(this.centerPosX-this.getWidth()/2,this.centerPosY-this.bar.getSize()/2);
					}else if(this.position==euVERTICAL){
						this.setBarPos(this.centerPosX-this.bar.getSize()/2,this.centerPosY-this.getHeight()/2);
					}
				}
			};

			this.riposition = function(){
				if (this.align == euSCREEN)
					this.setScreenCoord();
				else if (this.align == euOBJECT)
					this.setObjectCoord();
			};

			this.setCenterPos = function(x,y){
				this.centerPosX = x;
				this.centerPosY = y;
				this.refreshDiv();
			};

			this.setPos = function(x,y){
				this.setPosX(x);
				this.setPosY(y);
			};

			this.setBarPos = function(x,y){
				this.setBarPosX(x);
				this.setBarPosY(y);
			};

			this.setDim = function(w,h){
				this.setWidth(w);
				this.setHeight(h);
			};


			this.setBarPosX   = function(x) {document.getElementById(this.id+"_bar").style.left=x+'px';};
			this.setBarPosY   = function(y) {document.getElementById(this.id+"_bar").style.top=y+'px';};

			this.getPosX   = function() {return document.getElementById(this.id).style.left.replace(/[^0-9]/g,"");};
			this.setPosX   = function(x) {document.getElementById(this.id).style.left=x+'px';};
			this.getPosY   = function() {return document.getElementById(this.id).style.top.replace(/[^0-9]/g,"");};
			this.setPosY   = function(y) {document.getElementById(this.id).style.top=y+'px';};
			this.getWidth  = function() {return document.getElementById(this.id).style.width.replace(/[^0-9]/g,"");};
			this.setWidth  = function(w){document.getElementById(this.id).style.width=Math.round(w)+'px';};
			this.getHeight  = function() {return document.getElementById(this.id).style.height.replace(/[^0-9]/g,"");};
			this.setHeight = function(h){document.getElementById(this.id).style.height=Math.round(h)+'px';};

			this.getVenusWidth  = function() {return this.venusHillSize*this.getWidth();};
			this.getVenusHeight = function() {return this.venusHillSize*this.getHeight();};

			this.getMouseRelativeX = function(){return this.mouseX-euIdObjLeft(this.div);};
			this.getMouseRelativeY = function(){return this.mouseY-euIdObjTop(this.div);};

			this.updateDims = function(){
				var bakWidth  = 0;
				var bakHeight = 0;
				for (var i in this.iconsArray) if (this.iconsArray[i].id){
					if (this.position==euUP || this.position==euDOWN || this.position==euHORIZONTAL){
						bakWidth  += this.iconsArray[i].getWidth();
						bakHeight = (this.iconsArray[i].getHeight()>bakHeight)?this.iconsArray[i].getHeight():bakHeight;
						bakHeight = Math.round(bakHeight);
					}else{
						bakHeight += this.iconsArray[i].getHeight();
						bakWidth  = (this.iconsArray[i].getWidth()>bakWidth)?this.iconsArray[i].getWidth():bakWidth;
						bakWidth = Math.round(bakWidth);
					}
				}

				if (this.bar){
					if (this.position==euUP || this.position==euDOWN || this.position==euHORIZONTAL)
						this.bar.setProperties(bakWidth,this.position);
					else
						this.bar.setProperties(bakHeight,this.position);
					this.bar.refresh();
				}

				//bakWidth=Math.ceil(bakWidth);
				//bakHeight=Math.ceil(bakHeight);

				var posx=0;
				var posy=0;
				var updPosX=0;
				var updPosY=0;
				for (var i in this.iconsArray) if (this.iconsArray[i].id){
					if (this.position==euDOWN){
						updPosX=posx;
						updPosY=posy;
						posx+=this.iconsArray[i].getWidth();
					}else if (this.position==euUP){
						updPosX=posx;
						updPosY=bakHeight-this.iconsArray[i].getHeight();
						posx+=this.iconsArray[i].getWidth();
					}else if (this.position==euRIGHT){
						updPosX=posx;
						updPosY=posy;
						posy+=this.iconsArray[i].getHeight();
					}else if (this.position==euLEFT){
						updPosX=bakWidth-this.iconsArray[i].getWidth();
						updPosY=posy;
						posy+=this.iconsArray[i].getHeight();
					}else if (this.position==euHORIZONTAL){
						updPosX=posx;
						updPosY=(bakHeight-this.iconsArray[i].getHeight())/2;
						posx+=this.iconsArray[i].getWidth();
					}else if (this.position==euVERTICAL){
						updPosX=(bakWidth-this.iconsArray[i].getWidth())/2;
						updPosY=posy;
						posy+=this.iconsArray[i].getHeight();
					}
					this.iconsArray[i].setPos(updPosX,updPosY);
					this.iconsArray[i].refresh();

				}

				this.setDim(bakWidth,bakHeight);
				this.refreshDiv();
			};

			this.kernel = function(){
			};

			this.kernelMouseOver = function(){
			};

			this.kernelMouseOut = function(){
			};

			this.mouseOut = function(){
			};

			this.mouseOver = function(){
			};

			this.mouseMove = function(x,y){
			};

			this.iconParams=new Array();

			this.setAllFrameStep = function(step){
				this.iconParams.frameStep=step;
				for (var i in this.iconsArray) if (this.iconsArray[i].id)
					this.iconsArray[i].frameStep=step;
			};

			this.setAllZoomFunc = function(func){
			};

			this.setAllZoomFuncW = function(func){
			};

			this.setAllZoomFuncH = function(func){
			};

			this.setBar = function(args){
				var id = 'euDock_bar_'+euEnv.Kost.next();
				euEnv.euDockArray[id] = new euDockBar(id,this);
				euEnv.euDockArray[id].setElements(args);
				this.bar=euEnv.euDockArray[id];
				return euEnv.euDockArray[id];
			};

			this.addIcon = function(args,params){
				var i,id = params.id;
				var id = 'euDock_icon_'+euEnv.Kost.next();
				euEnv.euDockArray[id] = new euDockIcon(id,this,params.titulo);
				euEnv.euDockArray[id].addElement(args);
				this.iconsArray.push(euEnv.euDockArray[id]);
				for (i in this.iconParams)
					euEnv.euDockArray[id][i]=this.iconParams[i];
				for (i in params)
					euEnv.euDockArray[id][i]=params[i];

				return euEnv.euDockArray[id];
			};

			this.delIcon = function(elem) {
				euEnv.euDockArray.splice(elem);
				euEnv.euDockArray[elem.id]=0;
				for (var i in this.iconsArray) if (this.iconsArray[i] == elem)
					this.iconsArray.splice(i,1);
				elem.destroy();
				elem=null;
				this.updateDims();
			};

		};
/*
 ****************************************
 ******    euDock Object          *******
 ******     (END)                 *******
 ****************************************
 */

/*
 ****************************************
 ******    euDock Icon Object     *******
 ******     (START)               *******
 ****************************************
 */
		function euDockIcon(id,dock,titulo){
			this.id = id;
			this.parentDock = dock;

			this.elementsArray;

			this.zoomFuncW=euLinear30;
			this.zoomFuncH=euLinear30;

			this.posX          = 0;
			this.posY          = 0;
			this.width         = 0;
			this.height        = 0;
			this.frame         = 0;
			this.frameStep     = 0.5;
			this.fadingFrame   = 0;
			this.fadingStep    = 1;
			this.fadingType    = euTRANSPARENT;

			this.loaded        = false;
			this.runningFrame  = false;
			this.runningFading = false;

			this.updateDims = function(){
				if (!this.loaded)return;

				for (var i=0;i<this.elementsArray.length;i++)
					this.elementsArray[i].setProperties(this.posX,this.posY,this.getWidth(),this.getHeight());
			};

			this.updateFading = function(){
			};

			this.refresh = function(){
				this.updateDims();
			};

			this.isAbsoluteInside = function(x,y){
				x-=this.getAbsolutePosX();
				y-=this.getAbsolutePosY();
				return x>0 && y>0 && x<this.getWidth() && y<this.getHeight();
			};

			this.isInside = function(x,y){
				return this.isInsideX(x) && this.isInsideY(y);
			};

			this.isInsideX = function(x){
				return 	(this.loaded && (this.posX<=x) && ((this.posX+this.getWidth())>=x));
			};

			this.isInsideY = function(y){
				return 	(this.loaded && (this.posY<=y) && ((this.posY+this.getHeight())>=y));
			};

			this.retrieveLoadingDims = function(elem,num){
				if (elem.onLoadPrev)
					elem.onLoadPrev();
				if (num==0 && !this.loaded)
					this.setDim(elem.getWidth(),elem.getHeight());
				elem.loaded=true;
				var ret=true;
				for (var i in this.elementsArray) if (this.elementsArray[i].id)
						ret&=this.elementsArray[i].loaded;
				this.loaded=ret;
				if (this.loaded){
					this.parentDock.updateDims();
					for (var i in this.elementsArray) if (this.elementsArray[i].id)
						this.elementsArray[i].show();
				}
				if (elem.onLoadNext)
					elem.onLoadNext();
			};

			this.setPos = function(x,y){
				this.posX = x;
				this.posY = y;
			};

			this.setDim = function(w,h){
				if (this.width==0)
					this.width  = w;
				if (this.height==0)
					this.height = h;
			};

			this.getAbsolutePosX = function(){return euIdObjLeft(this.parentDock.div)+this.posX;};
			this.getAbsolutePosY = function(){return euIdObjTop(this.parentDock.div)+this.posY;};

			this.setPosX   = function(x) {this.posX=x;};
			this.setPosY   = function(y) {this.posY=y;};
			this.getWidth  = function()  {
				if (!this.loaded)return 0;
				var calc = this.width*this.zoomFuncW(this.frame);
				return 38;
			};
			this.getHeight = function()  {
				if (!this.loaded)return 0;
				return 38;
			};

			this.isRunning = function(){
				return this.runningFrame || this.runningFading;
			};

			this.setFrameTo = function(frameTo){
				//frameTo=(Math.round(frameTo*100))/100;
				if (this.frame==frameTo)
					this.runningFrame = false;
				else{
					this.runningFrame = true;

					this.frame+=(frameTo-this.frame)*this.frameStep;

					if (Math.abs(this.frame-frameTo)<0.01)
							this.frame=frameTo;


					if (this.frame<0)
						this.frame = 0;
					if (this.frame>1)
						this.frame = 1;
				}
				return this.runningFrame;
			};

			this.addElement = function(args){
				if (typeof(args)!="undefined" && args!=null){
					this.elementsArray=new Array();
					this.fadingStep = 0.5/args.length;

					for (var i=0;i<args.length;i++)
						for (var ii in args[i]){
							var id = "euDock_"+ii+"_"+euEnv.Kost.next();
							euEnv.euDockArray[id]= new window[ii](id,args[i][ii],this.parentDock.div,"euEnv.euDockArray."+this.id+".retrieveLoadingDims(euEnv.euDockArray."+id+","+i+");");
							this.elementsArray.push(euEnv.euDockArray[id]);
							euEnv.euDockArray[id].loaded=false;
						}
				}
			};

			this.destroy = function() {
				for (var i in this.elementsArray) if (this.elementsArray[i].id){
					euEnv.euDockArray[this.elementsArray[i].id]=0;
					euEnv.euDockArray.splice(this.elementsArray[i],1);
					this.elementsArray[i].destroy();
				}
				this.elementsArray.splice(0,this.elementsArray.length);
			};

			this.mouseClick = function(x,y){
				if (this.isAbsoluteInside(x,y)){
					this.mouseInsideClick(x,y,this.id,this.getAbsolutePosX(),this.getAbsolutePosY());
				}
			};
		};
/*
 ****************************************
 ******    euDock Icon Object     *******
 ******     (END)                 *******
 ****************************************
 */

 /*
 ****************************************
 ******    euDock Bar Object     *******
 ******     (START)               *******
 ****************************************
 */
		function euDockBar(id,dock){
			this.id = id;

			this.parentDock = dock;

			this.elementsArray=new Array();

			this.len=0;
			this.align=euUP;

			this.loaded = false;

			this.getSize = function(){
				if (!this.loaded)
					return 0;
				if (this.align==euUP || this.align==euDOWN || this.align==euHORIZONTAL)
					return this.elementsArray.left.getHeight();
				else
					return this.elementsArray.top.getWidth();
			};

			this.refresh = function(){
				if (!this.loaded)
					return;
				if (this.align==euUP || this.align==euDOWN || this.align==euHORIZONTAL){
					this.elementsArray.left.setPos(-this.elementsArray.left.getWidth(),0);
					this.elementsArray.horizontal.setProperties(0,0,Math.round(this.len),this.getSize());
					this.elementsArray.right.setPos(Math.round(this.len),0);
					this.elementsArray.left.show();
					this.elementsArray.horizontal.show();
					this.elementsArray.right.show();
					if (this.elementsArray.top)
						this.elementsArray.top.hide();
					if (this.elementsArray.bottom)
						this.elementsArray.bottom.hide();
					if (this.elementsArray.vertical){
						this.elementsArray.vertical.setProperties(0,0,0,0);
						this.elementsArray.vertical.hide();
					}
				}else{
					this.elementsArray.top.setPos(0,-this.elementsArray.top.getHeight());
					this.elementsArray.vertical.setProperties(0,0,this.getSize(),Math.round(this.len));
					this.elementsArray.bottom.setPos(0,Math.round(this.len));
					this.elementsArray.top.show();
					this.elementsArray.vertical.show();
					this.elementsArray.bottom.show();
					if (this.elementsArray.left)
						this.elementsArray.left.hide();
					if (this.elementsArray.right)
						this.elementsArray.right.hide();
					if (this.elementsArray.horizontal){
						this.elementsArray.horizontal.setProperties(0,0,0,0);
						this.elementsArray.horizontal.hide();
					}
				}

			};

			this.setProperties = function(len,align){
				this.len=len+1;
				this.align=align;
				this.refresh();
			};

			this.retrieveLoadingDims = function(elem){
				if (elem.onLoadPrev)
					elem.onLoadPrev();
				elem.loaded=true;
				var ret=true;
				for (var i in this.elementsArray) if (this.elementsArray[i].id)
					ret&=this.elementsArray[i].loaded;
				this.loaded=ret;
				if (this.loaded){
					this.parentDock.updateDims();
					for (var i in this.elementsArray) if (this.elementsArray[i].id)
						this.elementsArray[i].show();
				}
				if (elem.onLoadNext)
					elem.onLoadNext();
			};

			this.setElements = function(args){
				if (typeof(args)!="undefined" && args!=null){
					for (var i in args)
						for (var ii in args[i]){
							var id = "euDock_"+ii+"_"+euEnv.Kost.next();
							//if (this.elementsArray[i]){
							//	this.elementsArray[i].hide();
							//	euEnv.euDockArray[this.elementsArray[i].id]=null;
							//}
							euEnv.euDockArray[id]=new window[ii](id,args[i][ii],this.parentDock.divBar,"euEnv.euDockArray."+this.id+".retrieveLoadingDims(euEnv.euDockArray."+id+");");
							this.elementsArray[i]=euEnv.euDockArray[id];
							euEnv.euDockArray[id].loaded=false;
						}
				}
			};
		};
/*
 ****************************************
 ******    euDock Bar Object      *******
 ******     (END)                 *******
 ****************************************
 */
function euThread(){
};

function euKernel(){
};

function on_MouseMove(e) {
	return true;
};

function on_MouseDown(e) {
	return true;
};

function on_MouseUp(e) {
	return true;
};

function on_MouseClick(e) {
	if (!e) e = window.event;
	for (var i in euEnv.euDockArray)
		if (euEnv.euDockArray[i].mouseClick)
			euEnv.exeThread |= euEnv.euDockArray[i].mouseClick(euEnv.euScrOfX+e.clientX,euEnv.euScrOfY+e.clientY);
	return true;
};
