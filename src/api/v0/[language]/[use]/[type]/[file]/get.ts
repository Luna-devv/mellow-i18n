import { readFile } from "fs/promises";
import path from "path";

import { RouteRun } from "../../../../../../typings";

const run: RouteRun<string> = async (request, reply) => {
    const filePath = [(request.params as Record<string, string>).language, (request.params as Record<string, string>).use, (request.params as Record<string, string>).type, (request.params as Record<string, string>).file];

    if (!path.join(process.cwd(), "/static/", ...filePath).startsWith(path.join(`${process.cwd()}`, "/static/"))) return reply.status(404).send();

    const file = await readFile(path.join(process.cwd(), "/static/", ...filePath)).catch(() => null);
    if (!file) return reply.status(404).send();

    reply.header("Content-Type", "application/json");
    return JSON.parse(file.toString());
};

export default { run };