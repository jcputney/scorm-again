declare module "extract-zip" {
  interface ExtractOptions {
    dir: string;
    defaultDirMode?: number;
    defaultFileMode?: number;
    onEntry?: (entry: any, zipfile: any) => void;
  }

  function extract(zipPath: string, options: ExtractOptions): Promise<void>;

  export default extract;
}
