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
  'gsz-edition': 'assets/img/tema-gsz-edition.webp',
  'branco': 'assets/img/tema-branco.webp',
  'escuro': 'assets/img/tema-escuro.webp'
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

// Ativa controles de navegação para TVs e navegadores de Smart TV.
function detectarTV() {
  const agente = navigator.userAgent || '';
  return /Android TV|Google TV|Smart-TV|SmartTV|Tizen|Web0S|webOS|BRAVIA|AFT[A-Z0-9]*|Fire TV|NetCast|HbbTV|Viera|Roku|Philips.*TV/i.test(agente);
}

function navegarComSetas(event) {
  const direcoes = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    DPAD_UP: 'up', DPAD_DOWN: 'down', DPAD_LEFT: 'left', DPAD_RIGHT: 'right'
  };
  const direcao = direcoes[event.key] || ({ 37: 'left', 38: 'up', 39: 'right', 40: 'down' })[event.keyCode];
  if (!direcao || event.altKey || event.ctrlKey || event.metaKey) return;

  const ativo = document.activeElement;
  if (ativo && (ativo.matches('input, textarea, select, [contenteditable="true"]') || ativo.isContentEditable)) return;

  const focaveis = [...document.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')]
    .filter(elemento => {
      const fechado = elemento.closest('details:not([open])');
      return (!fechado || elemento === fechado.querySelector('summary')) &&
        elemento.getClientRects().length > 0 && getComputedStyle(elemento).visibility !== 'hidden';
    });
  if (!focaveis.length) return;

  // Usa o elemento em foco como âncora mesmo quando ele é um título com tabindex="-1".
  const ancora = ativo && ativo !== document.body && ativo.getClientRects().length > 0 ? ativo : null;
  const origem = ancora ? ancora.getBoundingClientRect() : null;
  let candidatos;

  if (!origem) {
    candidatos = focaveis.map(elemento => ({ elemento, rect: elemento.getBoundingClientRect() }));
    candidatos.sort((a, b) => {
      const score = ({ up: r => -r.top, down: r => r.top, left: r => -r.left, right: r => r.left })[direcao];
      return score(a.rect) - score(b.rect);
    });
  } else {
    const ox = origem.left + origem.width / 2;
    const oy = origem.top + origem.height / 2;
    candidatos = focaveis.filter(elemento => elemento !== ativo).map(elemento => {
      const rect = elemento.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - ox;
      const dy = rect.top + rect.height / 2 - oy;
      const principal = direcao === 'right' ? dx : direcao === 'left' ? -dx : direcao === 'down' ? dy : -dy;
      const cruzado = direcao === 'left' || direcao === 'right' ? Math.abs(dy) : Math.abs(dx);
      return { elemento, principal, cruzado, score: principal + cruzado * 1.7 };
    }).filter(item => item.principal > 4).sort((a, b) => a.score - b.score);
  }

  const proximo = candidatos[0] && candidatos[0].elemento;
  if (!proximo) return;

  event.preventDefault();
  proximo.focus({ preventScroll: true });
  proximo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

// Guia de instalação: mostra apenas o caminho escolhido pelo visitante.
function iniciarGuiaInstalacao() {
  const guia = document.querySelector('[data-guia-app]');
  if (!guia) return;

  const paineis = [...guia.querySelectorAll('[data-painel]')];
  const links = [...guia.querySelectorAll('[data-guia]')];
  const ids = paineis.map(painel => painel.id);

  function mostrar(id, opcoes = {}) {
    if (!ids.includes(id)) id = ids[0];

    paineis.forEach(painel => { painel.hidden = painel.id !== id; });
    links.forEach(link => {
      if (link.dataset.guia === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    if (opcoes.atualizarHash !== false && history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }

    if (opcoes.rolarPara) {
      const painel = document.getElementById(id);
      painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const titulo = painel.querySelector('h2');
      if (titulo) {
        titulo.setAttribute('tabindex', '-1');
        titulo.focus({ preventScroll: true });
      }
    }
  }

  guia.addEventListener('click', evento => {
    const link = evento.target.closest('[data-guia]');
    if (!link) return;
    evento.preventDefault();
    mostrar(link.dataset.guia, { rolarPara: true });
  });

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (ids.includes(id)) mostrar(id, { rolarPara: true });
  });

  const inicial = window.location.hash.slice(1);
  mostrar(ids.includes(inicial) ? inicial : ids[0], { atualizarHash: false });

  if (ids.includes(inicial)) {
    const destino = document.getElementById(inicial);
    const alinhar = () => destino.scrollIntoView({ block: 'start' });
    alinhar();
    // Reaplica depois do load para o navegador não restaurar o scroll no meio.
    window.addEventListener('load', alinhar, { once: true });
  }
}

function iniciarPagina() {
  carregarDadosGitHub();
  iniciarGuiaInstalacao();

  if (detectarTV()) {
    document.documentElement.classList.add('tv-mode');
    // Paradas de leitura evitam saltar instruções longas ao navegar com o controle.
    document.querySelectorAll('.guia p, .guia li, .guia pre, .guia dd').forEach(elemento => {
      elemento.tabIndex = 0;
    });
    const dicaTV = document.getElementById('tv-navigation-hint');
    if (dicaTV) dicaTV.hidden = false;
    document.addEventListener('keydown', navegarComSetas);
  }

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
