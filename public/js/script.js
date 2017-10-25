const SpeechRecognition = window.speechRecognition ||  window.webkitSpeechRecognition;
const reco = new SpeechRecognition();
const socket = io();

reco.lang = 'en-US';
reco.interimResult = false;

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
document.querySelector('button').addEventListener('click', function(){
	reco.start();
});

reco.addEventListener('result', function(e){
	let last = e.result.length - 1;
	let txt = e.result[last][0].transcrip;
	outputYou.textContent = text;

	console.log('confidence: '+e.result[0][0].confidence);
	socket.emit('chat msg', txt);
});

function synthVoice(text) {
	const synth = window.speechSynthesis;
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = text;
	synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
	synthVoice(replyText);

	if(replyText == '') replyText = '(No answer...)';
	outputBot.textContent = replyText;
});