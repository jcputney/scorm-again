import { Scorm12API } from "./Scorm12API";
import { CMI } from "./cmi/aicc/cmi";
import { BaseCMI } from "./cmi/common/base_cmi";
import { NAV } from "./cmi/scorm12/nav";
import { Settings } from "./types/api_types";
declare class AICCImpl extends Scorm12API {
    constructor(settings?: Settings);
    cmi: CMI;
    nav: NAV;
    getChildElement(CMIElement: string, value: any, foundFirstIndex: boolean): BaseCMI | null;
    replaceWithAnotherScormAPI(newAPI: AICCImpl): void;
}
export { AICCImpl as AICC };
