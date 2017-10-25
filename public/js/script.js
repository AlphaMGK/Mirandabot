const socket = io();


const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const reco = new SpeechRecognition();

reco.lang = 'en-US';
reco.interimResult = false;
reco.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', function(){
	reco.start();
});
reco.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

reco.addEventListener('result', function(e){
	let last = e.result.length - 1;
	let text = e.result[last][0].transcrip;
	outputYou.textContent = text;

	console.log('confidence: '+e.result[0][0].confidence);
	socket.emit('chat msg', text);
});
reco.addEventListener('speechend', () => {
  recognition.stop();
});

reco.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
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