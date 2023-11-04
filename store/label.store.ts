import { LabelStoreType, LabelType } from '@/typings/label.store';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import { adapt } from 'stateadapt';
import { mapRefresh$ } from './map.store';

const labelAdapter = joinAdapters<LabelStoreType>()({
    data: createAdapter<LabelType[]>()({}),
    scalingFactor: createAdapter<number>()({})
})();

const initialState: LabelStoreType = {
    data: [],
    scalingFactor: 1
};

export const labelStore = adapt(initialState, {
    adapter: labelAdapter,
    sources: {
        reset: mapRefresh$
    },
    path: 'label'
});
labelStore.state$.subscribe();
