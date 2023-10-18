export interface ServiceOptions {
    page?: number;
    populate?: string;
    select?: string;
    sort?: any;
    skip?: number;
    limit?: number;
    addFields?: object;
    lookup?: object;
    match?: object;
    project?: object;
    count?: number;
    new?: boolean;
  }