export interface CollectData {
    id: string,
    time: number,
    sex: string,
    style: string,
    name: string,
}

import mitt from 'mitt'

type CollectEvents = {
    remove: string
    id: string
};

export const collectEvents = mitt<CollectEvents>()