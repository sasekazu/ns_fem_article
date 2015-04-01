// JavaScript source code
function FEM() {
	this.pos=[];        // ���݈ʒu
	this.initpos=[];    // �����ʒu
	this.tri=[];        // �O�p�`���b�V���̐ߓ_���X�g
	this.u=[];          // �S�̕ψʃx�N�g��
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
