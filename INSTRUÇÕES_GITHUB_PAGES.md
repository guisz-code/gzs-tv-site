# Como publicar o site do GSZ TV no GitHub Pages (grátis)

## 1. Crie o repositório no GitHub

1. Acesse [github.com](https://github.com) e crie um novo repositório público chamado `gzs-tv-site`.
2. Não inicialize com README (já temos os arquivos).

## 2. Envie os arquivos

Na pasta local `C:\Users\user\PROJETOS_GSZ\gzs-tv-site\`, você tem:

```
gzs-tv-site/
├── index.html
├── style.css
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── INSTRUÇÕES_GITHUB_PAGES.md
└── assets/
    ├── logo-gsz-tv.png
    └── tela-inicial.png
```

Envie **todos** esses arquivos para a **raiz** do repositório `gzs-tv-site` no GitHub (pelo site ou pelo Git).

## 3. Ative o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)`.
4. Clique em **Save**.

## 4. Acesse o site

Em alguns minutos, o site estará online em:

```
https://guisz-code.github.io/gzs-tv-site/
```

## 5. Atualizações futuras

Toda vez que fizer alteração nos arquivos e enviar para o `main`, o GitHub Pages atualiza automaticamente.

## 6. Aparecer no Google

1. Acesse [Google Search Console](https://search.google.com/search-console).
2. Adicione a propriedade `https://guisz-code.github.io/gzs-tv-site/`.
3. Verifique a propriedade (método HTML tag ou DNS).
4. Vá em **Inspeção de URL**, cole o endereço do site e clique em **Solicitar indexação**.

> **Importante:** se você mudar o nome do repositório, atualize as URLs no `index.html` (canonical, og:url, twitter:url), `robots.txt` e `sitemap.xml`.
