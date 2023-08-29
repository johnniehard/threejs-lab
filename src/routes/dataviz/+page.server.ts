import type { PageServerLoad } from './$types';

import csv from 'csvtojson'

type DataPoint = { name: string, population: number, year: number }
export const load: PageServerLoad = async ({ params }) => {
    const jsonArray = await csv().fromFile('./src/routes/dataviz/API_SP.POP.TOTL_DS2_en_csv_v2_5795797.csv');

    const tidy: DataPoint[] = []

    jsonArray.map(d => {
        for (let y = 1960; y <= 2022; y++) {
            if(+d[y] === 0) continue
            tidy.push({
                name: d["Country Name"],
                population: +d[y],
                year: y
            })
        }
    })

    const groupedByCountry = tidy.reduce((obj, curr) => {
        if(curr.name === "Not classified") return obj
        if (!obj[curr.name]) {
            obj[curr.name] = []
        }

        obj[curr.name].push(curr)

        return obj
    }, {} as Record<string, DataPoint[]>)

    return {
        data: {
            groupedByCountry,
            tidy
        }
    };
};