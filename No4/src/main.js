// JavaScript source code
// HTML��ǂݏI�������Ɏ��s����֐�
$(document).ready(function () {
 
	// FEM�N���X�̃C���X�^���X��
	var young     = 1e6;	// �����O��
	var poisson   = 0.4;	// �|�A�\����
	var thickness = 1.0;	// ����
	var fem=new FEM(young, poisson, thickness);
	 
	// �O�p�`���b�V������
	fem.generateTriangleMesh(200, 200, 10, 10);
 
	// �����}�g���N�X�̑g��
	fem.assembleStiffnessMatrix();
  
	// ���E�����̐ݒ�
	fem.setBoundaryCondition(0, 200, [20, 80]);

	// �����������̋���
	fem.solve();

	// �ψʃx�N�g���ɂ�錻�݌`��̍X�V
	for(var i=0; i<fem.pos.length; i++) {
		for(var j=0; j<2; j++){
			fem.pos[i][j] = fem.initpos[i][j] + fem.u[2*i+j];
		}
	}
	 
	// 2d�R���e�L�X�g�擾
	var canvas  = $("#model_viewer");
	var context = canvas.get(0).getContext("2d");
	canvas.get(0).width  = canvas.get(0).clientWidth;
	canvas.get(0).height = canvas.get(0).clientHeight;
	var canvasWidth  = canvas.get(0).width;
	var canvasHeight = canvas.get(0).height;
 
	// ���W�ϊ�
	var xzero = canvasWidth*0.5; // �L�����o�X�v�f�̕��̔���
	var yzero = canvasHeight*0.9; // �L�����o�X�v�f�̍�����90%�̕���
	context.setTransform(1, 0, 0, -1, xzero, yzero);
 
	// �����`��̕`��
	context.strokeStyle = 'gray';
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.initpos[fem.tri[i][0]], fem.initpos[fem.tri[i][1]], fem.initpos[fem.tri[i][2]]);
	}
 
	// ���݌`��̕`��
	context.strokeStyle = 'black';
	context.fillStyle   = 'gray';
	context.globalAlpha = 0.7;
	for(var i=0; i<fem.tri.length; i++) {
		drawtri(fem.pos[fem.tri[i][0]], fem.pos[fem.tri[i][1]], fem.pos[fem.tri[i][2]]);
		filltri(fem.pos[fem.tri[i][0]], fem.pos[fem.tri[i][1]], fem.pos[fem.tri[i][2]]);
	}
	context.globalAlpha = 1.0;

	// �ߓ_�����O�͂̕`��
	context.strokeStyle = 'red';
	for(var i=0; i<fem.pos.length; ++i) {
		var fScale = 3e-6;
		var fDist = numeric.add(fem.pos[i], [fScale*fem.f[2*i], fScale*fem.f[2*i+1]]);
		drawLine(fem.pos[i], fDist);
	}

	// �ψʊ��m�ߓ_�̕`��
	context.strokeStyle = 'blue';
	context.fillStyle   = 'blue';
	for(var i=0; i<fem.dlist.length; i++) {
		drawCircle(fem.pos[fem.dlist[i]], 2);
	}
 
	// ���̕`��֐�
	function drawLine(p1, p2) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.stroke();
	}
	// �~�̕`��֐�
	function drawCircle(p, radius) {
		context.beginPath();
		context.arc(p[0], p[1], radius, 0, 2*Math.PI, true);
		context.stroke();
		context.fill();
	}
	// �O�p�`�̕`��֐�
	function drawtri(p1, p2, p3) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.closePath();
		context.stroke();
	}
	// �O�p�`�̕`��֐�
	function filltri(p1, p2, p3) {
		context.beginPath();
		context.moveTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		context.closePath();
		context.fill();
	}
});