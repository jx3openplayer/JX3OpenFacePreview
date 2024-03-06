
import mitt from 'mitt'

type PanelEvents = {
    open: string
    id: string
    downloading: boolean
};

export const panelEvents = mitt<PanelEvents>()
