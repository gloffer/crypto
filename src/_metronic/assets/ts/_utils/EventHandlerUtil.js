import { DataUtil } from './_DataUtil';
import { getUniqueIdWithPrefix } from './_TypesHelpers';
export class EventHandlerUtil {
    static setEventMetasByName(name, metas) {
        EventHandlerUtil.store.set(name, metas);
    }
    static getEventMetasByName(name) {
        return EventHandlerUtil.store.get(name);
    }
    static setEventMetaByNameAndHandlerId(name, handlerId, meta) {
        let metas = EventHandlerUtil.getEventMetasByName(name);
        if (!metas) {
            metas = new Map();
        }
        metas.set(handlerId, meta);
        EventHandlerUtil.setEventMetasByName(name, metas);
    }
    static getEventsMetaByHandlerId(name, handlerId) {
        const metas = EventHandlerUtil.store.get(name);
        if (!metas) {
            return;
        }
        return metas.get(handlerId);
    }
    static setFiredByNameAndHandlerId(name, handerId, fired) {
        const meta = EventHandlerUtil.getEventsMetaByHandlerId(name, handerId);
        if (!meta) {
            return;
        }
        meta.fired = fired;
        EventHandlerUtil.setEventMetaByNameAndHandlerId(name, handerId, meta);
    }
    static addEvent(element, name, callback, one = false) {
        const handlerId = getUniqueIdWithPrefix('event');
        DataUtil.set(element, name, handlerId);
        const meta = {
            name: name,
            callback: callback,
            one: one,
            fired: false,
        };
        EventHandlerUtil.setEventMetaByNameAndHandlerId(name, handlerId, meta);
    }
    static removeEvent(element, name) {
        const handlerId = DataUtil.get(element, name);
        if (!handlerId) {
            return;
        }
        const metas = EventHandlerUtil.getEventMetasByName(name);
        if (!metas) {
            return;
        }
        metas.delete(handlerId);
        EventHandlerUtil.setEventMetasByName(name, metas);
    }
    static trigger(element, name, e) {
        if (DataUtil.has(element, name)) {
            const handlerId = DataUtil.get(element, name);
            if (!handlerId) {
                return undefined;
            }
            const handler = EventHandlerUtil.getEventsMetaByHandlerId(name, handlerId);
            if (handler) {
                if (handler.name === name) {
                    if (handler.one === true) {
                        if (handler.fired === false) {
                            EventHandlerUtil.setFiredByNameAndHandlerId(name, handlerId, true);
                            return handler.callback.call(this, e);
                        }
                    }
                    else {
                        return handler.callback.call(this, e);
                    }
                }
            }
        }
        return null;
    }
    static one(element, name, callBack) {
        EventHandlerUtil.addEvent(element, name, callBack, true);
    }
    static off(element, name) {
        EventHandlerUtil.removeEvent(element, name);
    }
}
EventHandlerUtil.store = new Map();
EventHandlerUtil.on = function (element, name, callBack) {
    EventHandlerUtil.addEvent(element, name, callBack, false);
};
