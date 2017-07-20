/**
 * Created by yez on 16/9/5.
 * 2017年04月19日11:05:27 添加 PC 上的拖动事件
 */
"use strict";
var RING_INNER_RADIUS = 35,
    RING_OUTER_RADIUS = 55;

var TICK_WIDTH = 10,
    TICK_LONG_STROKE_STYLE = "rgba(100,140,230,0.9)",
    TICK_SHORT_STROKE_STYLE = "rgba(100,140,230,0.7)";

CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
	//扇形构建
	// 初始保存
	this.save();
	// 位移到目标点
	this.translate(x, y);
	this.beginPath();
	// 画出圆弧
	this.arc(0, 0, radius, sDeg, eDeg);
	// 再次保存以备旋转
	this.save();
	// 旋转至起始角度
	this.rotate(eDeg);
	// 移动到终点，准备连接终点与圆心
	this.moveTo(radius, 0);
	// 连接到圆心
	this.lineTo(0, 0);
	// 还原
	this.restore();
	// 旋转至起点角度
	this.rotate(sDeg);
	// 从圆心连接到起点
	this.lineTo(radius, 0);
	this.closePath();
	// 还原到最初保存的状态
	this.restore();
	return this;
};

function rebuildvalue(value, max) {
	var angle = 0;
	// if(value<=60){
	//     angle = parseFloat(value/6).toFixed(1);
	// }else{
	//     angle = parseFloat(10+(max-10)/40*(value-60)).toFixed(1)
	// }
	/* 2016年11月01日10:08:40
  * 改为线性变化
  *
  * */
	angle = parseFloat(value).toFixed(1);
	return angle;
}

function drawTicks(circle, context2) {
	// 画刻度
	var radius = circle.radius + RING_INNER_RADIUS,
	    ANGLE_MAX = Math.PI * 2,
	    ANGLE_DELTA = Math.PI / 64,
	    tickWidth = undefined;
	//利用度数做循环
	//cnt用于计算数目
	for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle = angle + ANGLE_DELTA, cnt++) {
		drawTick(angle, radius, cnt);
	}
	//利用半径与半径与x轴夹角绘制单个刻度
	function drawTick(angle, radius, cnt) {
		var tickWidth = undefined;
		context2.save();

		if (cnt % 4 === 0) {
			tickWidth = TICK_WIDTH;
			context2.strokeStyle = TICK_LONG_STROKE_STYLE;
		} else {
			tickWidth = TICK_WIDTH / 2;
			context2.strokeStyle = TICK_SHORT_STROKE_STYLE;
		}

		context2.beginPath();
		context2.moveTo(circle.x + Math.cos(angle) * (radius - tickWidth), circle.y + Math.sin(angle) * (radius - tickWidth));
		context2.lineTo(circle.x + Math.cos(angle) * radius, circle.y + Math.sin(angle) * radius);
		context2.stroke();

		context2.restore();
	}
}
function calculateAngle(start, end) {
	//计算角度
	//start 为原点
	var x = Math.abs(start.x - end.x);
	var y = Math.abs(start.y - end.y);
	var z = Math.sqrt(x * x + y * y);
	var rotat = Math.round(Math.asin(y / z) / Math.PI * 180); //得到的角度
	if (end.x >= start.x && end.y <= start.y) {
		rotat = rotat;
	}
	// 第二象限
	else if (end.x <= start.x && end.y <= start.y) {
			rotat = 180 - rotat;
		}
		// 第三象限
		else if (end.x <= start.x && end.y >= start.y) {
				rotat = 180 + rotat;
			}
			// 第四象限
			else if (end.x >= start.x && end.y >= start.y) {
					rotat = 360 - rotat;
				}
	return rotat; //真实的角度
}
//背景大盘
function drawContext(context) {
	context.beginPath();
	context.arc(250, 250, 200, Math.PI / 4, Math.PI * 3 / 4, true);
	//            context.fillStyle = '#e7e7e7';
	var g1 = context.createLinearGradient(100, 400, 468, 468);

	g1.addColorStop(0, '#4db6f8'); //蓝
	g1.addColorStop(0.25, '#77ca4d'); //蓝
	g1.addColorStop(0.5, '#f22626'); //红
	g1.addColorStop(1, '#ce2020'); //红

	context.fillStyle = g1;
	context.fill();
	context.strokeStyle = 'rgba(255,0,0,0)';
	context.closePath();
	context.stroke();
}
function drawContext2(context2, circle, radius, max) {

	context2.beginPath();
	context2.arc(250, 250, 176, 0, 2 * Math.PI, true);
	context2.fillStyle = 'rgba(255,255,255,1)';
	context2.fill();
	context2.strokeStyle = 'rgba(255,0,0,0)';
	context2.closePath();
	context2.stroke();

	context2.save();
	context2.beginPath();
	context2.translate(250, 250);
	context2.fillStyle = '#FFFFFF';
	context2.fill();
	context2.scale(2, 2);
	context2.rotate(Math.PI / 6);
	context2.fillRect(0, 0, 200, 200);
	context2.closePath();

	//右侧小圆
	context2.beginPath();
	context2.arc(94, 0, 6, 0, 2 * Math.PI, true);
	context2.fillStyle = '#d02120';
	context2.fill();
	context2.strokeStyle = 'rgba(255,0,0,0)';
	context2.closePath();
	context2.stroke();
	context2.restore();

	context2.save();
	context2.beginPath();
	context2.translate(250, 250);
	context2.fillStyle = '#FFFFFF';
	context2.fill();
	context2.scale(2, 2);
	context2.rotate(Math.PI / 18 * 6);
	context2.fillRect(0, 0, 100, 100);
	context2.closePath();
	//
	//左侧小圆
	context2.beginPath();

	context2.arc(0, 94, 6, 0, 2 * Math.PI, true);
	context2.fillStyle = '#4db6f8';
	context2.fill();
	context2.strokeStyle = 'rgba(255,0,0,0)';
	context2.closePath();
	context2.stroke();
	context2.restore();

	//灰色路径
	context2.fillStyle = "rgba(231,231,231,1)";
	context2.sector(250, 250, 202, -Math.PI * (7 / 6 + radius), Math.PI / 6).fill();

	context2.save();
	context2.beginPath();
	context2.arc(250, 250, 176, 0, 2 * Math.PI, false);
	context2.fillStyle = 'rgba(255,255,255,1)';
	context2.fill();
	context2.strokeStyle = 'rgba(255,255,255,0)';
	context2.closePath();
	context2.stroke();
	context2.restore();

	drawTicks(circle, context2);

	//灰色路径末端
	context2.save();
	context2.beginPath();
	context2.translate(250, 250);
	context2.fillStyle = '#FFFFFF';
	context2.fill();
	context2.scale(2, 2);
	context2.rotate(Math.PI / 6);
	context2.fillRect(0, 0, 100, 100);
	context2.closePath();

	//灰色路径末端-右侧小圆
	context2.beginPath();
	context2.arc(94, 0, 6, 0, 2 * Math.PI, true);
	context2.fillStyle = 'rgba(231,231,231,1)';
	context2.fill();
	context2.strokeStyle = 'rgba(255,0,0,0)';
	context2.closePath();
	context2.stroke();
	context2.restore();

	context2.save();
	context2.beginPath();
	context2.translate(250, 250);
	context2.fillStyle = '#FFFFFF';
	context2.fill();
	context2.scale(1.7, 1.7);
	context2.rotate(Math.PI / 3);
	context2.fillRect(0, 0, 100, 100);
	context2.closePath();
	context2.restore();

	context2.save();

	//指针线
	context2.translate(250, 250);
	context2.rotate(-Math.PI * (1 / 6 + radius));
	context2.fillStyle = '#f2264a'; //填充颜色：红色，半透明
	context2.strokeStyle = '#f2264a'; //线条颜色：绿色
	context2.lineWidth = 2; //设置线宽
	context2.beginPath();
	context2.moveTo(-180, 0);
	context2.lineTo(-94, 0);
	context2.closePath(); //可以把这句注释掉再运行比较下不同
	context2.stroke(); //画线框
	context2.fill(); //填充颜色

	//指针点
	context2.beginPath();

	context2.arc(-184, 0, 28, 0, 2 * Math.PI, true);
	context2.fillStyle = 'rgba(255,255,255,1)';
	context2.fill();
	context2.strokeStyle = 'rgba(255,0,0,0)';
	context2.closePath();
	context2.stroke();
	context2.beginPath();
	context2.arc(-184, 0, 20, 0, 2 * Math.PI, true);
	context2.fillStyle = '#f0f0f0';
	context2.fill();
	context2.strokeStyle = 'rgba(255,0,0,0)';
	context2.closePath();
	context2.stroke();

	//指针文字
	context2.translate(-220, 0);
	context2.rotate(-Math.PI / 2);
	context2.font = "24px Courier New";
	context2.fillStyle = "black";
	context2.textAlign = "center";
	var angle = rebuildvalue(parseInt(-radius * 75), max);
	// if(parseInt(angle)<5){
	//     context2.fillText("保守型", 0, 0);
	// } else if(parseInt(angle)<10){
	//     context2.fillText("稳健型", 0, 0);
	// } else {
	//     context2.fillText("激进型", 0, 0);
	// }

	context2.restore();
	context2.fillStyle = "rgba(255,255,255,1)";
	context2.sector(250, 250, 88, Math.PI / 6, Math.PI * 5 / 6).fill();

	context2.font = "45px Courier New";
	context2.fillStyle = "rgba(0,0,0,0.8)";
	context2.textAlign = "center";

	// context2.fillText(angle+"%", 250, 260);
	// if(parseInt(angle)<5){
	//     context2.fillText("保守型", 250, 260);
	//     sessionStorage.type = 1
	// } else if(parseInt(angle)<10){
	//     context2.fillText("稳健型", 250, 260);
	//     sessionStorage.type = 2
	// } else {
	//     context2.fillText("激进型", 250, 260);
	//     sessionStorage.type = 3
	// }
	// console.log(angle)
	if (parseFloat(angle) < 100 / 6) {
		context2.fillText("I", 250, 260);
		sessionStorage.type = 1;
	} else if (parseFloat(angle) < 100 / 6 * 2) {
		context2.fillText("II", 250, 260);
		sessionStorage.type = 2;
	} else if (parseFloat(angle) < 100 / 6 * 3) {
		context2.fillText("III", 250, 260);
		sessionStorage.type = 3;
	} else if (parseFloat(angle) < 100 / 6 * 4) {
		context2.fillText("IV", 250, 260);
		sessionStorage.type = 4;
	} else if (parseFloat(angle) < 100 / 6 * 5) {
		context2.fillText("V", 250, 260);
		sessionStorage.type = 5;
	} else {
		context2.fillText("VI", 250, 260);
		sessionStorage.type = 6;
	}

	context2.font = "30px Courier New";
	context2.fillStyle = "rgba(0,0,0,0.8)";
	context2.textAlign = "center";
	context2.fillText("等级", 250, 300);
}
function redraw(context2, circle, number, max) {
	// 重绘
	var radius = number / 75; //?why,i except 75
	context2.clearRect(0, 0, 500, 500);
	drawContext2(context2, circle, radius * -1, max);
}

var property = {
	touch: false
};

function init(option) {
	if (option) {
		for (var key in option) {
			property[key] = option[key];
		}
	}
	var canvas = document.getElementById("background");
	var context = canvas.getContext("2d");
	var pointer = document.getElementById("pointer");
	var context2 = pointer.getContext("2d");

	var circle = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		radius: 130
	};

	drawContext(context);
	drawContext2(context2, circle, -Math.PI / 6);

	if (option.touch) {
		if (browser.versions.ios || browser.versions.android) {
			pointer.addEventListener("touchmove", _touch, false);
			pointer.addEventListener('touchstart', function (event) {
				document.getElementsByTagName('body')[0].setAttribute("style", "overflow:hidden");
			}, false);
			pointer.addEventListener('touchend', function (event) {
				document.getElementsByTagName('body')[0].setAttribute("style", "overflow:auto");
			}, false);
		} else {

			pointer.addEventListener('mousedown', function (event) {
				pointer.addEventListener("mousemove", _move, false);
				// document.getElementsByTagName('body')[0].setAttribute("style","overflow:hidden")
			}, false);

			pointer.addEventListener('mouseup', function (event) {
				console.log(toString(pointer.removeEventListener));
				pointer.removeEventListener("mousemove", _move, false);
				// document.getElementsByTagName('body')[0].setAttribute("style","overflow:hidden")
			}, false);
		}
	}
	function _touch(event) {
		var clientX = pointer.getBoundingClientRect().left;
		var clientY = pointer.getBoundingClientRect().top;
		var start = { //中心点
			x: 125,
			y: 125
		};
		if (event.touches[0].clientX - clientX > 250 || event.touches[0].clientX - clientX < 0) {
			//超出区域不可滑动
			return false;
		}
		var end = { //手指摸到的区域,并且根据图表所在位置进行修正
			x: event.touches[0].clientX - clientX,
			y: event.touches[0].clientY - clientY
		};

		var radius = Math.sqrt(Math.pow(end.x - 125, 2) + Math.pow(end.y - 125, 2));
		// if(radius<60||radius>120){
		//     //正常来说都是88-100为有效区域,但是人的触点比较宽,所以相对扩展
		//     return false;
		// }
		var a = calculateAngle(start, end);
		//我的图表是从210度到-30度的区域,所以 a 的范围为240 - 0
		if (a > 210 && a < 330) return false;
		if (a > 330) a = a - 360;
		a = a + 30;
		if (a == 360) a = 0;

		var value = 5 * (a - 240) / 12 * -1;

		if (value < 0 || value > 100) {
			return false;
		}

		redraw(context2, circle, value, 60);
		// sessionStorage.annual = rebuildvalue(parseInt(value),60)
	}

	function _move(event) {
		var clientX = pointer.getBoundingClientRect().left;
		var clientY = pointer.getBoundingClientRect().top;
		var start = { //中心点
			x: 125,
			y: 125
		};
		if (event.clientX - clientX > 250 || event.clientX - clientX < 0) {
			//超出区域不可滑动
			return false;
		}
		var end = { //手指摸到的区域,并且根据图表所在位置进行修正
			x: event.clientX - clientX,
			y: event.clientY - clientY
		};

		var radius = Math.sqrt(Math.pow(end.x - 125, 2) + Math.pow(end.y - 125, 2));
		// if(radius<60||radius>120){
		//     //正常来说都是88-100为有效区域,但是人的触点比较宽,所以相对扩展
		//     return false;
		// }
		var a = calculateAngle(start, end);
		//我的图表是从210度到-30度的区域,所以 a 的范围为240 - 0
		if (a > 210 && a < 330) return false;
		if (a > 330) a = a - 360;
		a = a + 30;
		if (a == 360) a = 0;

		var value = 5 * (a - 240) / 12 * -1;

		if (value < 0 || value > 100) {
			return false;
		}

		redraw(context2, circle, value, 60);
		// sessionStorage.annual = rebuildvalue(parseInt(value),60)
	}
}