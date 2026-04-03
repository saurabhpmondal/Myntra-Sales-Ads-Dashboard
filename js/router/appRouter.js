export async function loadModule(name) {

    try {
        const module = await import(`../modules/${name}/binder.js`);

        if (module.run) {
            module.run();
        } else {
            console.error("run() not found in module:", name);
        }

    } catch (e) {
        console.error("Module load error:", name, e);
    }
}