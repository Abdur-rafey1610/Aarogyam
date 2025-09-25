// Type definitions for Web NFC API
declare class NDEFReader {
  scan(): Promise<void>;
  onreading: ((event: NDEFReadingEvent) => void) | null;
  onreadingerror: ((error: Error) => void) | null;
  
  // Add the constructor signature
  constructor();
}

interface NDEFReadingEvent extends Event {
  message: {
    records: NDEFRecord[];
  };
}

interface NDEFRecord {
  recordType: string;
  data: BufferSource;
}

// Extend the global Window interface
declare global {
  interface Window {
    NDEFReader: typeof NDEFReader;
  }
}

export {};
