# O Pior Programador do Mundo

Um projeto humorístico que simula um formulário de inscrição para a competição do "Pior Programador do Mundo". O formulário é intencionalmente frustrante, cheio de erros e validações absurdas.

## Sobre o Projeto

Este é um site satírico com um formulário de inscrição que sempre encontra "problemas" com os dados do usuário, independentemente do que seja inserido. As mensagens de erro são intencionalmente absurdas e humorísticas, simulando o que seria criado pelo pior desenvolvedor do mundo.

## Tecnologias Utilizadas

- HTML, CSS e JavaScript para o frontend
- Node.js e Express para o backend simples
- Sem banco de dados (armazenamento em memória ou arquivo JSON)

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o servidor em modo de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse `http://localhost:3000` no navegador

## Estrutura do Projeto

```
the-worst-dev/
├── public/           # Arquivos estáticos (HTML, CSS, JS)
│   ├── css/          # Estilos
│   ├── js/           # Scripts
│   └── index.html    # Página principal
├── server/           # Código do servidor
│   └── server.js     # Configuração do Express
├── src/              # Código fonte adicional
├── package.json      # Configuração do projeto
└── README.md         # Documentação
```

## Status do Projeto

Fase 1 (Setup Inicial) - Concluída ✅
- Estrutura básica de pastas criada
- Servidor Express configurado
- Páginas iniciais implementadas

## Próximos Passos

- Implementar o formulário completo de inscrição (Fase 2)
- Desenvolver lógica de erros engraçados (Fase 3)
- Adicionar recursos humorísticos (Fase 4) 