interface graphInfo {
    data: any;
    explanation: any;
    layout: any;
  }

export interface InsightListInfo{
    setGraphInfo: React.Dispatch<React.SetStateAction<graphInfo[] | undefined>>;
    setSelectedInsightIndex: React.Dispatch<React.SetStateAction<number>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CompanyInfo {
  constructionCompany: string;
  id: number;
  checked: boolean;
}