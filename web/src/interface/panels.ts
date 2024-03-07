
import mitt from 'mitt'

type PanelEvents = {
    open: string
    id: string
    downloading: boolean
    collect: string
};

export const panelEvents = mitt<PanelEvents>()
