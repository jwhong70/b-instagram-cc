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

const PORT = process.env.PORT;
async function startServer() {
  const app = express();
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);
  const apollo = new ApolloServer({
    schema,
    context: async ({ req }) => {
      return { loggedInUser: await getUser(req.headers.token) };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault(),
    ],
  });
  await apollo.start();
  apollo.applyMiddleware({ app, path: "/" });
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
  );
}
startServer();
