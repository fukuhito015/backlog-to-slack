const axios = require('axios')
const SlackService = require('./slack.service')

const BACKLOG_API_KEY = process.env.BACKLOG_API_KEY
const BACKLOG_DOMAIN = process.env.BACKLOG_DOMAIN

class BacklogService {
  pickMentionUserMailAddresses(text, backlogUsers) {
    const mentions = text.match(/@\S+/g)
    const mailAddresses = (mentions || [])
      .map((backlogMention) => {
        const backlogUser = backlogUsers.find((allBacklogUser) => `@${allBacklogUser.name}` === backlogMention)
        return backlogUser ? backlogUser.mailAddress : ''
      })
      .filter(Boolean)
    return mailAddresses
  }

  /**
   * slackのメンションユーザのID配列をセット
   */
  async setSlackMentions(mailAddresses) {
    const mentions = []
    for (const mailAddress of mailAddresses) {
      try {
        const data = await SlackService.searchSlackMemberByMail(mailAddress)
        const user = data.user
        mentions.push(`<@${user.id}>`)
      } catch (err) {
        console.trace(err)
      }
    }
    return mentions
  }

  /**
   * backlogの全ユーザ取得
   */
  async getBacklogMembers() {
    const url = `https://${BACKLOG_DOMAIN}/api/v2/users?apiKey=${BACKLOG_API_KEY}`
    const { data } = await axios.get(url)
    return data
  }

  /**
   * slack通知の本文作成
   */
  async generateSlackNotification(channel, mentions, backlog, description, titleSurfixString) {
    const { project, createdUser, content } = backlog
    const mention = mentions.join(' ')
    const projectCode = `${project.projectKey}-${content.key_id}`
    const title = `${createdUser.name} ${titleSurfixString}`
    const url = `https://${BACKLOG_DOMAIN}/view/${projectCode}`
    const issueTitle = content.summary
    const link = `<${url}|【${projectCode}】${issueTitle}>`
    await SlackService.postSlackMessage(channel, [mention, '\n', `*${title}*`, '\n', link, '\n\n', description].join(''))
  }
}

module.exports = new BacklogService()
