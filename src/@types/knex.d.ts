import { RandomUUIDOptions } from "crypto";
import { Knex } from "knex";

type knexConfig = Knex.Config;
type IRandomUUID = MaybeRawColumn<RandomUUIDOptions> | undefined;

declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: IRandomUUID;
      title: string;
      amount: number;
      session_id?: string;
      created_at: string;
    };
  }
}
