import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import ApplicationsClient from "./ApplicationsClient";

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <ApplicationsClient />;
}
