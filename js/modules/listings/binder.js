import { buildListings } from "./engine.js";
import { renderListings } from "./ui.js";

export function run() {
    const data = buildListings();
    renderListings(data);
}