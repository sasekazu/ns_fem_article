// JavaScript source code
// HTMLを読み終わった後に実行する関数
$(document).ready(function () {
 
	// FEMクラスのインスタンス化
	var young     = 1e6;	// ヤング率
	var poisson   = 0.4;	// ポアソン比
	var thickness = 1.0;	// 厚さ
	var fem=new FEM(young, poisson, thickness);
	 
	// 三角形メッシュ生成
	fem.generateTriangleMesh(200, 200, 10, 10);
 
	// 剛性マトリクスの組立
	fem.assembleStiffnessMatrix();
  
	// 境界条件の設定
	fem.setBoundaryCondition(0, 200, [20, 80]);

	// 剛性方程式の求解
	fem.solve();

	// 変位ベクトルによる現在形状の更新
	for(var i=0; i<fem.pos.length; i++) {
		for(var j=0; j<2; j++){
			fem.pos[i][j] = fem.initpos[i][j] + fem.u[2*i+j];
		}
	}
	 
	// 2dコンテキスト取得
	var canvas  = $("#model_viewer");
	var context = canvas.get(0).getContext("2d");
	canvas.get(0).width  = canvas.get(0).clientWidth;
	canvas.get(0).height = canvas.get(0).clientHeight;
	var canvasWidth  = canvas.get(0).width;
	var canvasHeight = canvas.get(0).height;
 
	// 座標変換
	var xzero = canvasWidth*0.5; // キャンバス要素の幅の半分
	var yzero = canvasHeight*0.9; // キャンバス要素の高さの90%の部分
	context.setTransform(1, 0, 0, -1, xzero, yzero);
 
	// 初期形状の描画
	context.strokeStyle = 'gray';
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.initpos[fem.tri[i][0]], fem.initpos[fem.tri[i][1]], fem.initpos[fem.tri[i][2]]);
	}
 
	// 現在形状の描画
	context.strokeStyle = 'black';
	context.fillStyle   = 'gray';
	context.globalAlpha = 0.7;
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.pos[fem.tri[i][0]], fem.pos[fem.tri[i][1]], fem.pos[fem.tri[i][2]]);
		filltri(fem.pos[fem.tri[i][0]], fem.pos[fem.tri[i][1]], fem.pos[fem.tri[i][2]]);
	}
	context.globalAlpha = 1.0;

	// 節点等価外力の描画
	context.strokeStyle = 'red';
	for(var i=0; i<fem.pos.length; ++i) {
		var fScale = 3e-6;
		var fDist = numeric.add(fem.pos[i], [fScale*fem.f[2*i], fScale*fem.f[2*i+1]]);
		drawLine(fem.pos[i], fDist);
	}

	// 変位既知節点の描画
	context.strokeStyle = 'blue';
	context.fillStyle   = 'blue';
	for(var i=0; i<fem.dlist.length; i++) {
		drawCircle(fem.pos[fem.dlist[i]], 2);
	}
 
	// 線の描画関数
	function drawLine(p1, p2) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.stroke();
	}
	// 円の描画関数
	function drawCircle(p, radius) {
		context.beginPath();
		context.arc(p[0], p[1], radius, 0, 2*Math.PI, true);
		context.stroke();
		context.fill();
	}
	// 三角形の描画関数
	function drawtri(p1, p2, p3) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.closePath();
		context.stroke();
	}
	// 三角形の描画関数
	function filltri(p1, p2, p3) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.closePath();
		context.fill();
	}
});