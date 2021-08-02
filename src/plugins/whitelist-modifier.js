const filter = (value) => !!value || !value.toString().startsWith("-");

export default (Plugin) =>
  new Plugin({
    async discord({ message, sendToMinecraft, sendToDiscord }) {
      if (!message.cleanContent.startsWith("whitelist")) return;

      const splited = message.cleanContent.split(" ").filter(filter);

      const command = splited[1];
      let id = null;

      switch (command) {
        case "add":
          id = splited[2];
          await sendToMinecraft(`whitelist add ${id}`);
          break;

        case "remove":
          id = splited[2];
          await sendToMinecraft(`whitelist remove ${id}`);
          break;

        case "list":
          const ls = await sendToMinecraft(`whitelist list`);
          await sendToDiscord(ls);
          break;
      }
    },
  });
