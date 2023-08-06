import path from "path";

import walkAllDirs from "../../module/walkAllDirs";
import { RouteRun } from "../../typings";

const run: RouteRun<string[]> = async (request, reply) => {

    const filePath = path.join(process.cwd());
    const files = (await walkAllDirs(process.cwd(), ".json")).filter((f) => f.match(/[a-z]{2}-[A-Z]{2}/));

    reply.header("Content-Type", "application/json");
    return files.map((file) => file.split(filePath)[1].replaceAll("\\", "/"));
};

export default { run };