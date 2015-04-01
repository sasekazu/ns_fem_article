// JavaScript source code
// HTMLを読み終わった後に実行する関数
$(document).ready(function () {
	// 2dコンテキスト取得
	var canvas=$("#model_viewer");
	var context=canvas.get(0).getContext("2d");
	canvas.get(0).width=canvas.get(0).clientWidth;
	canvas.get(0).height=canvas.get(0).clientHeight;
	var canvasWidth=canvas.get(0).width;
	var canvasHeight=canvas.get(0).height;

	// 座標変換
	var xzero=canvasWidth*0.5; // キャンバス要素の幅の半分
	var yzero=canvasHeight*0.9; // キャンバス要素の高さの90%の部分
	context.setTransform(1, 0, 0, -1, xzero, yzero);

	// FEMクラスのインスタンス化
	var fem=new FEM();
	fem.rectangleMesh(200, 200, 10, 10);

	// 境界条件の設定
	fem.setBoundary(0, 200, [20,40]);

	// 変位ベクトルによる現在形状の更新
	for(var i=0; i<fem.pos.length; i++) {
		for(var j=0; j<2; j++){
			fem.pos[i][j]=fem.initpos[i][j]+fem.u[2*i+j];
		}
	}
	// 初期形状の描画
	context.strokeStyle='black';
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.initpos[fem.tri[i][0]], fem.initpos[fem.tri[i][1]], fem.initpos[fem.tri[i][2]]);
	}
	// 現在形状の描画
	context.strokeStyle='red';
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.pos[fem.tri[i][0]], fem.pos[fem.tri[i][1]], fem.pos[fem.tri[i][2]]);
	}
	// 変位既知節点の描画
	context.strokeStyle='blue';
	context.fillStyle='blue';
	for(var i=0; i<fem.dlist.length; i++) {
		drawCircle(fem.pos[fem.dlist[i]], 5);
	}
	// 外力既知節点の描画
	context.strokeStyle='green';
	context.fillStyle='green';
	for(var i=0; i<fem.flist.length; i++) {
		drawCircle(fem.pos[fem.flist[i]], 5);
	}

	// 描画用関数

	// 線の描画
	function drawLine(p1, p2) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.stroke();
	}

	// 円の描画
	function drawCircle(p, radius) {
		context.beginPath();
		context.arc(p[0], p[1], radius, 0, 2*Math.PI, true);
		context.stroke();
		context.fill();
	}

	// 三角形の描画
	function drawtri(p1, p2, p3) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.closePath();
		context.stroke();
	}


});
