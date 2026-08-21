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
    {
      kind: "link",
      label: "Demonstração completa",
      href: "https://www.linkedin.com/posts/yamferreira_java-springboot-desenvolvimento-ugcPost-7388970320575049728-_xiG",
      source: "LinkedIn",
      poster: "/projects/cadastro-usuario/demo-poster.jpg",
      caption:
        "Walkthrough do CRUD: as chamadas no Insomnia, a atualização parcial em ação e a conferência no console do H2.",
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
      why: "O e-mail é a chave por onde o usuário é buscado e removido. Deixar a garantia no `@Column(unique = true)` significa que dois cadastros simultâneos não conseguem criar o duplicado. A validação em código sozinha perderia essa corrida.",
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
      "A atualização parcial. Cada campo que vier nulo no corpo cai de volta no valor que já estava gravado, então o cliente pode mandar só o que mudou sem zerar o resto do registro.",
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
