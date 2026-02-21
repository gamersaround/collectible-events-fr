import { eventSchema } from "./event";
import { submissionSchema } from "./submission";
import { sourceSchema } from "./source";
import { crawlRunSchema } from "./crawlRun";
import { departmentSchema } from "./department";

export const schemaTypes = [
  eventSchema,
  submissionSchema,
  sourceSchema,
  crawlRunSchema,
  departmentSchema,
];
