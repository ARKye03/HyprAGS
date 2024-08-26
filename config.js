const entry = App.configDir + "/main.ts";
const outdir = "/tmp/ags/js";

try {
	await Utils.execAsync([
		"/home/archkye/.bun/bin/bun",
		"build",
		entry,
		"--outdir",
		outdir,
		"--external",
		"resource://*",
		"--external",
		"gi://*",
	]);
	await import(`file://${outdir}/main.js`);
} catch (error) {
	console.error(error);
}

export {};
