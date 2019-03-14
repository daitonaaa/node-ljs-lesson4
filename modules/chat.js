const moduleChat = {
  clients: [],

  publish(ctx) {
    let {clients} = this;

    return new Promise((resolve, reject) => {
      let body = '';

      ctx.req
        .on('readable', function () {
          let chunk = this.read();

          // Почему тут в последнем чанке всегда прилетает null ?
          if (chunk) body += chunk;
          if (body.length > 1e2) resolve({status: 413, body: `Too large`});
        })
        .on('end', () => {
          try {
            if (body.length > 1e2) return;

            body = JSON.parse(body);
          } catch {
            resolve({status: 400, body: `Bad request ${body}`});
          }

          if (Array.isArray(clients) && clients.length > 0) {
            clients.forEach((client) => {
              client.resolve(body.message);
            });

            clients = [];
          }

          resolve({status: 200, body: 'OK'});
        });
    });
  },

  subscribe(ctx) {
    let {clients} = this;

    return new Promise((resolve) => {
      const client = {
        resolve, context: ctx,
      };

      ctx.res.on('close', () => {
        const clientIndex = clients.indexOf(client);

        if (clientIndex + 1) clients.splice(clientIndex, 1);
      });

      clients.push(client);
    });
  },
};

module.exports = moduleChat;
