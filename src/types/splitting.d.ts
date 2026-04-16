declare module 'splitting' {
  interface SplittingResult {
    el: HTMLElement;
    chars?: HTMLElement[];
    words?: HTMLElement[];
    lines?: HTMLElement[][];
    [key: string]: unknown;
  }

  interface SplittingOptions {
    target?: string | HTMLElement | HTMLElement[] | NodeList;
    by?: string;
    key?: string | null;
    matching?: string;
    whitespace?: boolean;
    columns?: number;
    rows?: number;
    image?: boolean;
  }

  function Splitting(options?: SplittingOptions): SplittingResult[];
  export = Splitting;
}

declare module 'splitting/dist/splitting.css' {
  const content: string;
  export default content;
}
