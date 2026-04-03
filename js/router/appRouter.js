export async function loadModule(name) {
    const module = await import(`../modules/${name}/binder.js`);
    module.run();
}