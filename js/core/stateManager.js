const state = {
    data: {}
};

export function setData(name, data) {
    state.data[name] = data;
}

export function getData(name) {
    return state.data[name] || [];
}