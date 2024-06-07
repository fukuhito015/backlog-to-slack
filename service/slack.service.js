const axios = require('axios')

class SlackService {
  /**
   * slackユーザ一覧を取得
   */
  async getSlackMMembers() {
    const slackToken = process.env.SLACK_API_KEY
    const slackUrl = `https://slack.com/api/users.list`
    const { data } = await axios.get(slackUrl, {
      headers: {
        Authorization: `Bearer ${slackToken}`,
      },
    })
    return data
  }
  /**
   * メールアドレスからslackユーザを検索
   */
  async searchSlackMemberByMail(mailAddress) {
    const slackToken = process.env.SLACK_API_KEY
    const slackUrl = `https://slack.com/api/users.lookupByEmail?email=${mailAddress}`
    const { data } = await axios.get(slackUrl, {
      headers: {
        Authorization: `Bearer ${slackToken}`,
      },
    })
    return data
  }

  /**
   * slack通知送信
   */
  async postSlackMessage(channel, text) {
    console.log({ text })
    const slackToken = process.env.SLACK_API_KEY
    const slackUrl = `https://slack.com/api/chat.postMessage`
    const { data } = await axios.post(
      slackUrl,
      { channel: channel, text: text },
      {
        headers: {
          Authorization: `Bearer ${slackToken}`,
        },
      }
    )
    return data
  }
}

module.exports = new SlackService()
