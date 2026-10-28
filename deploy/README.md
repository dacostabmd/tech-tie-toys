# Deploy do Tech Tie Toys na VPS (KVM2)

Este roteiro foi escrito para ser executado pelo Claude Code **dentro da VPS**. Execute uma etapa por vez, mostre o resultado ao usuário e peça confirmação antes das etapas marcadas com **[confirmar]**.

## Regras (leia antes de tudo)

- A VPS é **compartilhada** com outros sistemas (callix-sync, PostgreSQL 14, containers como worker-andamento-processual, axis-waha, dap_api). **Nunca** pare, reinicie, remova ou reconfigure algo que não seja do Tech Tie Toys.
- Antes de editar qualquer arquivo de sistema (Nginx, firewall, fstab, sysctl), faça uma cópia `.bak` com data.
- Se uma porta necessária já estiver em uso, pare e pergunte. Não mate o processo.
- Todos os valores `TROCAR_*` precisam vir do usuário (domínio) ou ser gerados (chaves).

## Homologação sem domínio próprio (sslip.io)

Enquanto não há domínio, use o IP da VPS (`92.113.33.149`) por meio do **sslip.io**: `92-113-33-149.sslip.io` resolve para esse IP e o Let's Encrypt emite certificado válido para ele. O HTTPS é obrigatório: compartilhar tela/microfone só funciona em contexto seguro e o cookie de sessão é `secure` em produção.

Em todo o roteiro, onde estiver `<domínio>` ou `TROCAR_DOMINIO`, use:

| Uso | Valor |
| --- | --- |
| App | `92-113-33-149.sslip.io` |
| LiveKit | `live.92-113-33-149.sslip.io` |
| `LIVEKIT_URL` | `wss://live.92-113-33-149.sslip.io` |

- Não pergunte o domínio na Etapa 1: ele é o acima.
- Se o `certbot` recusar por limite de emissões do sslip.io (domínio público compartilhado), tente de novo mais tarde ou use `nip.io` (`92.113.33.149.nip.io`).
- Libere 80, 443, 7881/tcp, 3478/udp e 50000–60000/udp também no **firewall do painel da Hostinger**, para o time acessar de fora.
- Quando houver domínio: troque o `server_name` no Nginx, rode `certbot --nginx -d <novo> -d live.<novo>` e atualize `LIVEKIT_URL` no `.env.local` e `turn.domain` no `livekit.yaml`; depois `systemctl restart techtietoys` e `docker compose up -d --force-recreate` no LiveKit.

## Etapa 1 — Diagnóstico (só leitura)

```bash
nproc; free -h; swapon --show; df -h /
uptime
node -v 2>/dev/null; docker --version; docker compose version
ss -tulpn | grep -E ':(80|443|3100|7880|7881|3478)\b'
ss -ulpn | awk '{print $5}' | grep -E ':(5[0-9]{4}|60000)$' | head
systemctl is-active nginx caddy apache2 2>/dev/null
ufw status verbose 2>/dev/null || iptables -S | head -40
```

Relate ao usuário: qual servidor web atende as portas 80/443, se há swap, a versão do Node e se as portas acima estão livres. Se o servidor web não for Nginx (Caddy, Traefik etc.), adapte `deploy/nginx/techtietoys.conf` para ele.

Pergunte ao usuário: o **domínio** do app (ex.: `ttt.exemplo.com.br`). O LiveKit usará `live.<domínio>`. Os dois precisam ter registro DNS A apontando para o IP da VPS.

## Etapa 2 — Swap de 4 GB [confirmar]

Hoje a VPS não tem swap e só ~2 GiB de RAM livres; sem swap, falta de memória faz o kernel matar processos de **qualquer** sistema.

```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
sudo cp /etc/fstab /etc/fstab.bak.$(date +%F)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-techtietoys-swap.conf && sudo sysctl --system
```

## Etapa 3 — Usuário, pastas e Node 24

```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin techtietoys 2>/dev/null || true
sudo mkdir -p /opt/techtietoys/{app,livekit}
sudo chown -R techtietoys:techtietoys /opt/techtietoys
```

O app precisa de **Node 24 ou mais novo** (usa `node:sqlite`). Se `node -v` for menor, pergunte ao usuário antes de atualizar — outros sistemas da VPS podem depender da versão atual. Alternativa segura: instalar o Node 24 só para este app (por exemplo, com `fnm`/`nvm` no usuário `techtietoys`) e ajustar o `ExecStart` do serviço para esse binário.

## Etapa 4 — Código e variáveis de ambiente

Pergunte ao usuário como o código chega na VPS (git clone de um repositório ou envio de arquivos). Coloque-o em `/opt/techtietoys/app`.

Gere as chaves do LiveKit:

```bash
echo "LIVEKIT_API_KEY=API$(openssl rand -hex 6)"
echo "LIVEKIT_API_SECRET=$(openssl rand -base64 32 | tr -d '=+/')"
```

Crie `/opt/techtietoys/app/.env.local` (permissão 600, dono `techtietoys`) com:

```
ANTHROPIC_API_KEY=<do usuário>
YOUTUBE_API_KEY=<do usuário, opcional>
LIVEKIT_URL=wss://live.<domínio>
LIVEKIT_API_KEY=<gerado acima>
LIVEKIT_API_SECRET=<gerado acima>
# Supabase: copiar do .env.local do desenvolvedor, se já estiver em uso
```

Build (como `techtietoys`; o `npm ci` precisa instalar as devDependencies, pois o servidor roda com `tsx`):

```bash
cd /opt/techtietoys/app
sudo -u techtietoys npm ci
sudo -u techtietoys npm run build
```

## Etapa 5 — Serviço do app

```bash
sudo cp deploy/systemd/techtietoys.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now techtietoys
sleep 5; curl -sI http://127.0.0.1:3100 | head -1
journalctl -u techtietoys -n 30 --no-pager
```

O serviço usa a porta **3100**, limita a memória a 900 MB e tem prioridade de CPU menor que o padrão, para não prejudicar os outros sistemas.

## Etapa 6 — LiveKit

```bash
sudo cp deploy/livekit/docker-compose.yml deploy/livekit/livekit.yaml /opt/techtietoys/livekit/
sudo nano /opt/techtietoys/livekit/livekit.yaml   # trocar TROCAR_API_KEY, TROCAR_API_SECRET e TROCAR_DOMINIO
cd /opt/techtietoys/livekit && sudo docker compose up -d
sudo docker compose logs --tail 30
```

Use **a mesma** chave e segredo do `.env.local`. O container fica limitado a 768 MB e 1 vCPU.

## Etapa 7 — Firewall [confirmar]

Portas que precisam ficar abertas para a internet (além de 80/443):

| Porta | Protocolo | Uso |
| --- | --- | --- |
| 7881 | TCP | WebRTC por TCP (quando UDP é bloqueado) |
| 3478 | UDP | TURN |
| 50000–60000 | UDP | Mídia WebRTC |

```bash
sudo ufw allow 7881/tcp
sudo ufw allow 3478/udp
sudo ufw allow 50000:60000/udp
```

Não abra 3100 nem 7880: elas ficam só atrás do Nginx. Lembre o usuário de liberar as mesmas portas no **firewall do painel da Hostinger**, se ele estiver ativo.

## Etapa 8 — Nginx e HTTPS [confirmar]

```bash
sudo cp deploy/nginx/techtietoys.conf /etc/nginx/sites-available/techtietoys.conf
sudo sed -i 's/TROCAR_DOMINIO/<domínio>/g' /etc/nginx/sites-available/techtietoys.conf
sudo ln -s /etc/nginx/sites-available/techtietoys.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d <domínio> -d live.<domínio>
```

Use `reload`, nunca `restart`, para não derrubar conexões dos outros sites. Se `nginx -t` falhar, desfaça o link simbólico e mostre o erro.

## Etapa 9 — Verificação

1. Abrir `https://<domínio>`, criar conta e criar uma sala social.
2. Em outro navegador ou aba anônima, entrar na mesma sala: chat, fila e lounge devem aparecer nos dois.
3. Clicar em **Tela**, compartilhar e confirmar que a outra aba vê o vídeo "Ao vivo".
4. Conferir recursos durante o teste:

```bash
systemctl status techtietoys --no-pager | head -5
sudo docker stats --no-stream
free -h; uptime
```

## Etapa 10 — Monitoramento e backup

```bash
sudo apt-get install -y vnstat sqlite3 && sudo systemctl enable --now vnstat
# backup diário do banco às 4h
echo '0 4 * * * techtietoys sqlite3 /opt/techtietoys/app/data/ttt.db ".backup /opt/techtietoys/backup-$(date +\%u).db"' | sudo tee /etc/cron.d/techtietoys-backup
```

Durante um teste com muitas pessoas, observe: `uptime` (load acima de 2 = CPU saturada), `free -h` (swap em uso crescente = falta RAM), `vnstat -l` (banda em tempo real).

## Atualizações

```bash
cd /opt/techtietoys/app
sudo -u techtietoys git pull   # ou novo envio dos arquivos
sudo -u techtietoys npm ci && sudo -u techtietoys npm run build
sudo systemctl restart techtietoys
```

Reiniciar o app derruba a fila e o chat das salas abertas (ficam em memória); prefira horários sem uso.

## Desfazer

```bash
sudo systemctl disable --now techtietoys && sudo rm /etc/systemd/system/techtietoys.service
cd /opt/techtietoys/livekit && sudo docker compose down
sudo rm /etc/nginx/sites-enabled/techtietoys.conf && sudo nginx -t && sudo systemctl reload nginx
sudo ufw delete allow 7881/tcp; sudo ufw delete allow 3478/udp; sudo ufw delete allow 50000:60000/udp
```
