export interface ExternalSearchService {
  open(url: string): Promise<void>;
}
