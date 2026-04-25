import { cookies } from "next/headers";

const COOKIE_NAME = "ilab_access";

export type ViewerScope =
  | { kind: "internal" }
  | { kind: "customer"; allowedReportIds: string[] }
  | { kind: "anonymous" };

function parseReportIds(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getViewerScope(): Promise<ViewerScope> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (cookie === "internal") return { kind: "internal" };
  if (cookie === "customer") {
    return {
      kind: "customer",
      allowedReportIds: parseReportIds(process.env.CUSTOMER_REPORT_IDS),
    };
  }
  return { kind: "anonymous" };
}

export function isReportAllowed(scope: ViewerScope, reportId: string): boolean {
  if (scope.kind === "internal") return true;
  if (scope.kind === "customer") return scope.allowedReportIds.includes(reportId);
  return false;
}
