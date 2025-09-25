/// <reference types="vite/client" />

interface Window {
  NDEFReader: new () => NDEFReader;
}

interface NDEFReader {
  scan: () => Promise<void>;
  onreading: (event: any) => void;
  onreadingerror: (event: any) => void;
}

