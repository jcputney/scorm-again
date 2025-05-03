import { IBaseAPI } from "./interfaces/IBaseAPI";
export default class CrossFrameLMS {
    private readonly _api;
    private readonly _origin;
    constructor(api: IBaseAPI, targetOrigin?: string);
    private _onMessage;
    private _process;
}
