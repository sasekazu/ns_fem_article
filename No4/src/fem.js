// JavaScript source code
 
function FEM(youngModulus, poissonRatio, thickness) {
	this.pos     = [];				// 節点の初期位置
	this.initpos = [];				// 節点の現在位置
	this.tri     = [];				// 三角形要素の節点番号リスト
	this.u       = [];				// 全体変位ベクトル
	this.f       = [];				// 全体外力ベクトル
	this.dlist   = [];				// 変位既知節点リスト
	this.flist   = [];				// 外力既知節点リスト
	this.K       = [];				// 剛性マトリクス
	this.young   = youngModulus;	// ヤング率
	this.poisson = poissonRatio;	// ポアソン比
	this.thickness = thickness;		// 厚さ

}
 
// 三角形メッシュ生成メソッド
FEM.prototype.generateTriangleMesh = function (width, height, divx, divy) {
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
	this.u=numeric.rep([2*this.pos.length], 0);
}

// 剛性マトリクスの組み立て
FEM.prototype.assembleStiffnessMatrix = function(){

	this.K = numeric.rep([2*this.pos.length, 2*this.pos.length], 0);

	var D  = calcDmatrix(this.young, this.poisson);
	for(var e = 0; e < this.tri.length; ++e) {

		// calc elementa data
		var area = calcArea(
			this.pos[this.tri[e][0]], 
			this.pos[this.tri[e][1]], 
			this.pos[this.tri[e][2]]
			);
		var Be = calcBmatrix(
			this.pos[this.tri[e][0]], 
			this.pos[this.tri[e][1]], 
			this.pos[this.tri[e][2]],
			area
			);
		var Ke = numeric.dot(numeric.transpose(Be), D);	// Be.transpoes() * D
		Ke = numeric.dot(Ke, Be);						// Be.transpoes() * D * Be
		Ke = numeric.mul(Ke, area*this.thickness);		// Be.transpoes() * D * Be * Ae * t

		// assemble
		for(var i = 0; i < 3; ++i) {
			for(var j = 0; j < 3; ++j) {
				for(var k = 0; k < 2; ++k) {
					for(var l = 0; l < 2; ++l) {
						this.K[2*this.tri[e][i]+k][2*this.tri[e][j]+l] += Ke[2*i+k][2*j+l];
					}
				}
			}
		}
	}

	// 弾性マトリクス作成関数
	function calcDmatrix(young, poisson) {
		var D = numeric.rep([3,3], 0);
		D[0][0] = 1.0;
		D[0][1] = poisson;
		D[1][0] = poisson;
		D[1][1] = 1.0;
		D[2][2] = (1.0- poisson)/2.0;
		return numeric.mul(young/(1.0-poisson*poisson), D);
	}

	// 要素面積計算関数
	function calcArea(p1, p2, p3) {
		var mat = [
			[1, p1[0], p1[1]], 
			[1, p2[0], p2[1]], 
			[1, p3[0], p3[1]]
			];
		return numeric.det(mat)/2.0;
	}

	// ひずみ-変位マトリクス作成関数
	function calcBmatrix(p1, p2, p3, area) {
		var B = numeric.rep([3, 6], 0);
		B[0][0] = p2[1] - p3[1];
		B[0][2] = p3[1] - p1[1];
		B[0][4] = p1[1] - p2[1];
		B[1][1] = p3[0] - p2[0];
		B[1][3] = p1[0] - p3[0];
		B[1][5] = p2[0] - p1[0];
		B[2][0] = p3[0] - p2[0];
		B[2][1] = p2[1] - p3[1];
		B[2][2] = p1[0] - p3[0];
		B[2][3] = p3[1] - p1[1];
		B[2][4] = p2[0] - p1[0];
		B[2][5] = p1[1] - p2[1];
		return numeric.mul(1.0/(2.0*area), B);
	}
}



// 境界条件の設定
FEM.prototype.setBoundaryCondition = function (zfix, zdisp, disp) {
	 
	this.dlist = [];
	this.flist = [];
		 
	this.u = numeric.rep([2*this.pos.length], 0);
	this.f = numeric.rep([2*this.pos.length], 0);
	 
	// 底面のノードに強制変位を与える
	for(var i=0; i<this.pos.length; i++){
		if(this.initpos[i][1] === zfix){
			this.u[2*i]   = 0;
			this.u[2*i+1] = 0;
			this.dlist.push(i);
		}else if(this.initpos[i][1] === zdisp){
			this.u[2*i]   = disp[0];
			this.u[2*i+1] = disp[1];
			this.dlist.push(i);
		}else{
			this.f[2*i]   = 0;
			this.f[2*i+1] = 0;
			this.flist.push(i);
		}
	}
	 
}
 
// 剛性方程式の求解
FEM.prototype.solve = function (){
 
	// make ud
	var ud = [];
	for(var i=0; i<this.dlist.length; ++i){
		for(var j = 0; j < 2; ++j) {
			ud.push(this.u[2*this.dlist[i]+j]);
		}
	}

	// make ff
	var ff = [];
	for(var i=0; i<this.flist.length; ++i){
		for(var j = 0; j < 2; ++j) {
			ff.push(this.f[2*this.flist[i]+j]);
		}
	}

	// make Kff
	var Kff = numeric.rep([2*this.flist.length, 2*this.flist.length], 0);
	for(var i = 0; i < this.flist.length; ++i) {
		for(var j = 0; j < this.flist.length; ++j) {
			for(var k = 0; k < 2; ++k) {
				for(var l = 0; l < 2; ++l) {
					Kff[2*i+k][2*j+l] = this.K[2*this.flist[i]+k][2*this.flist[j]+l];
				}
			}
		}
	}

	// make Kfd
	var Kfd = numeric.rep([2*this.flist.length, 2*this.dlist.length], 0);
	for(var i = 0; i < this.flist.length; ++i) {
		for(var j = 0; j < this.dlist.length; ++j) {
			for(var k = 0; k < 2; ++k) {
				for(var l = 0; l < 2; ++l) {
					Kfd[2*i+k][2*j+l] = this.K[2*this.flist[i]+k][2*this.dlist[j]+l];
				}
			}
		}
	}

	// make Kdf
	var Kdf = numeric.transpose(Kfd);

	// make Kdd
	var Kdd = numeric.rep([2*this.dlist.length, 2*this.dlist.length], 0);
	for(var i = 0; i < this.dlist.length; ++i) {
		for(var j = 0; j < this.dlist.length; ++j) {
			for(var k = 0; k < 2; ++k) {
				for(var l = 0; l < 2; ++l) {
					Kdd[2*i+k][2*j+l] = this.K[2*this.dlist[i]+k][2*this.dlist[j]+l];
				}
			}
		}
	}

	// solve
	var b = numeric.clone(ff);					// ff
	b = numeric.sub(b, numeric.dot(Kfd, ud));	// ff - Kfd * ud
	var uf = numeric.solve(Kff, b);				// solve Kff * uf = ff - Kfd * ud

	// fd = Kdf * uf + Kdd * ud
	var fd = numeric.add(numeric.dot(Kdf, uf), numeric.dot(Kdd, ud));

	// update u
	for(var i = 0; i < this.flist.length; ++i) {
		for(var j = 0; j < 2; ++j) {
			this.u[2*this.flist[i]+j] = uf[2*i+j];
		}
	}

	// update f
	for(var i = 0; i < this.dlist.length; ++i) {
		for(var j = 0; j < 2; ++j) {
			this.f[2*this.dlist[i]+j] = fd[2*i+j];
		}
	}
	 
}