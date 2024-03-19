import "dotenv/config";
import Fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";

import { shortenedUrls } from "./schema.js";
import { generateBase62Id } from "./utils.js";

type URLShortenerGETParams = {
  id: string | undefined;
};
type URLShortenerPOSTBody = {
  target: string | undefined;
};

const fastify = Fastify({
  logger: true,
});
await fastify.register(cors, {
  origin: "*",
});

const main = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT,
  });

  const db = drizzle(connection);

  fastify.get("/", async (req, res) => {
    return res.status(200).send({
      message: "Hello World!",
    });
  });

  fastify.get(
    "/u/:id",
    async (req: FastifyRequest<{ Params: URLShortenerGETParams }>, res) => {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({
          message: "bad-request",
        });
      }

      const storedUrl = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.id, id));

      if (storedUrl.length === 0) {
        return res.status(404).send({
          message: "not-found",
        });
      }

      return res.redirect(301, storedUrl[0].target);
    }
  );

  fastify.post(
    "/u",
    async (
      req: FastifyRequest<{
        Body: URLShortenerPOSTBody;
      }>,
      res
    ) => {
      const { target } = req.body;

      if (!target) {
        return res.status(400).send({
          message: "bad-request",
        });
      }

      // if target exists, return stored URL for target.
      const storedUrl = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.target, target));

      if (storedUrl.length > 0) {
        return res.send({
          id: storedUrl[0].id,
        });
      }

      // create new URL
      let id = generateBase62Id(6);
      let idExists = await db
        .select()
        .from(shortenedUrls)
        .where(eq(shortenedUrls.target, target));

      while (idExists.length > 0) {
        id = generateBase62Id(6);
        idExists = await db
          .select()
          .from(shortenedUrls)
          .where(eq(shortenedUrls.id, id));
      }

      await db.insert(shortenedUrls).values({
        id,
        target,
      });

      return res.send({
        id,
      });
    }
  );

  try {
    fastify.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

main();
