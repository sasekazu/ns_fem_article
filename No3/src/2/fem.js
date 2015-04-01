// JavaScript source code
function FEM() {
	this.pos=[];        // 現在位置
	this.initpos=[];    // 初期位置
	this.tri=[];        // 三角形メッシュの節点リスト
	this.u=[];          // 全体変位ベクトル
	this.f=[];			// 全体外力ベクトル
	this.dlist=[];		// 変位既知節点リスト
	this.flist=[];		// 外力既知節点リスト
	this.ud=[];			// 変位ベクトルの既知部分 
	this.ff=[];			// 外力ベクトルの既知部分
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

// 境界条件の設定（周辺のすべてのノードを強制変位）
FEM.prototype.setBoundary=function (zfix, zdisp, disp) {

	this.dlist=[];
	this.flist=[];
	this.ud=[];
	this.ff=[];

	var nodeToDF=numeric.linspace(0, 0, this.pos.length);
	this.u=numeric.linspace(0, 0, 2*this.pos.length);
	this.f=numeric.linspace(0, 0, 2*this.pos.length);

	// 底面のノードに強制変位を与える
	for(var i=0; i<this.pos.length; i++) {
		if(this.initpos[i][1]==zfix) {
			this.u[2*i]=0;
			this.u[2*i+1]=0;
			nodeToDF[i]="d";
		} else if(this.initpos[i][1]==zdisp) {
			this.u[2*i]=disp[0];
			this.u[2*i+1]=disp[1];
			nodeToDF[i]="d";
		} else {
			this.f[2*i]=0;
			this.f[2*i+1]=0;
			nodeToDF[i]="f";
		}
	}

	// dlist, flist, ud, ffの作成
	for(var i=0; i<this.pos.length; i++) {
		if(nodeToDF[i]=="d") {
			this.dlist.push(i);
			this.ud.push(this.u[2*i]);
			this.ud.push(this.u[2*i+1]);
		} else {
			this.flist.push(i);
			this.ff.push(this.f[2*i]);
			this.ff.push(this.f[2*i+1]);
		}
	}
}
