# Backlog 課題連携 WebHook

## 概要

Backlog の課題が作成されたり、コメントが追加された際に、指定した Slack チャンネルにメンション付きで通知を送ります。
これにより、チームメンバーはリアルタイムで Backlog の更新を Slack で確認することができます。

## 構築手順

### 前提条件

- Node.js がインストールされていること

### 手順

1. リポジトリをクローンします。

   ```bash
   git clone git@github.com:fukuhito015/backlog-to-slack.git
   cd backlog-to-slack
   ```

2. 必要なパッケージをインストールします。

   ```bash
   npm i
   ```

3. 環境変数を設定します。.env ファイルをプロジェクトルートに作成し、以下の内容を記入します。

   ```
   BACKLOG_DOMAIN=xxx.backlog.com
   BACKLOG_API_KEY=37...
   SLACK_API_KEY=xoxb-7...
   PORT=3001
   ```

4. 起動
   ```
   npm run start
   ```

## 環境変数

- `BACKLOG_DOMAIN`: Backlog のドメイン (例: `xxx.backlog.com`)
- `BACKLOG_API_KEY`: Backlog の API キー
- `SLACK_API_KEY`: Slack の API キー
- `PORT`: サーバーがリスニングするポート (例: `3001`)

## Backlog WebHook の設定

- 以下の URL を Backlog の WebHook に設定します。

  `https://<ドメイン>/slack-api/webhook/:<slackのチャンネルID>`
