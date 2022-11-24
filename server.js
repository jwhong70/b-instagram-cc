require("dotenv").config();
import express from "express";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import schema from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const PORT = process.env.PORT;
async function startServer() {
  const app = express();
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const apollo = new ApolloServer({
    schema,
    context: async ({ req }) => {
      if (req) {
        return { loggedInUser: await getUser(req.headers.token) };
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault(),
    ],
  });
  await apollo.start();
  apollo.applyMiddleware({ app, path: "/" });
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
}
startServer();
