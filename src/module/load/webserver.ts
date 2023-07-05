import fastify, { FastifyReply, FastifyRequest } from "fastify";
import path from "path";

import { WebserverEnum } from "../../enum/webserver";
import { Config } from "../../store";
import { Route } from "../../typings";
import walkAllDirs from "../walkAllDirs";

const app = fastify({
    logger: false
});

app.addHook("preHandler", (request, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    reply.header("Content-Type", "application/json");

    if (request.headers["content-type"] !== "application/json" && request.method !== "GET" && request.method !== "OPTIONS" && request.body) {
        reply.status(400).send({
            status: 400,
            message: `Invalid 'content-type' headers, got "${request.headers["content-type"]}" but expected"application/json"`
        });
        return;
    }

    if (request.url.split("/")[1].startsWith("v") && !isNaN(Number(request.url.split("/")[1].slice(1)))) {

        if (Config.api.versions.deprecated.includes(parseInt(request.url.split("/")[1].slice(1)))) {
            reply.status(400).send({
                status: 400,
                message: WebserverEnum.VERSION_DEPRECATED
            });
            return;
        }

        if (!Config.api.versions.allowed.includes(parseInt(request.url.split("/")[1].slice(1)))) {
            reply.status(400).send({
                status: 400,
                message: WebserverEnum.VERSION_INVALID
            });
            return;
        }

    }

    done();
});

app.options("*", (request, reply) => reply.status(204).send());

async function load() {

    const dirPath = path.join(process.cwd(), "dist", "api");

    for await (const file of await walkAllDirs(dirPath)) {

        const route: Route = (await import(file))?.default;
        if (!route?.run) return;
        let routePath = "";

        for await (const param of file.split("api")[1].slice(1).replace(/(\\|\/\/)/g, "/").split("/")) {
            if (param.match(/\[.{0,}\]/)) routePath += "/:" + param.split("[")[1].split("]")[0];
            else routePath += "/" + param;
        }

        routePath = routePath
            .replace(/(get|post|put|delete)\.js/, "")
            .slice(0, -1);

        const method = file.match(/(get|post|put|delete)\.js/)?.[0].split(".")[0] || "get";
        app[method](routePath, (request: FastifyRequest, reply: FastifyReply) => route.run(request, reply));

    }

}

async function start(port: number) {
    app.listen({ host: await Config.api.url, port }, (err, address) => {
        console.log(`Listening to ${address}`);
    });
}

export default { load, start };