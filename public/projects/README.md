# Assets dos case studies

Um diretório por projeto, nomeado com o mesmo `slug` usado em
`src/data/case-studies/`.

## `architecture.svg` — gerado, não desenhado à mão

Sai de `node diagrams/_build.mjs`, da mesma descrição de cena que gera o
`.excalidraw`. Não precisa exportar nada à mão: rodou o script, o
diagrama já aparece na página.

O traço é escuro sobre fundo transparente (o padrão do Excalidraw). A
página é preta, então ela inverte o traço no CSS — por isso não adianta
"corrigir" a cor no arquivo. Se algum dia você colocar aqui um SVG que
já tenha traço claro, marque `invert: false` no case study.

Dois caminhos para mudar um diagrama:

- **Mudança para valer** — edite `diagrams/_scenes.mjs` e rode
  `node diagrams/_build.mjs`. Os dois arquivos saem atualizados e
  continuam iguais um ao outro.
- **Ajuste fino visual** — abra o `.excalidraw` em excalidraw.com,
  arraste o que quiser e exporte o SVG por cima deste arquivo. Só não
  rode o script depois, ou ele sobrescreve o seu export.

O script é determinístico: rodar de novo sem mexer na cena gera
exatamente os mesmos bytes, então ele nunca suja o `git status` sozinho.

## Demonstrações

Essas são manuais. Os caminhos esperados estão no campo `demos` de cada
case study; enquanto o arquivo não existir, a página mostra um espaço
reservado dizendo qual caminho ela procurava.

O campo aceita três formas, e dá para misturar no mesmo projeto:

- `kind: "image"` — captura de tela. É a melhor opção para projeto com
  interface: carrega instantâneo e é fácil de refazer quando a tela muda.
  Use `frame: "phone"` num print de celular, ou a imagem estica pela
  coluna inteira. PNG para telas com texto; JPG só para foto.
- `kind: "video"` — MP4 curto, para mostrar uma chamada de API
  acontecendo. Grave com ScreenToGif ou o gravador do Windows e converta
  para MP4: um `<video muted loop>` roda como GIF e pesa uma fração.
- `kind: "link"` — quando o vídeo é longo demais para hospedar aqui.
  Vira um card com thumbnail clicável para o post original. Para o
  thumbnail, extraia um frame do próprio vídeo em vez de usar a capa da
  rede social, que costuma vir com o botão de play já queimado:

  ```bash
  ffmpeg -ss 660 -i video.mp4 -frames:v 1 -q:v 4 demo-poster.jpg
  ```
