/**
 * Types for ROR API V2 responses and entities
 */
export interface RORV2Organization {
  id: string;
  names: Name[];
  status: "active" | "withdrawn" | "deprecated";
  established: number;
  locations: Location[];
  types: string[];
  email_address: string | null;
  ip_addresses: string[];
  aliases: string[];
  acronyms: string[];
  links: Link[];
  matches: string[] | null;
  labels: Label[];
  relationships: Relationship[];
  references: Reference[];
  external_ids: ExternalId[];
}

interface Link {
  type: string;
  value: string;
}

interface ExternalId {
  type: string;
  all: string[];
}

interface Name {
  lang: string;
  types: string[];
  value: string;
}

interface Location {
  geonames_details: {
    country_code: string;
    country_name: string;
    // continent_code: string;
    // continent_name: string;
    // country_subdivision_code: string;
    // country_subdivision_name: string;
  };
  geonames_id: string;
}


interface Label {
  label: string;
  iso639: string;
}

interface Relationship {
  type: string;
  id: string;
  label: string;
}


interface Reference {
  id: string | null;
  agency: string;
  source: string | null;
}

export interface RORV2SearchResponse {
  items: RORV2Organization[];
  number_of_results: number;
  meta: {
    types: RORFacet[];
    countries: RORFacet[];
  };
}

export interface RORFacet {
  id: string;
  title: string;
  count: number;
}


export interface RORV2Error extends Error {
  status?: number;
  statusText?: string;
}

/**
 * Configuration options for the ROR API client
 */
export interface RORV2ClientConfig {
  baseUrl?: string;
  timeout?: number;
}

/**
 * Search parameters for querying organizations
 */
export interface RORV2SearchParams {
  query?: string;
  page?: number;
  types?: string | string[];
  countries?: string | string[];
}

/**
 * ROR API V2 Client class
 */
export class RORV2Client {
  private baseUrl: string;
  private timeout: number;

  constructor(config: RORV2ClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://api.ror.org/v2';
    this.timeout = config.timeout || 10000;
  }

  /**
   * Helper method to handle API requests
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error() as RORV2Error;
        error.status = response.status;
        error.statusText = response.statusText;
        error.message = `API request failed: ${response.status} ${response.statusText}`;
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error() as RORV2Error;
          timeoutError.message = `Request timeout after ${this.timeout}ms`;
          throw timeoutError;
        }
        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Get an organization by its ROR ID
   */
  public async getOrganization(rorId: string): Promise<RORV2Organization> {
    if (!rorId) {
      throw new Error('ROR ID is required');
    }

    // Remove the full URL if provided, we just need the ID
    const id = rorId.replace('https://ror.org/', '');

    try {
      return await this.makeRequest<RORV2Organization>(`/organizations/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Error fetching organization');
    }
  }

  /**
   * Search for organizations
   */
  public async searchOrganizations(params: RORV2SearchParams = {}): Promise<RORV2SearchResponse> {
    const searchParams = new URLSearchParams();

    if (params.query) {
      searchParams.append('query', params.query);
    }

    if (params.page && params.page > 0) {
      searchParams.append('page', params.page.toString());
    }

    // Handle types filter
    if (params.types) {
      const types = Array.isArray(params.types) ? params.types : [params.types];
      const typeFilters = types.map(type => `types:${type}`).join(',');
      if (typeFilters) {
        searchParams.append('filter', typeFilters);
      }
    }

    // Handle countries filter
    if (params.countries) {
      const countries = Array.isArray(params.countries) ? params.countries : [params.countries];
      const countryFilters = countries.map(country => `country.country_code:${country}`).join(',');
      if (countryFilters) {
        const existingFilter = searchParams.get('filter');
        const newFilter = existingFilter ? `${existingFilter},${countryFilters}` : countryFilters;
        searchParams.set('filter', newFilter);
      }
    }

    try {
      return await this.makeRequest<RORV2SearchResponse>(
        `/organizations${searchParams.toString() ? '?' + searchParams.toString() : ''}`
      );
    } catch (error) {
      throw this.handleError(error, 'Error searching organizations');
    }
  }

  /**
   * Helper method to handle errors
   */
  private handleError(error: unknown, context: string): Error {
    if (error instanceof Error) {
      const rorError = error as RORV2Error;
      rorError.message = `${context}: ${rorError.message}`;
      return rorError;
    }
    return new Error(`${context}: Unknown error occurred`);
  }
}
