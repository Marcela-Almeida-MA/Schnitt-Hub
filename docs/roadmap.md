# Roadmap proposto

Este roadmap é uma sequência sugerida, não um relatório de funcionalidades concluídas. Ajustar após auditar o repositório e validar o MVP.

## Etapa 0 — conhecer o estado atual

- [ ] Inspecionar arquivos, dependências e scripts.
- [ ] Executar lint e build disponíveis.
- [ ] Verificar navegação, componentes e páginas existentes.
- [ ] Identificar testes e problemas concretos.
- [ ] Atualizar a documentação com evidências.

**Saída:** relatório do estado atual e lista priorizada de lacunas.

## Etapa 1 — definir o MVP

- [ ] Definir usuários e permissões.
- [ ] Definir fluxos prioritários.
- [ ] Confirmar se haverá agendamento por clientes.
- [ ] Definir o escopo financeiro.
- [ ] Definir se o produto atende uma ou várias barbearias.
- [ ] Estabelecer critérios de aceite.

**Saída:** requisitos verificáveis e limites claros do MVP.

## Etapa 2 — validar arquitetura

- [ ] Validar organização do front-end.
- [ ] Decidir se o backend é necessário para o MVP.
- [ ] Selecionar persistência e autenticação, se necessárias.
- [ ] Registrar decisões em ADRs.
- [ ] Definir estratégia de testes e configuração por ambiente.

## Etapa 3 — entregar fatias verticais

Para cada funcionalidade: interface, regras, persistência/API quando aplicável, autorização, testes e documentação.

Ordem candidata, sujeita aos requisitos:
1. serviços e profissionais;
2. agenda e agendamentos;
3. clientes e histórico;
4. dashboard;
5. recursos financeiros, se estiverem no MVP;
6. configurações e relatórios.

## Etapa 4 — preparar lançamento

- [ ] Revisão de segurança e permissões.
- [ ] Testes dos fluxos críticos.
- [ ] Logs sem segredos ou dados sensíveis desnecessários.
- [ ] Backups e recuperação, se houver banco de dados.
- [ ] Configuração de ambientes e deploy.
- [ ] Documentação de operação e suporte.

## Critério para concluir uma etapa

A etapa só deve ser marcada como concluída após evidências verificáveis: código presente, checks executados e critérios de aceite atendidos.
