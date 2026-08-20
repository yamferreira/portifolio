import type { CaseStudy } from "./types";

export const cadastroUsuario: CaseStudy = {
  slug: "cadastro-usuario",
  title: "Cadastro de Usuário",
  stack: ["Java", "Spring Boot", "Spring Data JPA", "H2", "Lombok"],
  problem:
    "Antes de construir qualquer sistema maior, é preciso ter a base do CRUD sem hesitação: onde mora a regra, onde mora o HTTP e onde mora o banco. Este projeto é essa base, reduzida ao mínimo que ainda ensina alguma coisa.",
  repo: "https://github.com/yamferreira/cadastro-usuario",
  apiDocs: null,
  architecture: {
    src: "/projects/cadastro-usuario/architecture.svg",
    caption:
      "Requisição HTTP em /usuario → UsuarioController → UsuarioService (regras e atualização parcial) → UsuarioRepository (Spring Data JPA) → H2 em memória, criado na subida e descartado no fim.",
  },
  demos: [
    // TODO: gravar as chamadas e trocar os caminhos abaixo.
    {
      kind: "video",
      label: "POST /usuario",
      src: "/projects/cadastro-usuario/post-usuario.mp4",
      caption: "Criação de um usuário e conferência no console do H2.",
    },
    {
      kind: "video",
      label: "PUT /usuario?id=1",
      src: "/projects/cadastro-usuario/put-usuario.mp4",
      caption: "Atualização parcial: enviar só o nome não apaga o e-mail.",
    },
  ],
  decisions: [
    {
      decision: "H2 em memória em vez de um banco externo",
      why: "O objetivo é rodar o projeto em um clique, sem instalar nada. O banco nasce vazio a cada execução, o que também deixa qualquer teste manual sempre no mesmo estado inicial.",
    },
    {
      decision: "Atualização parcial: campo nulo mantém o valor antigo",
      why: "Um PUT com só o nome preenchido não pode apagar o e-mail de quem já estava cadastrado. Sem esse cuidado, o `saveAndFlush` gravaria null por cima do dado existente.",
    },
    {
      decision: "E-mail com restrição de unicidade no banco",
      why: "O e-mail é a chave por onde o usuário é buscado e removido. Deixar a garantia no `@Column(unique = true)` significa que dois cadastros simultâneos não conseguem criar o duplicado — a validação em código sozinha perderia essa corrida.",
    },
    {
      decision: "Injeção por construtor, sem @Autowired em campo",
      why: "As dependências ficam finais e explícitas na assinatura, e a classe pode ser instanciada em um teste sem subir o contexto do Spring.",
    },
  ],
  snippet: {
    language: "java",
    file: "src/main/java/com/yamferreira/cadastro_usuario/business/UsuarioService.java",
    description:
      "A atualização parcial. Cada campo que vier nulo no corpo cai de volta no valor que já estava gravado — o cliente pode mandar só o que mudou sem zerar o resto do registro.",
    code: `public void atualizarUsuarioId(Integer id, Usuario usuario) {
    Usuario usuarioEntity = repository.findById(id).orElseThrow(
            () -> new RuntimeException("Usuario não encontrado"));

    // Campo ausente no corpo não é "apagar": é "não mexer". Sem esse
    // fallback, um PUT só com o nome gravaria null por cima do e-mail.
    Usuario usuarioAtualizado = Usuario.builder()
            .email(usuario.getEmail() != null
                    ? usuario.getEmail() : usuarioEntity.getEmail())
            .nome(usuario.getNome() != null
                    ? usuario.getNome() : usuarioEntity.getNome())
            .id(usuarioEntity.getId())
            .build();

    repository.saveAndFlush(usuarioAtualizado);
}`,
  },
};
