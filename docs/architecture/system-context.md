# Contexto do sistema

**Status:** rascunho baseado na descrição do produto; validar com a pessoa responsável.

## Propósito

O Schnitt Hub pretende apoiar a gestão de uma barbearia por meio de uma aplicação web.

## Atores e interações candidatas

| Ator | Interação esperada | Status |
|---|---|---|
| Responsável/gestor da barbearia | Gerenciar serviços, profissionais e operação | Planejado; confirmar permissões |
| Profissional/barbeiro | Consultar agenda e histórico de atendimentos | Planejado; confirmar fluxo |
| Cliente da barbearia | Solicitar ou consultar agendamentos | Requisito não confirmado |
| Administrador da plataforma | Gerenciar contas e suporte | Não confirmado |

Os atores acima são hipóteses de modelagem, não funcionalidades implementadas.

## Sistemas externos

Nenhuma integração externa está confirmada. Pagamentos, e-mail, SMS, WhatsApp, calendário e serviços de autenticação devem ser tratados como possibilidades até que os requisitos sejam definidos.

## Limites iniciais

- A interface web faz parte da base conhecida do projeto.
- Backend, banco de dados, APIs e integrações ainda precisam ser inspecionados e/ou decididos.
- Se múltiplas barbearias forem suportadas, o isolamento de dados será um requisito arquitetural crítico.

## Perguntas em aberto

1. O produto será usado por uma única barbearia ou por várias?
2. Cada barbearia poderá ter vários profissionais e funcionários com permissões distintas?
3. O cliente final fará agendamento diretamente no sistema?
4. O agendamento exigirá confirmação, pagamento ou sinal?
5. Haverá controle de caixa, despesas, comissões ou apenas relatórios?
6. Quais notificações são necessárias?
7. Quais dados devem ser exportados ou apagados?
