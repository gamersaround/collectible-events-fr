import { eventSchema } from "./event";
import { submissionSchema } from "./submission";
import { sourceSchema } from "./source";
import { crawlRunSchema } from "./crawlRun";
import { departmentSchema } from "./department";
import { articleSchema } from "./article";

export const schemaTypes = [
  eventSchema,
  articleSchema,
  submissionSchema,
  sourceSchema,
  crawlRunSchema,
  departmentSchema,
];
