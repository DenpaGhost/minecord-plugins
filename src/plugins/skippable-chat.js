import Replacers from "minecord/lib/Replacers";

const replacers = new Replacers()
  .add(/^<(.*?)>\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)
  .add(/^\[(.*?)]\s(.*)$/, (message, player, text) => `**${player}**: ${text}`);

export default (Plugin) =>
  new Plugin({
    async discord({ message, sendToMinecraft }) {
      await sendToMinecraft(
        `tellraw @a ${JSON.stringify({
          text: `<${
            (message.member && message.member.nickname) ||
            message.author.username
          }> ${message.cleanContent}`,
        })}`
      );
    },
    async minecraft({ causedAt, level, message, sendToDiscord }) {
      if (
        causedAt !== "Server thread" ||
        level !== "INFO" ||
        message.includes("[unsend-discord]")
      )
        return;

      const newMessage = replacers.replace(message);
      if (newMessage !== false) await sendToDiscord(newMessage);
    },
  });
