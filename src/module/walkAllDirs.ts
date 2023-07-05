import { readdir, stat } from "fs/promises";
import path from "path";

export default async function walkAllDirs(dir: string): Promise<string[]> {
    const results: string[] = [];
    for await (const dirItem of await readdir(dir)) {
        const fstat = await stat(path.join(dir, dirItem));
        if (fstat.isFile() && dirItem.endsWith(".js")) results.push(path.join(dir, dirItem));
        if (fstat.isDirectory()) (await walkAllDirs(path.join(dir, dirItem))).forEach((walkItem) => results.push(walkItem));
    }
    return results;
}