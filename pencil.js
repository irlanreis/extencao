// Verifica se o navegador suporta a API PointerEvent
if (!window.PointerEvent) {
  alert("Seu navegador não suporta a API PointerEvent. Este script não funcionará.");
}

// Remove a seleção de texto no corpo do documento
document.body.style.userSelect = "none";

// Cria um elemento canvas para desenho
const canvas = document.createElement("canvas");
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none'; // Garante que o canvas não interfira com os eventos da página
canvas.style.zIndex = '9999'; // Define o z-index para garantir que o canvas esteja acima de outros elementos
canvas.width = window.innerWidth; // Define a largura do canvas como a largura da janela
canvas.height = window.innerHeight; // Define a altura do canvas como a altura da janela
document.body.appendChild(canvas);

// Obtém o contexto 2D do canvas
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'blue';
ctx.lineWidth = 2;

// Redimensiona o canvas quando a janela é redimensionada e mantém a cor
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = 'blue';
  chrome.storage.sync.get('lineWidth', function(data) {
    const lineWidth = data.lineWidth || 2;
    ctx.lineWidth = lineWidth;
  });
});

// Obtém o tamanho da linha das configurações da extensão
chrome.storage.sync.get('lineWidth', function(data) {
  const lineWidth = data.lineWidth || 2;
  ctx.lineWidth = lineWidth;
});

// Adiciona um eventListener para alterações no armazenamento da extensão
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.lineWidth) {
    const newLineWidth = changes.lineWidth.newValue;
    ctx.lineWidth = newLineWidth;
  }
});

// Adiciona um event listener para o evento pointerdown
document.addEventListener("pointerdown", (e) => {
  // Inicia o desenho
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);

  // Adiciona um event listener para o evento pointermove
  function moveListener(e) {
    // Desenha a linha ao mover o mouse
    ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    ctx.stroke();
  }

  document.addEventListener("pointermove", moveListener);

  // Adiciona um event listener para o evento pointerup
  function upListener() {
    // Remove o event listener para o evento pointermove
    document.removeEventListener("pointermove", moveListener);
    document.removeEventListener("pointerup", upListener);
  }

  document.addEventListener("pointerup", upListener);
});

// Adiciona um event listener para o evento contextmenu (botão direito do mouse)
document.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // Impede o menu de contexto padrão
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa todo o conteúdo do canvas
});