export const getCheckList = `
    SELECT 
        ce.checklist_id,
        ce.cc_empleado,
        ce.tipo_examen_id,
        ce.estado AS esta_activo,
        ce.es_requerido,
        te.nombre,
        te.estado AS estado_tipo_examen,
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
                AND ci.estado = 'Aprobado'
                AND (ci.fecha_vencimiento IS NULL OR ci.fecha_vencimiento > GETDATE())
            ) THEN 'Bien'
            
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
                AND ci.estado IN ('Aprobado', 'Completado')
                AND ci.fecha_vencimiento <= GETDATE()
            ) THEN 'Vencido'
            
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
                AND ci.estado = 'Aprobado'
                AND ci.fecha_vencimiento > GETDATE() 
                AND DATEDIFF(DAY, GETDATE(), ci.fecha_vencimiento) <= 30
            ) THEN 'Proximo a vencer'
            
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
                AND ci.estado IN ('Procesando', 'En revisión', 'Completado', 'Programado')
                AND ci.checklist_item_id = (
                    SELECT TOP 1 ci2.checklist_item_id
                    FROM checklist_items ci2
                    WHERE ci2.checklist_id = ce.checklist_id
                    AND ci2.nombre = te.nombre
                    ORDER BY ci2.fecha_realizado DESC
                )
            ) THEN 'En proceso'
            
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
                AND ci.estado IN ('Rechazado', 'Observado')
                AND ci.checklist_item_id = (
                    SELECT TOP 1 ci2.checklist_item_id
                    FROM checklist_items ci2
                    WHERE ci2.checklist_id = ce.checklist_id
                    AND ci2.nombre = te.nombre
                    ORDER BY ci2.fecha_realizado DESC
                )
            ) THEN 'Requiere acción'
            
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
                AND ci.estado = 'No requerido'
                AND ci.checklist_item_id = (
                    SELECT TOP 1 ci2.checklist_item_id
                    FROM checklist_items ci2
                    WHERE ci2.checklist_id = ce.checklist_id
                    AND ci2.nombre = te.nombre
                    ORDER BY ci2.fecha_realizado DESC
                )
            ) THEN 'No requerido'
            
            WHEN EXISTS (
                SELECT 1 
                FROM checklist_items ci
                WHERE ci.checklist_id = ce.checklist_id
                AND ci.nombre = te.nombre
            ) THEN 'Pendiente'
            
            ELSE 'Sin información'
        END AS estado_examen
    FROM 
        checklist_examenes ce
        INNER JOIN tipos_examenes te ON ce.tipo_examen_id = te.tipo_examen_id
    WHERE ce.cc_empleado = @userDocument
`