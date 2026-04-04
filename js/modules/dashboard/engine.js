export function buildDashboard(data) {

    return {
        kpi: {
            gmv: 0,
            units: 0,
            asp: 0,
            spend: 0,
            revenue: 0,
            ctr: 0,
            roi: 0
        },
        charts: {
            sales: {},
            ads: {}
        },
        brandMap: {}
    };
}