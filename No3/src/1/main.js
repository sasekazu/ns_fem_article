// JavaScript source code
// HTML��ǂݏI�������Ɏ��s����֐�
$(document).ready(function () {
	// 2d�R���e�L�X�g�擾
	var canvas=$("#model_viewer");
	var context=canvas.get(0).getContext("2d");
	canvas.get(0).width=canvas.get(0).clientWidth;
	canvas.get(0).height=canvas.get(0).clientHeight;
	var canvasWidth=canvas.get(0).width;
	var canvasHeight=canvas.get(0).height;

	// ���W�ϊ�
	var xzero=canvasWidth*0.5; // �L�����o�X�v�f�̕��̔���
	var yzero=canvasHeight*0.9; // �L�����o�X�v�f�̍�����90%�̕���
	context.setTransform(1, 0, 0, -1, xzero, yzero);

	// FEM�N���X�̃C���X�^���X��
	var fem=new FEM();
	fem.rectangleMesh(200, 200, 2, 2);

	// �ψʃx�N�g���̐ݒ�
	fem.u[2*3]=-40;
	fem.u[2*3+1]=-20;
	fem.u[2*4+1]=-20;
	fem.u[2*5]=40;
	fem.u[2*5+1]=-20;
	fem.u[2*6+1]=-40;
	fem.u[2*7+1]=-40;
	fem.u[2*8+1]=-40;

	// �ψʃx�N�g���ɂ�錻�݌`��̍X�V
	for(var i=0; i<fem.pos.length; i++) {
		for(var j=0; j<2; j++){
			fem.pos[i][j]=fem.initpos[i][j]+fem.u[2*i+j];
		}
	}
	// �����`��̕`��
	context.strokeStyle='black';
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.initpos[fem.tri[i][0]], fem.initpos[fem.tri[i][1]], fem.initpos[fem.tri[i][2]]);
	}
	// ���݌`��̕`��
	context.strokeStyle='red';
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.pos[fem.tri[i][0]], fem.pos[fem.tri[i][1]], fem.pos[fem.tri[i][2]]);
	}

	// �`��p�֐�

	// ���̕`��
	function drawLine(p1, p2) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.stroke();
	}

	// �~�̕`��
	function drawCircle(p, radius) {
		context.beginPath();
		context.arc(p[0], p[1], radius, 0, 2*Math.PI, true);
		context.stroke();
		context.fill();
	}

	// �O�p�`�̕`��
	function drawtri(p1, p2, p3) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.closePath();
		context.stroke();
	}


});