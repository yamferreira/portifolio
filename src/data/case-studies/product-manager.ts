import type { CaseStudy } from "./types";

export const productManager: CaseStudy = {
  slug: "product-manager",
  title: "Product Manager",
  stack: [
    "Java 17",
    "Spring Boot",
    "Spring Data JPA",
    "MySQL",
    "React",
    "Maven",
  ],
  problem:
    "Controlar estoque em planilha funciona até duas pessoas precisarem editar ao mesmo tempo. Este projeto tira o cadastro de produtos do arquivo solto e coloca atrás de uma API, com uma tela para operar o dia a dia.",
  repo: "https://github.com/yamferreira/product-manager",
  apiDocs: null,
  architecture: {
    src: "/projects/product-manager/architecture.svg",
    caption:
      "React (Create React App) chama a API por HTTP → ProdutoControle expõe /listar, /cadastrar, /alterar e /remover/{codigo} → ProdutoServico valida e decide o status → ProdutoRepositorio (Spring Data JPA) persiste no MySQL.",
  },
  demos: [
    // Capturas da aplicação rodando de verdade: back-end em :8080 com
    // MySQL, front do CRA em :3001, dados criados pela própria API.
    {
      kind: "image",
      label: "Lista de produtos",
      src: "/projects/product-manager/lista.png",
      caption:
        "O formulário e a tabela dividem a mesma tela — a listagem vem de GET /listar assim que a página monta.",
    },
    {
      kind: "image",
      label: "Editar produto",
      src: "/projects/product-manager/edicao.png",
      caption:
        "Selecionar uma linha carrega o produto no mesmo formulário e troca o botão de cadastrar por alterar, remover e cancelar — uma tela para as quatro operações.",
    },
  ],
  decisions: [
    {
      decision: "Monorepo com backend/ e frontend/ lado a lado",
      why: "São dois artefatos com ciclos de build diferentes, mas um contrato só. Ficando no mesmo repositório, uma mudança de campo na API e o ajuste da tela cabem no mesmo commit — e nunca existe a dúvida de qual versão do front fala com qual versão da API.",
    },
    {
      decision: "Cadastrar e alterar compartilham o mesmo método do service",
      why: "As duas operações validam exatamente as mesmas regras e terminam no mesmo `save`. O que muda é só o status devolvido — 201 para criação, 200 para atualização —, então duplicar o método significaria duplicar a validação e deixar as duas versões divergirem com o tempo.",
    },
    {
      decision: "Camadas separadas em controle / servico / repositorio",
      why: "O controller não sabe o que é regra de negócio e o service não sabe o que é HTTP — a única coisa que ele devolve de HTTP é o status. Isso mantém a validação testável sem subir a camada web.",
    },
    {
      decision: "Spring Data JPA em vez de SQL escrito à mão",
      why: "O CRUD é inteiramente coberto pelos métodos herdados de `CrudRepository`. Escrever o SQL aqui seria manter código que a biblioteca já gera, sem nenhuma consulta que justifique o controle fino.",
    },
  ],
  snippet: {
    language: "java",
    file: "backend/src/main/java/br/com/api/products/servico/ProdutoServico.java",
    description:
      "Um método para cadastrar e alterar. A validação roda uma vez só para os dois caminhos e o parâmetro `acao` decide apenas o status HTTP da resposta — 201 quando é criação, 200 quando é atualização.",
    code: `@Service
public class ProdutoServico {

    @Autowired
    private ProdutoRepositorio pr;

    @Autowired
    private RespostaModelo rm;

    public ResponseEntity<?> cadastrarAlterar(ProdutoModelo pm, String acao) {

        // As regras valem para os dois caminhos: um produto sem nome ou sem
        // marca é inválido tanto no cadastro quanto na alteração.
        if (pm.getNome().equals("")) {
            rm.setMensagem("O nome do produto é obrigatório!");
            return new ResponseEntity<RespostaModelo>(rm, HttpStatus.BAD_REQUEST);
        } else if (pm.getMarca().equals("")) {
            rm.setMensagem("O nome da marca é obrigatório!");
            return new ResponseEntity<RespostaModelo>(rm, HttpStatus.BAD_REQUEST);
        } else {
            // O save é o mesmo — o JPA decide entre INSERT e UPDATE pelo id.
            // A ação só escolhe o status que volta para o cliente.
            if (acao.equals("cadastrar")) {
                return new ResponseEntity<ProdutoModelo>(pr.save(pm), HttpStatus.CREATED);
            } else {
                return new ResponseEntity<ProdutoModelo>(pr.save(pm), HttpStatus.OK);
            }
        }
    }
}`,
  },
};
