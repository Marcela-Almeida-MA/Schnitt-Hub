# Schnitt Hub

> **O hub inteligente para barbearias modernas.**

O **Schnitt Hub** é uma aplicação web concebida para apoiar a gestão de barbearias, com uma visão de produto voltada para organização, evolução contínua e aplicação prática de princípios de Engenharia de Software.

O projeto não é tratado apenas como um CRUD ou experimento. A proposta é construir uma base de software **organizada, sustentável e preparada para evoluir**, mantendo a complexidade sob controle e evitando que novas funcionalidades transformem o sistema em um monólito desorganizado.

> **Arquitetura primeiro. Código com propósito. Documentação como memória. Decisões conscientes.**

## Visão do Produto

O Schnitt Hub busca centralizar operações relevantes de uma barbearia em uma aplicação única, proporcionando uma experiência de uso simples enquanto sua base técnica evolui de forma incremental.

A visão do produto é construir uma plataforma que possa crescer junto com as necessidades do negócio, adicionando novas funcionalidades sem exigir uma reescrita completa da aplicação.

O produto deve possuir:

* identidade própria;
* domínio bem definido;
* arquitetura clara;
* separação de responsabilidades;
* componentes reutilizáveis;
* baixo acoplamento;
* alta coesão;
* documentação;
* rastreabilidade das decisões;
* capacidade de evolução;
* código legível;
* complexidade controlada.

A arquitetura deve existir para **proteger o sistema**, e não simplesmente para produzir diagramas sofisticados.

## Objetivo

O objetivo do Schnitt Hub é desenvolver uma aplicação moderna para gerenciamento de barbearias, utilizando o projeto como uma aplicação prática de conceitos de Engenharia de Software.

A evolução do sistema segue, de forma pragmática, princípios como:

* **Clean Architecture**;
* **Domain-Driven Design (DDD)**;
* **SOLID**;
* separação de preocupações;
* modularidade;
* componentização;
* baixo acoplamento;
* alta coesão;
* inversão de dependência;
* abstração de infraestrutura;
* documentação orientada a decisões;
* evolução incremental.

A arquitetura deve permitir que as regras de negócio não dependam diretamente de banco de dados, APIs externas, bibliotecas específicas, infraestrutura ou interface gráfica.

## Estado Atual

**Status: desenvolvimento ativo — fundação Front-end.**

O projeto possui atualmente sua base inicial em React e Vite, com estrutura de componentes, páginas, estilos e recursos visuais.

O estado do projeto deve sempre ser descrito com base em evidências reais.

### Implementado

* Aplicação Front-end com React.
* Ambiente de desenvolvimento com Vite.
* Interface moderna e responsiva.
* Estrutura baseada em componentes.
* Organização inicial de páginas, componentes, estilos e assets.
* Navegação da aplicação.
* Configuração de lint.

### Em desenvolvimento / evolução

O produto está sendo preparado para receber funcionalidades de negócio como:

* agendamento de horários;
* gerenciamento de clientes;
* cadastro de serviços;
* dashboard;
* autenticação;
* gestão financeira;
* histórico de atendimentos;
* gerenciamento de profissionais;
* configurações da barbearia.

Esses itens representam a direção de evolução do produto e **não devem ser interpretados como funcionalidades concluídas quando ainda não houver implementação confirmada**.


## Tecnologias Confirmadas

A base atual do projeto utiliza:

### Front-end

* React
* Vite
* JavaScript (ES6+)
* HTML5
* CSS3

### Desenvolvimento

* Git
* GitHub
* ESLint

Tecnologias de backend, banco de dados, autenticação, APIs externas, Docker, CI/CD e infraestrutura de produção em desenvolvimento.

### Implementadas

* Interface moderna e responsiva.
* Componentização da interface.
* Layout adaptável para diferentes dispositivos.
* Estrutura inicial de páginas.
* Navegação da aplicação.

### Em evolução

* Agendamento de horários.
* Cadastro e gerenciamento de clientes.
* Cadastro de serviços.
* Dashboard com indicadores.
* Sistema de autenticação.
* Gestão financeira.
* Histórico de atendimentos.
* Perfil dos profissionais.
* Configurações da barbearia.

### Roadmap técnico

Conforme a maturidade do produto aumentar, poderão ser incorporados:

* persistência de dados;
* API;
* autenticação e autorização;
* testes automatizados;
* integração contínua;
* infraestrutura;
* observabilidade;
* deploy;
* monitoramento.

Esses itens representam **direção futura**, não funcionalidades necessariamente existentes no estado atual.

## Como Executar

### Pré-requisitos

É necessário possuir:

* Node.js;
* npm.

### Clonar o projeto

```bash
git clone https://github.com/Marcela-Almeida-MA/Schnitt-Hub.git
cd Schnitt-Hub
```

### Instalar dependências

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

O Vite disponibilizará no terminal o endereço local da aplicação.

### Gerar build

```bash
npm run build
```

### Executar preview

```bash
npm run preview
```

### Executar lint

```bash
npm run lint
```

## Estrutura Atual

A estrutura inicial do Front-end é organizada da seguinte forma:

```text
src/
├── assets/
├── components/
├── pages/
├── styles/
└── App.jsx
```

Essa estrutura representa o estado atual do projeto.

## Direção Arquitetural

A arquitetura do Schnitt Hub seguirá uma abordagem baseada em **Clean Architecture + conceitos pragmáticos de DDD**.

Conceitualmente:

```text
┌───────────────────────────────┐
│        Apresentação           │
│  páginas · componentes · UI   │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│          Aplicação            │
│ casos de uso · orquestração   │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│           Domínio             │
│ entidades · regras · contratos│
└───────────────┬───────────────┘
                ↑
┌───────────────────────────────┐
│        Infraestrutura         │
│ APIs · persistência · serviços│
└───────────────────────────────┘
```

### Domínio

O domínio representa o núcleo do negócio e deve concentrar entidades, objetos de valor, regras de negócio, contratos e outros elementos necessários ao modelo.

O domínio não deve depender diretamente de React, banco de dados, APIs ou componentes visuais.

### Aplicação

A camada de aplicação representa os casos de uso e a orquestração das operações do sistema.

### Infraestrutura

A infraestrutura concentra implementações concretas, como persistência, APIs, autenticação e serviços externos, quando essas tecnologias forem efetivamente incorporadas ao produto.

### Apresentação

A apresentação concentra páginas, componentes, formulários, navegação e estados visuais.

Regras de negócio complexas não devem ser colocadas diretamente dentro dos componentes React.

---

## Princípios de Desenvolvimento

O desenvolvimento do Schnitt Hub combina:

> **Vibe Coding + Engenharia de Software**

A Inteligência Artificial pode atuar como:

* programadora em pares;
* revisora de código;
* assistente de arquitetura;
* analista de requisitos;
* auxiliar de documentação;
* investigadora de bugs;
* assistente de testes;
* auxiliar de refatoração.

Porém, a IA não substitui a decisão técnica humana.

Decisões arquiteturais relevantes devem ser analisadas, apresentar alternativas quando necessário, avaliar impactos e ser documentadas quando aprovadas.


## Evolução de Funcionalidades

Sempre que aplicável, uma nova funcionalidade deve seguir o fluxo:

```text
Requisito
    ↓
Domínio
    ↓
Caso de uso
    ↓
Contrato
    ↓
Infraestrutura
    ↓
Apresentação
    ↓
Teste
    ↓
Documentação
```

Esse fluxo não deve ser aplicado de maneira dogmática.

Funcionalidades simples não devem receber complexidade arquitetural desnecessária. A regra do projeto é utilizar a menor alteração arquitetural capaz de resolver o problema real.

## Qualidade

O projeto prioriza:

* legibilidade;
* previsibilidade;
* coesão;
* baixo acoplamento;
* reutilização;
* validação;
* segurança;
* acessibilidade;
* responsividade;
* experiência do usuário;
* testes orientados ao comportamento;
* documentação.

A documentação estabelece que testes devem proteger o comportamento esperado do sistema, e não apenas aumentar artificialmente a cobertura.

---

## Segurança

Segurança faz parte da qualidade do produto desde o desenvolvimento.

O projeto deve evitar:

* exposição de segredos;
* credenciais no código;
* tokens versionados;
* informações sensíveis em logs;
* dependência exclusiva de validações visuais;
* exposição desnecessária de dados.

Quando houver backend, a validação da interface não deverá substituir a validação no servidor. Autenticação e autorização também deverão ser tratadas como responsabilidades distintas.

---

## Documentação

A documentação é considerada parte do produto.

O projeto deve manter informações suficientes para que outra pessoa consiga compreender:

* o que é o Schnitt Hub;
* qual problema o produto busca resolver;
* como executar o projeto;
* como o sistema está estruturado;
* quais tecnologias são utilizadas;
* quais funcionalidades existem;
* quais funcionalidades estão em desenvolvimento;
* quais funcionalidades estão planejadas;
* quais decisões arquiteturais foram tomadas;
* quais limitações existem.

Decisões arquiteturais relevantes devem ser registradas por meio de ADRs ou documentação equivalente.

## Roadmap

### Fundação

* [x] React + Vite
* [x] Estrutura inicial do Front-end
* [x] Componentização
* [x] Interface responsiva
* [x] Navegação
* [x] Lint

### Produto

* [ ] Agendamento
* [ ] Clientes
* [ ] Serviços
* [ ] Profissionais
* [ ] Histórico de atendimentos
* [ ] Dashboard
* [ ] Configurações da barbearia

### Plataforma

* [ ] Autenticação
* [ ] Autorização
* [ ] Persistência
* [ ] API
* [ ] Gestão financeira

### Engenharia

* [ ] Testes automatizados
* [ ] CI/CD
* [ ] Observabilidade
* [ ] Infraestrutura de produção
* [ ] Deploy
* [ ] Monitoramento
* [ ] Documentação arquitetural completa



## Regra de Transparência

O Schnitt Hub adota uma regra fundamental:

> **Evidências acima de suposições.**

Nenhuma funcionalidade, tecnologia, integração, infraestrutura, métrica ou resultado deve ser apresentado como existente sem evidência.

As informações devem ser classificadas conforme seu estado real:

| Estado                 | Significado                                             |
| ---------------------- | ------------------------------------------------------- |
| **Implementado**       | Existe e funciona                                       |
| **Em desenvolvimento** | Está sendo implementado                                 |
| **Planejado**          | Existe como intenção futura                             |
| **Não confirmado**     | Não há evidência suficiente para afirmar sua existência |

Essa regra é parte da identidade técnica do projeto.

---

## Filosofia do Projeto

O Schnitt Hub deve transmitir:

> **Arquitetura primeiro.**
> **Código com propósito.**
> **Documentação como ativo.**
> **Decisões conscientes.**
> **Complexidade sob controle.**
> **IA como ferramenta.**
> **Humano como decisor.**
> **Produto acima de código isolado.**

O objetivo não é produzir a maior quantidade de código.

O objetivo é produzir **o máximo de valor com o mínimo de complexidade necessária**.

## Repositório

Código-fonte e evolução do projeto:

**GitHub:**
https://github.com/Marcela-Almeida-MA/Schnitt-Hub

---

## Schnitt Hub

**O hub inteligente para barbearias modernas.**

Um projeto real em evolução, construído para aplicar Engenharia de Software na prática e criar uma base capaz de crescer de forma organizada, sustentável e tecnicamente consciente.
