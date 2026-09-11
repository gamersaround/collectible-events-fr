import { eventSchema } from "./event";
import { submissionSchema } from "./submission";
import { sponsorInquirySchema } from "./sponsorInquiry";
import { sourceSchema } from "./source";
import { crawlRunSchema } from "./crawlRun";
import { departmentSchema } from "./department";
import { articleSchema } from "./article";

export const schemaTypes = [
  eventSchema,
  articleSchema,
  submissionSchema,
  sponsorInquirySchema,
  sourceSchema,
  crawlRunSchema,
  departmentSchema,
];
