// Botões nativos continuam acessíveis por teclado e controle remoto.
document.querySelectorAll('.guia pre > code').forEach((codigo, indice) => {
  const controles = document.createElement('div');
  controles.className = 'guia-links';
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'btn outline';
  botao.textContent = 'Copiar comandos';
  botao.setAttribute('aria-label', 'Copiar comandos do bloco ' + (indice + 1));
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  botao.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codigo.textContent);
      status.textContent = 'Copiado!';
    } catch (erro) {
      status.textContent = 'Não foi possível copiar. Selecione o texto e copie manualmente.';
    }
  });
  controles.append(botao, status);
  codigo.parentElement.after(controles);
});
