import { readdir, stat } from "fs/promises";
import path from "path";

import { Config } from "../store";

export default async function walkAllDirs(dir: string, fileType?: `.${string}` | undefined): Promise<string[]> {
    const results: string[] = [];
    for await (const dirItem of await readdir(dir)) {
        const fileName = path.join(dir, dirItem);
        const fstat = await stat(fileName);

        if (fstat.isFile()) {
            if (Config.dev) delete require.cache[require.resolve(fileName)];
            if (dirItem.endsWith(fileType || ".js")) results.push(fileName);
        }

        if (fstat.isDirectory()) await (await walkAllDirs(fileName, fileType)).forEach((walkItem) => results.push(walkItem));
    }
    return results;
}