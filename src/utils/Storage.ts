import localforage from "localforage"

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'app',
    version: 1.0,
    storeName: 'local_base'
})
export default localforage;
/* export default class Storage {
    static store = localforage
    static async set(key: string, data: any) {
        return this.store.setItem(key, JSON.stringify(data))
    }
    static async get(key: string) {
        let data = await this.store.getItem(key)
        try {
            data = JSON.parse(data as string);
        } catch (e) { }
        return data;
    }
    static async remove(key: string) {
        return await this.store.removeItem(key);
    }
    static setItem=this.set
    static getItem=this.set
    static removeItem=this.remove
} */