import express, { Express } from "express";
import * as dotenv from "dotenv";
import * as database from "./config/database";
import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./typeDefs/index.typeDefs";
import { resolvers } from "./resolvers/index.resolver";
import { requireAuth } from "./middlewares/auth.middleware";

const startServer = async () => {
    dotenv.config();

    database.connect();

    const app: Express = express();
    const port: number | string = process.env.PORT || 3000;

    //@ GraphQL
    app.use("/graphql", requireAuth);

    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers, //! ở trong js thì miễn sao 2 cái này trùng tên nhau thì cs thể viết gọn thành 1 cái thôi, nhưng ở đây cứ viết rõ ra cho dễ hiểu, sau rồi rút gọn cx đc
        introspection: true,
        context: ({ req }) => {
            return { ...req };
        },
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app: app,
        path: "/graphql", //! Tạo API api này thích đặt j cx đc
    });

    app.listen(port, () => {
        console.log(`PORT ${port} Running OK`);
    });
};

startServer();
