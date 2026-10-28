import http from 'node:http';

export class Server {
  constructor({ app, databaseConnection, port }) {
    this.app = app;
    this.databaseConnection = databaseConnection;
    this.port = port;
    this.httpServer = null;
  }

  async start() {
    await this.databaseConnection.connect();

    this.httpServer = http.createServer(
      this.app.getInstance()
    );

    await new Promise((resolve, reject) => {
      this.httpServer.once('error', reject);

      this.httpServer.listen(this.port, '0.0.0.0', () => {
        console.log(`Strada API running on port ${this.port}`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.httpServer?.listening) {
      await new Promise((resolve, reject) => {
        this.httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await this.databaseConnection.disconnect();
  }
}
