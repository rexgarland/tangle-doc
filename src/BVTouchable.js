//
//  BVTouchable.js
//  ExplorableExplanations
//
//  Created by Bret Victor on 3/10/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//

const { addEvents, removeEvents } = require('./shim.js')
require('mootools');

var BVTouchable = this.BVTouchable = new Class({

	initialize: function (el, delegate) {
		this.element = el;
		this.delegate = delegate;
		this.setTouchable(true);
	},
	

	//----------------------------------------------------------------------------------
	//
	//  touches
	//

	setTouchable: function (isTouchable) {
		if (this.touchable === isTouchable) { return; }
		this.touchable = isTouchable;
		this.element.style.pointerEvents = (this.touchable || this.hoverable) ? "auto" : "none";

		if (isTouchable) {
			if (!this._mouseBound) {
				this._mouseBound = {
					mouseDown: this._mouseDown.bind(this),
					mouseMove: this._mouseMove.bind(this),
					mouseUp: this._mouseUp.bind(this),
					touchStart: this._touchStart.bind(this),
					touchMove: this._touchMove.bind(this),
					touchEnd: this._touchEnd.bind(this),
					touchCancel: this._touchCancel.bind(this)
				};
			}
			this.element.addEventListener("mousedown", this._mouseBound.mouseDown);
			this.element.addEventListener("touchstart", this._mouseBound.touchStart);
		}
		else {
			this.element.removeEvents("mousedown");
			this.element.removeEvents("touchstart");
		}
	},
	
	touchDidGoDown: function (touches) { this.delegate.touchDidGoDown(touches); },
	touchDidMove: function (touches) { this.delegate.touchDidMove(touches);  },
	touchDidGoUp: function (touches) { this.delegate.touchDidGoUp(touches);  },
	
	_mouseDown: function (event) {
		event.stopPropagation();
		event.preventDefault();
		addEvents({
			mousemove: this._mouseBound.mouseMove,
			mouseup: this._mouseBound.mouseUp
		})(document);
	
		this.touches = new BVTouches(event);
		this.touchDidGoDown(this.touches);
	},

	_mouseMove: function (event) {
		event.stopPropagation();
		event.preventDefault();
		this.touches._updateWithEvent(event);
		this.touchDidMove(this.touches);
	},

	_mouseUp: function (event) {
		event.stopPropagation();
		event.preventDefault();
		this.touches._goUpWithEvent(event);
		this.touchDidGoUp(this.touches);
		
		delete this.touches;
		removeEvents({
			mousemove: this._mouseBound.mouseMove,
			mouseup: this._mouseBound.mouseUp
		})(document);
	},

	_touchStart: function (event) {
		event.stopPropagation();
		event.preventDefault();
		// if (this.touches || event.length > 1) { this._touchCancel(event); return; }  // only-single touch for now
		if (this.touches) { this._touchCancel(event); return; }
		
		addEvents({
			touchmove: this._mouseBound.touchMove,
			touchend: this._mouseBound.touchEnd,
			touchcancel: this._mouseBound.touchCancel
		})(document);
	
		this.touches = new BVTouches(event);
		this.touchDidGoDown(this.touches);
	},
	
	_touchMove: function (event) {
		event.stopPropagation();
		event.preventDefault();
		if (!this.touches) { return; }

		this.touches._updateWithEvent(event);
		this.touchDidMove(this.touches);
	},
	
	_touchEnd: function (event) {
		event.stopPropagation();
		event.preventDefault();
		if (!this.touches) { return; }

		this.touches._goUpWithEvent(event);
		this.touchDidGoUp(this.touches);
		
		delete this.touches;
		removeEvents({
			touchmove: this._mouseBound.touchMove,
			touchend: this._mouseBound.touchEnd,
			touchcancel: this._mouseBound.touchCancel
		})(document);
	},
	
	_touchCancel: function (event) {
		this._touchEnd(event);
	}

});


//====================================================================================
//
//  BVTouches
//

var BVTouches = this.BVTouches = new Class({

	initialize: function (event) {
		this.globalPoint = { x:event.clientX, y:-event.clientY };
		this.translation = { x:0, y:0 };
		this.deltaTranslation = { x:0, y:0 };
		this.velocity = { x:0, y:0 };
		this.count = 1;
		this.event = event;
		this.timestamp = Date.now();
		this.downTimestamp = this.timestamp;
	},
	
	_updateWithEvent: function (event, isRemoving) {
		this.event = event;
		if (!isRemoving) {
			var dx = event.clientX - this.globalPoint.x;  // todo, transform to local coordinate space?
			var dy = -event.clientY - this.globalPoint.y;
			this.translation.x += dx;
			this.translation.y += dy;
			this.deltaTranslation.x += dx;
			this.deltaTranslation.y += dy;
			this.globalPoint.x = event.clientX;
			this.globalPoint.y = -event.clientY;
		}

		var timestamp = Date.now();
		var dt = timestamp - this.timestamp;
		var isSamePoint = isRemoving || (dx === 0 && dy === 0);
		var isStopped = (isSamePoint && dt > 150);
		
		this.velocity.x = isStopped ? 0 : (isSamePoint || dt === 0) ? this.velocity.x : (dx / dt * 1000);
		this.velocity.y = isStopped ? 0 : (isSamePoint || dt === 0) ? this.velocity.y : (dy / dt * 1000);
		this.timestamp = timestamp;
	},
	
	_goUpWithEvent: function (event) {
		this._updateWithEvent(event, true);
		this.count = 0;
		
		var didMove = Math.abs(this.translation.x) > 10 || Math.abs(this.translation.y) > 10;
		var wasMoving = Math.abs(this.velocity.x) > 400 || Math.abs(this.velocity.y) > 400;
		this.wasTap = !didMove && !wasMoving && (this.getTimeSinceGoingDown() < 300);
	},
	
	getTimeSinceGoingDown: function () {
		return this.timestamp - this.downTimestamp;
	},
	
	resetDeltaTranslation: function () {
		this.deltaTranslation.x = 0;
		this.deltaTranslation.y = 0;
	}

});


//====================================================================================

module.exports = BVTouchable
