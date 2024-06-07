const express = require('express')
const router = express.Router()
const BacklogService = require('../../service/backlog.service')
require('dotenv').config()

// Slackのステータスを更新するエンドポイント
router.post('/webhook/:channel', async (req, res) => {
  try {
    const channel = req.params.channel
    console.log({ channel })
    const backlogRequestBody = req.body
    console.log(JSON.stringify(backlogRequestBody, null, 2))
    const { type, content, notifications } = backlogRequestBody
    // backlogのユーザ取得
    const backlogUsers = await BacklogService.getBacklogMembers(notifications)
    // お知らせ対象者
    const notificationMailAddresses = backlogUsers
      .filter((backlogUser) => notifications.some((notification) => notification.user.id === backlogUser.id))
      .map((user) => user.mailAddress)

    // backlogの課題をメンション付きで送信する
    const sendSlackMessage = async (backlogContent, titleSurfixString) => {
      const mailAddresses = BacklogService.pickMentionUserMailAddresses(backlogContent, backlogUsers)
      const slackMentions = await BacklogService.setSlackMentions(Array.from(new Set([...mailAddresses, ...notificationMailAddresses])))
      await BacklogService.generateSlackNotification(channel, slackMentions, backlogRequestBody, backlogContent, titleSurfixString)
    }

    if (type === 1) {
      await sendSlackMessage(content.description, 'さんが課題を作成しました。')
    } else if (type === 2 && content.comment.content) {
      await sendSlackMessage(content.comment.content, 'さんが課題にコメントしました。')
    } else if (type === 3) {
      await sendSlackMessage(content.comment.content, 'さんが課題にコメントしました。')
    }
    return res.status(200).json({ message: 'Backlog to Slack successfully.' })
  } catch (err) {
    console.trace(err)
    return res.status(500).json({ error: 'Error Backlog to Slack' })
  }
})

module.exports = router
