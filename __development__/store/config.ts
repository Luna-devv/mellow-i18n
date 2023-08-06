import os from "node:os";
const dev = process.platform === "win32";

export default {
    dev,
    api: {
        versions: {
            deprecated: [] as number[],
            allowed: [0]
        },
        url: getCurrentLocalIp(),
        port: 7002
    }
};

function getCurrentLocalIp(): string {
    const ips: string[] = [];

    for (const key of Object.keys(os.networkInterfaces())) {
        const ip = os.networkInterfaces()[key]?.find((entry) => entry.address.startsWith("10."));
        if (ip?.address) ips.push(ip.address);
    }

    return ips[0] || "localhost";
}