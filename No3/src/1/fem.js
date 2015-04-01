// JavaScript source code
function FEM() {
	this.pos=[];        // 現在位置
	this.initpos=[];    // 初期位置
	this.tri=[];        // 三角形メッシュの節点リスト
	this.u=[];          // 全体変位ベクトル
}

// 四角形メッシュのノード位置配列
FEM.prototype.rectangleMesh=function (width, height, divx, divy) {
	// 節点の現在位置・初期位置の作成
	for(var i=0; i<divy+1; i++) {
		for(var j=0; j<divx+1; j++) {
			this.pos.push([width/divx*j-width*0.5, height/divy*i]);
			this.initpos.push([width/divx*j-width*0.5, height/divy*i]);
		}
	}
	// 三角形メッシュの作成
	for(var i=0; i<divy; i++) {
		for(var j=0; j<divx; j++) {
			this.tri.push([j+1+(divx+1)*i, j+1+(divx+1)*(i+1), j+(divx+1)*(i+1)]);
			this.tri.push([j+(divx+1)*i, j+1+(divx+1)*i, j+(divx+1)*(i+1)]);
		}
	}
	// 全体変位ベクトルの初期化
	this.u=numeric.linspace(0, 0, 2*this.pos.length);
}
