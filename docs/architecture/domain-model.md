# Modelo de domínio inicial

**Status:** hipóteses para discussão. Não criar tabelas ou classes apenas com base neste rascunho.

## Conceitos candidatos

| Conceito | Responsabilidade possível | Questões a confirmar |
|---|---|---|
| Barbearia | Unidade/negócio gerenciado no sistema | Uma conta pode gerenciar mais de uma unidade? |
| Usuário | Identidade que acessa o sistema | Quais métodos de autenticação e perfis serão aceitos? |
| Profissional | Pessoa que presta serviços | É também um usuário? Pode atuar em mais de uma unidade? |
| Cliente | Pessoa que recebe o serviço | Precisa de conta? Como evitar duplicidade? |
| Serviço | Serviço oferecido, duração e preço | Preço e duração podem variar por profissional? |
| Agendamento | Reserva de horário para serviço | Estados, cancelamento, tolerância e conflitos? |
| Atendimento | Registro da execução do serviço | É diferente de agendamento concluído? |
| Transação financeira | Entrada, saída ou pagamento | Faz parte da primeira versão? Quais estados e conciliação? |

## Regras candidatas a validar

- Um agendamento deve referenciar a barbearia, o serviço, o horário e os participantes necessários.
- A disponibilidade deve considerar duração do serviço e conflitos de agenda.
- Alterações de preço não devem reescrever silenciosamente o histórico de atendimentos.
- Se houver múltiplas barbearias, cada consulta e operação deve respeitar o escopo de acesso autorizado.
- Datas e horários devem ter uma política explícita de fuso horário.

Essas regras são sugestões para descoberta de requisitos, não requisitos aprovados.

## Próximo passo

Realizar uma sessão de definição do MVP, definir termos e estados do domínio e então registrar as regras confirmadas em testes. Só depois projetar persistência e contratos de API.
