// JavaScript source code
 
function FEM(youngModulus, poissonRatio, thickness) {
	this.pos     = [];				// �ߓ_�̏����ʒu
	this.initpos = [];				// �ߓ_�̌��݈ʒu
	this.tri     = [];				// �O�p�`�v�f�̐ߓ_�ԍ����X�g
	this.u       = [];				// �S�̕ψʃx�N�g��
	this.f       = [];				// �S�̊O�̓x�N�g��
	this.dlist   = [];				// �ψʊ��m�ߓ_���X�g
	this.flist   = [];				// �O�͊��m�ߓ_���X�g
	this.K       = [];				// �����}�g���N�X
	this.young   = youngModulus;	// �����O��
	this.poisson = poissonRatio;	// �|�A�\����
	this.thickness = thickness;		// ����

}
 
// �O�p�`���b�V���������\�b�h
FEM.prototype.generateTriangleMesh = function (width, height, divx, divy) {
	// �ߓ_�̌��݈ʒu�E�����ʒu�̍쐬
	for(var i=0; i<divy+1; i++) {
		for(var j=0; j<divx+1; j++) {
			this.pos.push([width/divx*j-width*0.5, height/divy*i]);
			this.initpos.push([width/divx*j-width*0.5, height/divy*i]);
		}
	}
	// �O�p�`���b�V���̍쐬
	for(var i=0; i<divy; i++) {
		for(var j=0; j<divx; j++) {
			this.tri.push([j+1+(divx+1)*i, j+1+(divx+1)*(i+1), j+(divx+1)*(i+1)]);
			this.tri.push([j+(divx+1)*i, j+1+(divx+1)*i, j+(divx+1)*(i+1)]);
		}
	}
	// �S�̕ψʃx�N�g���̏�����
	this.u=numeric.rep([2*this.pos.length], 0);
}

// �����}�g���N�X�̑g�ݗ���
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

	// �e���}�g���N�X�쐬�֐�
	function calcDmatrix(young, poisson) {
		var D = numeric.rep([3,3], 0);
		D[0][0] = 1.0;
		D[0][1] = poisson;
		D[1][0] = poisson;
		D[1][1] = 1.0;
		D[2][2] = (1.0- poisson)/2.0;
		return numeric.mul(young/(1.0-poisson*poisson), D);
	}

	// �v�f�ʐόv�Z�֐�
	function calcArea(p1, p2, p3) {
		var mat = [
			[1, p1[0], p1[1]], 
			[1, p2[0], p2[1]], 
			[1, p3[0], p3[1]]
			];
		return numeric.det(mat)/2.0;
	}

	// �Ђ���-�ψʃ}�g���N�X�쐬�֐�
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



// ���E�����̐ݒ�
FEM.prototype.setBoundaryCondition = function (zfix, zdisp, disp) {
	 
	this.dlist = [];
	this.flist = [];
		 
	this.u = numeric.rep([2*this.pos.length], 0);
	this.f = numeric.rep([2*this.pos.length], 0);
	 
	// ��ʂ̃m�[�h�ɋ����ψʂ�^����
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
 
// �����������̋���
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