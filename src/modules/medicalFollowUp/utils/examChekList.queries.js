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
        -- 1. Verificar si existe al menos un examen 'Completado' o 'Aprobado' vigente (no vencido)
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Completado', 'Aprobado')
            AND (ci.fecha_vencimiento IS NULL OR ci.fecha_vencimiento > GETDATE())
        ) THEN 'Bien'
        
        -- 2. Si hay un examen 'Completado' o 'Aprobado' próximo a vencer (30 días o menos)
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Completado', 'Aprobado')
            AND ci.fecha_vencimiento IS NOT NULL
            AND ci.fecha_vencimiento > GETDATE() 
            AND DATEDIFF(DAY, GETDATE(), ci.fecha_vencimiento) <= 30
        ) THEN 'Proximo a vencer'
        
        -- 3. Si todos los exámenes 'Completado' o 'Aprobado' están vencidos
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Completado', 'Aprobado')
        ) AND NOT EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Completado', 'Aprobado')
            AND (ci.fecha_vencimiento IS NULL OR ci.fecha_vencimiento > GETDATE())
        ) THEN 'Vencido'
        
        -- 4. Si hay exámenes en proceso (más reciente)
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Procesando', 'En revisión', 'Programado', 'En espera')
            AND ci.checklist_item_id = (
                SELECT TOP 1 ci2.checklist_item_id
                FROM checklist_items ci2
                WHERE ci2.checklist_id = ce.checklist_id
                ORDER BY 
                    CASE WHEN ci2.fecha_realizado IS NOT NULL THEN ci2.fecha_realizado
                         WHEN ci2.fecha_vencimiento IS NOT NULL THEN ci2.fecha_vencimiento
                         ELSE GETDATE()
                    END DESC
            )
        ) THEN 'En proceso'
        
        -- 5. Si el último examen fue rechazado, observado o expirado
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Rechazado', 'Observado', 'Expirado')
            AND ci.checklist_item_id = (
                SELECT TOP 1 ci2.checklist_item_id
                FROM checklist_items ci2
                WHERE ci2.checklist_id = ce.checklist_id
                ORDER BY 
                    CASE WHEN ci2.fecha_realizado IS NOT NULL THEN ci2.fecha_realizado
                         WHEN ci2.fecha_vencimiento IS NOT NULL THEN ci2.fecha_vencimiento
                         ELSE GETDATE()
                    END DESC
            )
        ) THEN 'Requiere acción'
        
        -- 6. Si está marcado como no requerido (más reciente)
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado = 'No requerido'
            AND ci.checklist_item_id = (
                SELECT TOP 1 ci2.checklist_item_id
                FROM checklist_items ci2
                WHERE ci2.checklist_id = ce.checklist_id
                ORDER BY 
                    CASE WHEN ci2.fecha_realizado IS NOT NULL THEN ci2.fecha_realizado
                         WHEN ci2.fecha_vencimiento IS NOT NULL THEN ci2.fecha_vencimiento
                         ELSE GETDATE()
                    END DESC
            )
        ) THEN 'No requerido'
        
        -- 7. Si hay exámenes cancelados o reprogramados (más reciente)
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
            AND ci.estado IN ('Cancelado', 'Reprogramado')
            AND ci.checklist_item_id = (
                SELECT TOP 1 ci2.checklist_item_id
                FROM checklist_items ci2
                WHERE ci2.checklist_id = ce.checklist_id
                ORDER BY 
                    CASE WHEN ci2.fecha_realizado IS NOT NULL THEN ci2.fecha_realizado
                         WHEN ci2.fecha_vencimiento IS NOT NULL THEN ci2.fecha_vencimiento
                         ELSE GETDATE()
                    END DESC
            )
        ) THEN 'Cancelado/Reprogramado'
        
        -- 8. Si solo hay pendientes o existe algún registro
        WHEN EXISTS (
            SELECT 1 
            FROM checklist_items ci
            WHERE ci.checklist_id = ce.checklist_id
        ) THEN 'Pendiente'
        
        -- 9. Sin información si no hay registros en checklist_items
        ELSE 'Sin información'
    END AS estado_examen,
    
    -- Información adicional útil
    (SELECT COUNT(*) 
     FROM checklist_items ci 
     WHERE ci.checklist_id = ce.checklist_id) AS total_items,
     
    (SELECT TOP 1 ci.estado
     FROM checklist_items ci
     WHERE ci.checklist_id = ce.checklist_id
     ORDER BY 
         CASE WHEN ci.fecha_realizado IS NOT NULL THEN ci.fecha_realizado
              WHEN ci.fecha_vencimiento IS NOT NULL THEN ci.fecha_vencimiento
              ELSE GETDATE()
         END DESC) AS ultimo_estado,
         
    (SELECT TOP 1 ci.fecha_vencimiento
     FROM checklist_items ci
     WHERE ci.checklist_id = ce.checklist_id
     AND ci.estado IN ('Completado', 'Aprobado')
     AND ci.fecha_vencimiento IS NOT NULL
     ORDER BY ci.fecha_vencimiento ASC) AS proxima_fecha_vencimiento

FROM 
    checklist_examenes ce
    INNER JOIN tipos_examenes te ON ce.tipo_examen_id = te.tipo_examen_id
WHERE ce.cc_empleado = @userDocument AND te.nombre NOT IN ('Ingreso', 'Egreso') ORDER BY ce.checklist_id;
`