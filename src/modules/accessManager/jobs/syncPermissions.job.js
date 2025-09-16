import cron from "node-cron";
import { PermissionsClass } from "../services/permissions.manager.js";
import { examRecordsPermissions } from '../../examRecords/utils/permissions.js';
import { medicalFollowUpPermissions } from "../../medicalFollowUp/utils/permissions.js";

export const allPermissions = {
  ...examRecordsPermissions,
  ...medicalFollowUpPermissions,
};

await PermissionsClass.syncPermissions(Object.values(allPermissions));
await PermissionsClass.syncAdminPermissions(Object.values(allPermissions));

cron.schedule("0 16 * * *", async () => {
  console.log("⏰ Ejecutando sincronización diaria de permisos...");
  await PermissionsClass.syncPermissions(Object.values(allPermissions));
  await PermissionsClass.syncAdminPermissions(Object.values(allPermissions));
}, {
  timezone: "America/Bogota" 
});