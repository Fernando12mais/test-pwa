export type SearchPropertiesResponse = {
  lado: {
    lE: string;
    lD: string;
    lA: string;
  };
  posicao: {
    pD: string;
    pT: string;
    pA: string;
  };
  extremidade: {
    sUP: string;
    iNF: string;
    cE: string;
    eA: string;
  };
};

export type ProcessedSearchPropertiesResponse = {
  side: string[];
  position: string[];
  extremity: string[];
};
