# SEU HOTEL Concierge Digital

Projeto PWA do concierge digital do SEU HOTEL, localizado em Patos/PB.

## Como abrir

Para testes simples, abra `index.html`.

Para instalar como aplicativo e testar o funcionamento offline, publique a pasta em uma hospedagem HTTPS ou execute um servidor local:

```bash
python -m http.server 8000
```

Depois acesse:

- Concierge: `http://localhost:8000`
- Painel: `http://localhost:8000/admin/`

## Painel administrativo

Senha inicial: `1234`

As alterações são salvas no navegador por meio do `localStorage`.

## Estrutura

- `index.html`: página dos hóspedes
- `styles.css`: visual do concierge
- `js/storage.js`: dados compartilhados
- `js/app.js`: funcionalidades da página
- `admin/`: painel administrativo
- `manifest.json`: instalação PWA
- `service-worker.js`: cache e funcionamento offline
- `assets/icons/`: ícones do aplicativo

## Observação

Nesta versão, os dados ficam armazenados somente no navegador usado para editar. A sincronização entre aparelhos exige integração futura com Firebase.


## Recursos da versão interativa

- Tela de carregamento
- Animações durante a navegação
- Modo claro e escuro
- Botão de instalação do aplicativo
- Solicitações por número do apartamento
- Concierge flutuante
- Avaliação da hospedagem
- Efeitos visuais nos cartões
