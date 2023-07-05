import path from "path";

import walkAllDirs from "../../module/walkAllDirs";
import { RouteRun } from "../../typings";

const run: RouteRun<string[]> = async (request, reply) => {

    const filePath = path.join(process.cwd(), "static");
    const files = await walkAllDirs(filePath, ".json");

    reply.header("Content-Type", "application/json");
    return files.map((file) => file.split(filePath)[1]);
};

export default { run };