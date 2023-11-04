import { colorPickerPalette } from '@/data/colors';
import fillColorOnClick from '@/lib/fillColorOnClick';
import reOrderArrayElements from '@/lib/reOrderArrElements';
import resetFullMap from '@/lib/resetFullMap';
import resetMap from '@/lib/resetMap';
import resolveLegendData from '@/lib/resolveLegendData';
import { LegendData, MapData, MapStoreType } from '@/typings/map.store';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import { baseBooleanAdapter, baseStringAdapter, booleanAdapter } from '@state-adapt/core/adapters';
import { toSource } from '@state-adapt/rxjs';
import { Subject, map as _map, tap } from 'rxjs';
import { adapt } from 'stateadapt';

const mapAdapter = joinAdapters<MapStoreType>()({
    defaultFillColor: baseStringAdapter,
    mapStrokeColor: baseStringAdapter,
    mapBackgroundColor: baseStringAdapter,
    mapStrokeWidth: baseStringAdapter,
    mapFillColor: baseStringAdapter,
    mapData: createAdapter<MapData[]>()({}),
    legendData: createAdapter<LegendData[]>()({}),
    legendTextColor: baseStringAdapter,
    hideStates: createAdapter<string[]>()({}),
    hideLegend: baseBooleanAdapter,
    legendSmoothGradient: booleanAdapter,
    hideSource: booleanAdapter,
    sourceText: baseStringAdapter
})({
    changeLegendAndMapData: {
        mapData: (s, payload: { mapData: MapData[] }) => payload.mapData.slice(),
        legendData: (s, payload: { legendData: LegendData[] }) => payload.legendData.slice()
    }
})(([, reactions]) => ({
    fillColor: (map, target: Element) => {
        if (target.id) {
            const mapData = fillColorOnClick(
                map.mapData,
                {
                    code: target.id,
                    fill: map.mapFillColor,
                    hide: false
                },
                map.defaultFillColor
            );
            const legendData = resolveLegendData(map.legendData, mapData);

            const payload = { mapData, legendData };
            return reactions.changeLegendAndMapData(map, payload, initialState);
        }
        return map;
    },
    toggleHideLegend: (map, { i, f }: { i: number; f: string }) => {
        const legendData = map.legendData;
        legendData[i].hide = !legendData[i].hide;
        const mapData = map.mapData;
        mapData.forEach((mp) => {
            if (mp.fill === f) {
                mp.hide = !mp.hide;
            }
        });

        const payload = { mapData, legendData };
        return reactions.changeLegendAndMapData(map, payload, initialState);
    },
    changeLegendText: (map, { i, t }: { i: number; t: string }) => {
        const legendData = map.legendData;
        legendData[i].text = t;

        return reactions.setLegendData(map, legendData, initialState);
    },
    changeColor: (map, { index, bgColor, v }: { v: string; bgColor: string; index: number }) => {
        const mapData = map.mapData;
        mapData.forEach((el) => {
            if (el.fill === bgColor) {
                el.fill = v;
            }
        });
        const legendData = map.legendData;
        legendData[index].fill = v;

        return reactions.changeLegendAndMapData(map, { legendData, mapData }, initialState);
    },
    changeLegendPos: (map, { idx, up }: { idx: number; up: boolean }) => {
        const len = map.legendData.length;
        const copy = map.legendData;
        if (up) {
            if (idx === 0) {
                reOrderArrayElements(copy, copy[idx], idx, len - 1);
            } else {
                reOrderArrayElements(copy, copy[idx], idx, idx - 1);
            }
        } else if (!up) {
            if (idx === len - 1) {
                reOrderArrayElements(copy, copy[idx], idx, 0);
            } else {
                reOrderArrayElements(copy, copy[idx], idx, idx + 1);
            }
        }

        return reactions.setLegendData(map, copy, initialState);
    },
    setAttr: (map, { attr, v }: { attr: string; v: string }) => ({
        ...map,
        [attr]: v
    }),
    refresh: (map) => ({
        ...map,
        mapStrokeWidth: '1',
        mapStrokeColor: 'white',
        defaultFillColor: 'black',
        legendData: [],
        mapData: [],
        legendTextColor: 'white',
        hideLegend: false,
        legendSmoothGradient: false
    })
}))();

export const removeLegend$ = new Subject<{ i: number; fill: string; map: MapStoreType }>();
const legendRemoved$ = removeLegend$.pipe(
    _map(({ map, i, fill }) => {
        const mapData = map.mapData.filter((el) => el.fill !== fill);
        const removeCodes = map.mapData.filter((el) => el.fill === fill);
        const legendData = map.legendData;
        resetMap(removeCodes, 'none'); // Side-effect
        legendData.splice(i, 1);

        return { mapData, legendData };
    }),
    toSource('removeLegend$')
);

export const randomizeData$ = new Subject<Record<string, string>>();
const dataRandomized$ = randomizeData$.pipe(
    _map((codes) => {
        const colorIdx = Math.floor(Math.random() * colorPickerPalette.length); // Side-effect
        const grad = document.getElementById('grad-text');
        if (grad) {
            grad.style.color = colorPickerPalette[colorIdx][5];
        }
        const legendData: LegendData[] = [];
        colorPickerPalette[colorIdx].forEach((t, i) =>
            legendData.push({ fill: t, text: `${i * 10}`, hide: false })
        );
        const mapData: MapData[] = [];
        Object.keys(codes).forEach((m) => {
            const rand = Math.floor(Math.random() * 10); // Side-effect
            mapData.push({
                fill: colorPickerPalette[colorIdx][rand],
                code: m,
                hide: false
            });
        });
        return { mapData, legendData };
    }),
    toSource('randomizeData$')
);

export const refreshMap$ = new Subject<Record<string, string>>();
export const mapRefresh$ = refreshMap$.pipe(
    tap((codes) => {
        const el = document.getElementById('labels-container');
        if (el) {
            el.innerHTML = '';
        }
        resetFullMap(codes); // Side-effect
    }),
    toSource('refreshMap$')
);

const initialState: MapStoreType = {
    defaultFillColor: 'black',
    mapStrokeColor: 'white',
    mapBackgroundColor: 'black',
    mapStrokeWidth: '1',
    mapFillColor: '#ff677d',
    mapData: [],
    legendData: [],
    legendTextColor: 'white',
    hideStates: [],
    hideLegend: false,
    legendSmoothGradient: false,
    hideSource: false,
    sourceText: ''
};

export const mapStore = adapt(initialState, {
    adapter: mapAdapter,
    sources: {
        changeLegendAndMapData: [legendRemoved$, dataRandomized$],
        refresh: mapRefresh$
    },
    path: 'map'
});
mapStore.state$.subscribe();

export const disableTooltipStore = adapt(false);

// export const fillAtom = atom<String>('');
