document.addEventListener('DOMContentLoaded', function() {
  const lineWidthRange = document.getElementById('lineWidthRange');
  const currentLineWidth = document.getElementById('currentLineWidth');

  // Obtém o valor inicial do Largura da linha
  chrome.storage.sync.get('lineWidth', function(data) {
    lineWidthRange.value = data.lineWidth || 2;
    currentLineWidth.textContent = `Largura Atual: ${lineWidthRange.value}`;
  });

  // Atualiza o Largura da linha quando o controle deslizante é movido
  lineWidthRange.addEventListener('input', function() {
    const lineWidth = parseInt(lineWidthRange.value);
    currentLineWidth.textContent = `Largura Atual: ${lineWidth}`;

    // Salva o Largura da linha nas configurações da extensão
    chrome.storage.sync.set({ 'lineWidth': lineWidth });
  });
});

