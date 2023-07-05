import { readFileSync } from "fs";
import path from "path";

import { Config } from "../../store";

const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;

export class Env {
    /**
     * Create a new ENV instance.
     * @example ```ts
     *  new Env();
     * ```
     */
    constructor(private filePath: string) {
        this.filePath = path.join(process.cwd(), filePath);
    }

    /**
     * Loads all keys from inside of the .env file from the projects root.
     * @example ```ts
     *  Env.load();
     * ```
     */
    load() {

        const src = readFileSync(this.filePath);
        const obj = {};

        let lines = src.toString();
        lines = lines.replace(/\r\n?/mg, "\n");

        let match: string[];
        while ((match = LINE.exec(lines) as string[]) != null) {
            const key = match[1];

            let value = (match[2] || "");
            value = value.trim();

            const maybeQuote = value[0];
            value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");

            if (maybeQuote === '"') {
                value = value.replace(/\\n/g, "\n");
                value = value.replace(/\\r/g, "\r");
            }

            process.env[key] = value;
            obj[key] = value;
        }

        return obj;

    }
}

new Env(Config.dev ? "./.env" : "./prod.env").load();