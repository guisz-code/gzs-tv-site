// Busca a versão mais recente e o avatar público diretamente do GitHub.
async function carregarDadosGitHub() {
  const versao = document.getElementById('versao-launcher');
  const avatar = document.getElementById('avatar-github');

  if (!versao || !avatar) return;

  avatar.addEventListener('error', () => { avatar.hidden = true; }, { once: true });

  try {
    const resposta = await fetch('https://api.github.com/repos/guisz-code/GSZ-TV/releases/latest', { cache: 'no-store' });
    if (resposta.ok) {
      const release = await resposta.json();
      if (release.tag_name) {
        versao.textContent = release.tag_name;
        versao.href = release.html_url;
        versao.setAttribute('aria-label', 'Ver versão ' + release.tag_name + ' no GitHub');
      }
    }
  } catch (erro) {
    // Mantém o link para a página de releases como alternativa.
  }

  try {
    const resposta = await fetch('https://api.github.com/users/guisz-code', { cache: 'no-store' });
    if (resposta.ok) {
      const perfil = await resposta.json();
      if (perfil.avatar_url) avatar.src = perfil.avatar_url + '&size=96';
    }
  } catch (erro) {
    // A URL pública do avatar definida no HTML continua como alternativa.
  }
}

// Troca de tema do launcher na página inicial (ciclo ao clicar no botão)
const imagensTema = {
  'gsz-edition': 'assets/img/tema-gsz-edition.png',
  'branco': 'assets/img/tema-branco.png',
  'escuro': 'assets/img/tema-escuro.png'
};

const temas = ['gsz-edition', 'branco', 'escuro'];
const nomesTema = {
  'gsz-edition': 'GSZ Edition',
  'branco': 'Branco',
  'escuro': 'Escuro'
};
let temaAtual = 0;

function alternarTema() {
  temaAtual = (temaAtual + 1) % temas.length;
  const tema = temas[temaAtual];
  const img = document.getElementById('img-tema');
  const botao = document.getElementById('btn-alternar-tema');

  if (!img || !botao) return;

  document.querySelectorAll('[data-indicador-tema]').forEach(indicador => {
    indicador.classList.toggle('ativo', indicador.dataset.indicadorTema === tema);
  });
  botao.setAttribute('aria-label', 'Tema atual: ' + nomesTema[tema] + '. Clique para alternar o tema');
  botao.classList.remove('animando');
  void botao.offsetWidth;
  botao.classList.add('animando');

  img.style.opacity = '0';

  setTimeout(() => {
    img.src = imagensTema[tema];
    img.alt = 'Tela inicial do GSZ TV — tema ' + tema;
    img.style.opacity = '1';
  }, 180);
}

function iniciarPagina() {
  carregarDadosGitHub();

  const botaoTema = document.getElementById('btn-alternar-tema');
  if (!botaoTema) return;

  botaoTema.addEventListener('click', alternarTema);
  botaoTema.addEventListener('animationend', event => {
    if (event.target === event.currentTarget) event.currentTarget.classList.remove('animando');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarPagina);
} else {
  iniciarPagina();
}
