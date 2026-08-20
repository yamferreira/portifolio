import type { CaseStudy } from "./types";

export const awsEventDrivenCatalog: CaseStudy = {
  slug: "aws-event-driven-catalog",
  title: "AWS Event-Driven Catalog",
  stack: [
    "Java 17",
    "Spring Boot",
    "MongoDB",
    "AWS SNS",
    "AWS SQS",
    "AWS Lambda",
    "Amazon S3",
    "Docker",
    "LocalStack",
  ],
  problem:
    "Quando um produto muda de preço ou descrição, muita coisa precisa saber disso — o catálogo, o relatório do vendedor, quem for entrar depois. Fazer a API avisar cada um deles na mão significa que ela trava junto com o mais lento, e que cada novo interessado exige mexer no código de quem cadastra o produto.",
  repo: "https://github.com/yamferreira/aws-event-driven-catalog",
  // TODO: publicar um Swagger/OpenAPI e apontar aqui.
  apiDocs: null,
  architecture: {
    src: "/projects/aws-event-driven-catalog/architecture.svg",
    caption:
      "POST /api/product → grava no MongoDB → publica no tópico SNS catalog-emit → fila SQS catalog-queue → Lambda consome → grava o JSON no S3, agrupado por ownerId. Em desenvolvimento, SNS, SQS e S3 sobem no LocalStack pelo docker-compose.",
  },
  demos: [
    // A demonstração completa tem 15 minutos e 44 MB. Hospedar isso aqui
    // pesaria mais que o site inteiro, e ninguém assiste a um vídeo de 15
    // minutos no meio de um case study — então vira um card para o post
    // original, com um frame do próprio vídeo como thumbnail.
    {
      kind: "link",
      label: "Demonstração completa",
      href: "https://www.linkedin.com/posts/yamferreira_java-springboot-aws-activity-7434700392405331968-9zQf",
      source: "LinkedIn",
      duration: "15 min",
      poster: "/projects/aws-event-driven-catalog/demo-poster.jpg",
      caption:
        "Walkthrough do sistema: as chamadas no Insomnia, a resposta da API e o evento percorrendo SNS → SQS → Lambda até o arquivo no S3.",
    },
  ],
  decisions: [
    {
      decision: "SNS + SQS entre a API e o consumidor, em vez de chamada direta",
      why: "A API publica o evento e devolve a resposta — ela não espera o processamento nem quebra se o consumidor estiver fora do ar. E como o SNS é fan-out, dá para pendurar um segundo assinante na fila sem tocar em uma linha do código que publica.",
    },
    {
      decision: "O evento é publicado depois do save, dentro do service",
      why: "Só existe evento se o dado realmente entrou no MongoDB. Publicar antes correria o risco de anunciar um produto que a persistência recusou.",
    },
    {
      decision: "MongoDB como base principal, S3 como saída do consumidor",
      why: "Produto e categoria têm formato irregular e leitura por id — casa com documento. O S3 guarda o resultado do processamento assíncrono como JSON por ownerId, que é um caso de arquivo, não de consulta.",
    },
    {
      decision: "LocalStack no docker-compose em vez de conta AWS para rodar",
      why: "SNS, SQS e S3 sobem junto com a aplicação e o script de init cria tópico, fila, assinatura e bucket. Um `docker-compose up --build` levanta o projeto inteiro sem credencial nenhuma — o que também torna o ambiente descartável e reproduzível.",
    },
  ],
  snippet: {
    language: "java",
    file: "src/main/java/com/example/categoria_produto/services/ProductService.java",
    description:
      "O ponto onde a escrita vira evento. O service valida a categoria, grava no MongoDB e só então publica no SNS — a API responde ao cliente sem esperar o consumidor. Quem assina a fila é problema do SNS, não deste método.",
    code: `@Service
public class ProductService {

    private final CategoryService categoryService;
    private final ProductRepository repository;
    private final AwsSnsService snsService;

    public Product insert(ProductDTO productData) {
        // Categoria inexistente derruba a requisição antes de qualquer escrita.
        this.categoryService.getById(productData.categoryId())
                .orElseThrow(CategoryNotFoundException::new);

        Product newProduct = new Product(productData);
        this.repository.save(newProduct);

        // Publica só depois do save: não se anuncia um produto que não entrou.
        // Product.toString() serializa a entidade como JSON — é esse corpo que
        // a Lambda recebe do outro lado da fila.
        this.snsService.publish(new MessageDTO(newProduct.toString()));

        return newProduct;
    }
}`,
  },
};
