# Estratégia de testes

**Status:** proposta; primeiro identificar as ferramentas e os testes já existentes.

## Princípios

- Testar comportamento observável e regras de negócio.
- Preferir testes determinísticos, rápidos e fáceis de manter.
- Não instalar uma nova ferramenta de testes sem avaliar a configuração atual.
- Não declarar um teste como aprovado sem executá-lo.

## Níveis sugeridos

### 1. Verificações estáticas
- ESLint ou ferramenta já configurada.
- Build de produção.
- Verificação de tipos, caso TypeScript seja adotado.

### 2. Testes unitários
Priorizar regras puras: disponibilidade, duração e conflito de agendamentos, transições de estado, cálculo de valores e permissões — somente depois de os requisitos serem definidos.

### 3. Testes de integração
Se houver backend: validar contratos de API, persistência, autorização e isolamento de dados.

### 4. Testes de interface e ponta a ponta
Cobrir fluxos críticos definidos no MVP, como criar/alterar/cancelar agendamento, quando esses fluxos fizerem parte do produto.

## Critérios de aceite para uma mudança

- [ ] O comportamento esperado está claro.
- [ ] Há testes adequados à complexidade e ao risco.
- [ ] Lint e build foram executados quando disponíveis.
- [ ] Nenhuma regressão conhecida foi introduzida.
- [ ] A documentação foi atualizada quando necessário.

## Relatório de execução

Sempre informar o comando exato, o resultado e eventuais limitações. Se um comando não foi executado, declarar isso explicitamente.
