import { buildListingsData } from "./engine.js";
import { renderListings } from "./ui.js";

export function runListings(){

    const data = buildListingsData();

    renderListings(data);
}