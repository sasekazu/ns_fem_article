// JavaScript source code
function FEM() {
	this.pos=[];        // ���݈ʒu
	this.initpos=[];    // �����ʒu
	this.tri=[];        // �O�p�`���b�V���̐ߓ_���X�g
	this.u=[];          // �S�̕ψʃx�N�g��
	this.f=[];			// �S�̊O�̓x�N�g��
	this.dlist=[];		// �ψʊ��m�ߓ_���X�g
	this.flist=[];		// �O�͊��m�ߓ_���X�g
	this.ud=[];			// �ψʃx�N�g���̊��m���� 
	this.ff=[];			// �O�̓x�N�g���̊��m����
}

// �l�p�`���b�V���̃m�[�h�ʒu�z��
FEM.prototype.rectangleMesh=function (width, height, divx, divy) {
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
	this.u=numeric.linspace(0, 0, 2*this.pos.length);
}

// ���E�����̐ݒ�i���ӂ̂��ׂẴm�[�h�������ψʁj
FEM.prototype.setBoundary=function (zfix, zdisp, disp) {

	this.dlist=[];
	this.flist=[];
	this.ud=[];
	this.ff=[];

	var nodeToDF=numeric.linspace(0, 0, this.pos.length);
	this.u=numeric.linspace(0, 0, 2*this.pos.length);
	this.f=numeric.linspace(0, 0, 2*this.pos.length);

	// ��ʂ̃m�[�h�ɋ����ψʂ�^����
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

	// dlist, flist, ud, ff�̍쐬
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
