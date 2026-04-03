const state = {
    data: {},
    filter: null
};

export function setData(name, data) {
    state.data[name] = data;
}

export function getData(name) {
    return state.data[name] || [];
}

export function setFilter(filter) {
    state.filter = filter;
}

export function getFilter() {
    return state.filter;
}