# Checklist de segurança

Este documento é um checklist inicial. Aplicar os itens relevantes à arquitetura real; não pressupõe que um backend exista.

## Segredos e configuração

- [ ] Segredos fora do repositório e do código-fonte.
- [ ] `.env` local ignorado pelo Git e `.env.example` sem valores secretos.
- [ ] Credenciais e tokens ausentes de logs, screenshots e documentação.
- [ ] Dependências e scripts de instalação revisados.

## Autenticação e autorização (se aplicáveis)

- [ ] Autenticação implementada por mecanismo apropriado.
- [ ] Autorização verificada no servidor em cada operação protegida.
- [ ] Permissões negadas por padrão.
- [ ] Acesso a dados isolado por usuário/organização conforme requisitos.
- [ ] Recuperação de conta e sessões avaliadas.
- [ ] Nenhuma chave privilegiada exposta no front-end.

## Dados e entradas

- [ ] Validar entradas no limite de confiança.
- [ ] Evitar injeções com consultas parametrizadas/ORM seguro.
- [ ] Escapar conteúdo renderizado conforme o contexto.
- [ ] Aplicar limites de tamanho e frequência onde necessário.
- [ ] Definir política de retenção, exportação e exclusão.
- [ ] Minimizar coleta de dados pessoais.

## Agendamentos e operação (se aplicáveis)

- [ ] Verificar conflitos de horário de forma segura, inclusive em requisições concorrentes.
- [ ] Validar estado e permissões antes de cancelar ou alterar um agendamento.
- [ ] Definir fuso horário de forma consistente.
- [ ] Não confiar em valores de preço enviados pelo navegador.

## Entrega

- [ ] Dependências atualizadas conforme política do projeto.
- [ ] Erros não revelam stack traces ou detalhes internos a usuários finais.
- [ ] Logs úteis sem excesso de dados pessoais.
- [ ] Backups e restauração testados se houver persistência.
- [ ] HTTPS e configurações de produção revisadas no deploy.

Marque itens somente após verificar evidências e registrar limitações.
