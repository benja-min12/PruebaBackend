/* eslint-disable prettier/prettier */
export class CreatedNewsDto {
  readonly _id?: number;
  readonly title: string;
  readonly url: string;
  readonly author: string;
  readonly created_at: Date;
  readonly _tags: string[];
  readonly activo?: boolean;
}
