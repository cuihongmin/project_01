import {
    validatenull
} from '@/utils/validate';

import website from '@/config/website'

const keyName = website.key + '-';

/**
 * 存储localStorage
 */
 export const setStore = (params = {}) => {
    let {
        name,
        content,
        type,
    } = params;
    name = keyName + name
    let obj = {
        dataType: typeof (content),
        content: content,
        type: type,
        datetime: new Date().getTime()
    }
    if (type) window.sessionStorage.setItem(name, JSON.stringify(obj));
    else window.localStorage.setItem(name, JSON.stringify(obj));
}

/**
 * 获取localStorage
 */

 export const getStore = (params = {}) => {
    let {
        name,
        debug
    } = params;
    name = keyName + name
    let obj = {},
        content;
    obj = window.sessionStorage.getItem(name);
    if (validatenull(obj)) obj = window.localStorage.getItem(name);
    if (validatenull(obj)) return;
    try {
        obj = JSON.parse(obj);
    } catch{
        return obj;
    }
    if (debug) {
        return obj;
    }
    if (obj.dataType == 'string') {
        content = obj.content;
    } else if (obj.dataType == 'number') {
        content = Number(obj.content);
    } else if (obj.dataType == 'boolean') {
        content = eval(obj.content);
    } else if (obj.dataType == 'object') {
        content = obj.content;
    }
    return content;
}